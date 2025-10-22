pipeline {
    agent any

    stages {
        stage('Clone Repository on Jenkins') {
            steps {
                git branch: 'main', url: 'https://github.com/nikhillal900/Flask-web-app.git'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['app-ec2-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@43.204.148.106 '
                        # Clone repo if it doesn't exist
                        if [ ! -d ~/Flask-web-app ]; then
                            git clone https://github.com/nikhillal900/Flask-web-app.git ~/Flask-web-app
                        else
                            cd ~/Flask-web-app && git reset --hard && git pull
                        fi

                        # Navigate to backend folder
                        cd ~/Flask-web-app/backend

                        # Create virtual environment if missing
                        if [ ! -d ../vnv ]; then
                            python3 -m venv ../vnv
                        fi

                        # Activate virtual environment
                        source ../vnv/bin/activate

                        # Upgrade pip and install dependencies
                        pip install --upgrade pip
                        pip install -r ../requirements.txt

                        # Stop previous app if running
                        pkill -f "python3 app.py" || true

                        # Start Flask app in background
                        nohup python3 app.py > app.log 2>&1 &
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}

