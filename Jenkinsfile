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
                cd /var/www/flask-app/
                sudo python3 -m venv venv
                source venv/bin/activate
                sudo venv/bin/pip install -r requirements.txt
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                # Stop existing Flask app if running
                sudo pkill -f "python3 main.py" || true

                # Copy files to deploy directory
                sudo cp -r . /var/www/flask-app/

                # Start new version
                sudo nohup python3 /var/www/flask-app/main.py > /var/www/flask-app/app.log 2>&1 &
                '''
            }
        }
    }
}
