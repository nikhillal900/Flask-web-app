pipeline {
    agent any

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

                # Copy files to deploy directory
                cp -r . /var/www/flask-app/

                # Start new version
                cd /var/www/flask-app/
                nohup python3 app.py > app.log 2>&1 &
                '''
            }
        }
    }
}
