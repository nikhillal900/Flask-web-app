pipeline {
    agent any

    environment {
        SECRET_KEY = credentials('flask-secret-key')  // Jenkins secret
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/nikhillal900/Flask-web-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                python3 -m venv venv
                . venv/bin/activate
                pip install -r requirements.txt
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                # Stop existing Flask app if running
                pkill -f "python3 app.py" || true

                # Copy only necessary files (ignore .git)
                rsync -av --exclude='.git' ./ /var/www/flask-app/
                
                # Inject SECRET_KEY from Jenkins
                export SECRET_KEY=$SECRET_KEY
                
                # Start new version
                cd /var/www/flask-app/
                nohup python3 app.py > app.log 2>&1 &
                '''
            }
        }
    }
}
