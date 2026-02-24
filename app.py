import os
import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-prod')

GITHUB_USERNAME = 'kskreddy2k7'
GITHUB_LINKEDIN = 'https://www.linkedin.com/in/kata-sai-kranthu-reddy-b02848377'


def fetch_github_stats():
    try:
        headers = {'Accept': 'application/vnd.github.v3+json'}
        token = os.environ.get('GITHUB_TOKEN')
        if token:
            headers['Authorization'] = f'token {token}'

        user_resp = requests.get(
            f'https://api.github.com/users/{GITHUB_USERNAME}',
            headers=headers, timeout=5
        )
        repos_resp = requests.get(
            f'https://api.github.com/users/{GITHUB_USERNAME}/repos?per_page=100',
            headers=headers, timeout=5
        )

        repo_count = 0
        languages = {}

        if user_resp.status_code == 200:
            repo_count = user_resp.json().get('public_repos', 0)

        if repos_resp.status_code == 200:
            repos = repos_resp.json()
            for repo in repos:
                lang = repo.get('language')
                if lang:
                    languages[lang] = languages.get(lang, 0) + 1

        top_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)[:5]
        return {'repo_count': repo_count, 'top_languages': top_languages}
    except Exception:
        return {'repo_count': 0, 'top_languages': []}


CHATBOT_RESPONSES = {
    'skills': (
        "Kranthu is skilled in <strong>Python</strong>, <strong>Flask</strong>, "
        "<strong>NLP</strong>, and Machine Learning libraries like <strong>Pandas</strong> and <strong>NumPy</strong>. "
        "He also has experience with <strong>Java</strong> for Android development."
    ),
    'projects': (
        "Kranthu's key projects include:<br>"
        "• <strong>AI Resume Screening System</strong> – NLP parsing and ML ranking<br>"
        "• <strong>Speech-to-Text Python</strong> – Real-time audio processing<br>"
        "• <strong>Quiz AI App</strong> – Dynamic quiz engine with SQLite<br>"
        "• <strong>Smart AutoCorrect Keyboard</strong> – Android IME (Java)"
    ),
    'contact': (
        "You can reach Kranthu via:<br>"
        "• <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/kata-sai-kranthu-reddy-b02848377' "
        "target='_blank' style='color:#00d4ff'>linkedin.com/in/kata-sai-kranthu-reddy</a><br>"
        "• <strong>GitHub:</strong> <a href='https://github.com/kskreddy2k7' "
        "target='_blank' style='color:#00d4ff'>github.com/kskreddy2k7</a><br>"
        "• Or use the <strong>Contact Form</strong> on this page!"
    ),
    'experience': (
        "Kranthu is a 1st-year student building his experience through **Academic & Personal Projects**. "
        "His most significant work is an <strong>AI Resume Screening System</strong> using Flask and NLTK, "
        "alongside several AI and backend tools on GitHub."
    ),
    'education': (
        "Kranthu is currently a 1st Year B.Tech student in Computer Science & Engineering (AI/ML) "
        "at <strong>SRM University, Kattankulathur</strong>. He is focused on applying his "
        "learning to real-world AI projects."
    ),
    'certifications': (
        "Kranthu has completed certifications in <strong>Python Programming</strong>, "
        "<strong>AI & Machine Learning</strong>, and <strong>Web Development</strong>."
    ),
    'hello': (
        "Hi there! 👋 I'm Kranthu's AI assistant. Ask me about his "
        "<strong>skills</strong>, <strong>projects</strong>, or how to <strong>contact</strong> him!"
    ),
    'default': (
        "I can help you learn about Kranthu's <strong>skills</strong>, "
        "<strong>projects</strong>, <strong>academic work</strong>, or <strong>contact</strong> details. "
        "What would you like to know?"
    ),
}


def get_chatbot_response(message):
    msg = message.lower().strip()
    if any(w in msg for w in ['hello', 'hi', 'hey', 'greet']):
        return CHATBOT_RESPONSES['hello']
    if any(w in msg for w in ['skill', 'know', 'language', 'tech', 'stack', 'python', 'flask', 'java']):
        return CHATBOT_RESPONSES['skills']
    if any(w in msg for w in ['project', 'built', 'work', 'resume', 'autocorrect', 'quiz', 'speech']):
        return CHATBOT_RESPONSES['projects']
    if any(w in msg for w in ['contact', 'reach', 'email', 'linkedin', 'github', 'hire', 'connect']):
        return CHATBOT_RESPONSES['contact']
    if any(w in msg for w in ['experience', 'year', 'background', 'history']):
        return CHATBOT_RESPONSES['experience']
    if any(w in msg for w in ['education', 'study', 'degree', 'college', 'university']):
        return CHATBOT_RESPONSES['education']
    if any(w in msg for w in ['certif', 'course', 'training']):
        return CHATBOT_RESPONSES['certifications']
    return CHATBOT_RESPONSES['default']


@app.route('/')
def index():
    github_stats = fetch_github_stats()
    return render_template('index.html', github_stats=github_stats,
                           github_username=GITHUB_USERNAME)


@app.route('/blog')
def blog():
    return render_template('blog.html')


@app.route('/contact', methods=['POST'])
def contact():
    data = request.get_json(silent=True) or request.form
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    message = (data.get('message') or '').strip()

    errors = {}
    if not name or len(name) < 2:
        errors['name'] = 'Name must be at least 2 characters.'
    if not email or '@' not in email or '.' not in email.split('@')[-1]:
        errors['email'] = 'Please enter a valid email address.'
    if not message or len(message) < 10:
        errors['message'] = 'Message must be at least 10 characters.'

    if errors:
        return jsonify({'success': False, 'errors': errors}), 400

    return jsonify({
        'success': True,
        'message': f"Thanks {name}! Your message has been received. I'll get back to you soon."
    })


@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json(silent=True) or request.form
    user_message = (data.get('message') or '').strip()
    if not user_message:
        return jsonify({'success': False, 'response': 'Please send a message.'}), 400
    response = get_chatbot_response(user_message)
    return jsonify({'success': True, 'response': response})


if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
