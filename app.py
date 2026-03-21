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
        "Kranthu's featured showcase includes 6 premium projects:<br>"
        "• <strong>Sri Sai Traders</strong> (Web) – <a href='https://kskreddy2k7.github.io/-Sri-Sai-Traders-website/' target='_blank' style='color:#00f3ff'>Demo</a><br>"
        "• <strong>Portfolio OS</strong> (Web) – <a href='https://kskreddy2k7.github.io/kranthu-ai-portfolio/' target='_blank' style='color:#00f3ff'>Current Site</a><br>"
        "• <strong>AI Resume Screener</strong> (AI) – <a href='https://kskreddy2k7.github.io/ai-resume-screening-system/' target='_blank' style='color:#00f3ff'>Demo</a><br>"
        "• <strong>AI Voice OS</strong> (AI) – <a href='https://kskreddy2k7.github.io/KSKR-AI-Voice-Operating-System/' target='_blank' style='color:#00f3ff'>Demo</a><br>"
        "• <strong>Smart Keyboard</strong> (Apps) – <a href='https://kskreddy2k7.github.io/Smart-AutoCorrect-Keyboard/' target='_blank' style='color:#00f3ff'>Demo</a><br>"
        "• <strong>Quiz AI App</strong> (AI) – <a href='https://github.com/kskreddy2k7/quiz-ai-app' target='_blank' style='color:#00f3ff'>Repo</a>"
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
        "Kranthu is currently a 1st-year B.Tech student (2025-29) building his experience through **Academic & Personal Projects**. "
        "He completed his Intermediate education (MPC) in 2025 and his CBSE Class 10th in 2023."
    ),
    'education': (
        "Kranthu is a 1st Year B.Tech student in Computer Science & Engineering (AI/ML) "
        "at <strong>SRM University, KTR</strong> (Batch 2025-29). Previously, he completed "
        "his Intermediate (MPC) in 2025 and Schooling (CBSE) in 2023."
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
    
    # OS-style Slash Commands
    if msg == '/whoami':
        return CHATBOT_RESPONSES['experience']
    if msg == '/skills':
        return CHATBOT_RESPONSES['skills']
    if msg == '/projects':
        return CHATBOT_RESPONSES['projects']
    if msg == '/contact':
        return CHATBOT_RESPONSES['contact']
    if msg == '/logs':
        return CHATBOT_RESPONSES['experience']
    if msg == '/resume' or 'resume' in msg:
        return (
            "You can download Kranthu's latest resume here: "
            "<a href='/static/resume/Kata_Sai_Kranthu_Reddy_Resume.docx' target='_blank' "
            "style='color:#00d4ff'>[DOWNLOAD_RESUME.pdf]</a>"
        )

    # Keyword Matching
    if any(w in msg for w in ['hello', 'hi', 'hey', 'greet']):
        return CHATBOT_RESPONSES['hello']
    if any(w in msg for w in ['skill', 'know', 'language', 'tech', 'stack', 'python', 'flask', 'java']):
        return CHATBOT_RESPONSES['skills']
    if any(w in msg for w in ['project', 'built', 'work', 'autocorrect', 'quiz', 'speech']):
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
