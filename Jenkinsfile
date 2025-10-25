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
                pip3 install --user -r requirements.txt
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                # Stop existing Flask app if running
                pkill -f "python3 main.py" || true

                # Copy files to deploy directory
                cp -r . /var/www/flask-app/

                # Start new version
                nohup python3 /var/www/flask-app/main.py > /var/www/flask-app/app.log 2>&1 &
                '''
            }
        }
    }
}
