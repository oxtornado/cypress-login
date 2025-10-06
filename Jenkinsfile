pipeline {
    agent {
        docker {
            image 'cypress/included:13.16.1'
            args '-v $PWD:/app -w /app'
        }
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/oxtornado/login-cypress.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Start Server & Run Tests') {
            steps {
                sh '''
                # Start server in background
                node server.js &
                SERVER_PID=$!
                
                # Wait for server
                npx wait-on http://localhost:8080 -t 30000 || (echo "Server failed to start" && kill $SERVER_PID && exit 1)
                
                # Run Cypress
                npx cypress run
                
                # Kill server
                kill $SERVER_PID
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'cypress/videos/**/*.mp4', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true
        }
    }
}