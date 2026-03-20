import os
from flask import Flask, render_template

# Initialize a dummy Flask app to render templates
app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SERVER_NAME'] = 'localhost'

# Register essential routes to avoid BuildErrors in url_for
@app.route('/')
def index(): pass

@app.route('/blog')
def blog(): pass

@app.route('/chatbot', methods=['POST'])
def chatbot(): pass

@app.route('/contact', methods=['POST'])
def contact(): pass

# Mock data for rendering
GITHUB_USERNAME = 'kskreddy2k7'
github_stats = {
    'repo_count': 12,
    'top_languages': [('Python', 8), ('JavaScript', 4), ('HTML', 2)]
}

def export_site():
    print("🚀 Starting static export for GitHub Pages...")
    
    # Ensure we are in the right directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # We use test_request_context to satisfy url_for's need for a request environment
    with app.test_request_context():
        # Render the index template with static_mode=True
        html = render_template('index.html', 
                               github_stats=github_stats, 
                               github_username=GITHUB_USERNAME,
                               static_mode=True)
        
        # Write to index.html in the root for GitHub Pages
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
            
    print("✅ Export complete: index.html has been generated in the project root.")
    print("💡 To deploy to GitHub Pages:")
    print("   1. Push the project to GitHub (including index.html and static/).")
    print("   2. Go to Repository Settings > Pages.")
    print("   3. Select 'Deploy from a branch' and choose 'main' (root).")
    print("⚠️  Backend Note: The Chatbot and Contact Form require a real server (Flask).")
    print("   The GH Pages version will be a static showcase.")

if __name__ == '__main__':
    export_site()
