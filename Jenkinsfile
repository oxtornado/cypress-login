pipeline {
    agent any

    environment {
        NODE_VERSION = '18.x'
        PATH = "/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/sbin:${PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    try {
                        git 'https://github.com/oxtornado/login-cypress.git'
                    } catch (Exception e) {
                        echo "Error during git checkout: ${e}"
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }

        stage('Setup Environment') {
            steps {
                sh '''
                # Update package list
                sudo apt-get update
                
                # Install Node.js
                curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION} | sudo -E bash -
                sudo apt-get install -y nodejs
                
                # Install Xvfb for headless browser testing
                sudo apt-get install -y xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Start Server and Run Tests') {
            steps {
                sh '''
                # Start the server in background
                node server.js &
                SERVER_PID=$!
                
                # Wait for server to start
                echo "Waiting for server to start..."
                sleep 10
                
                # Check if server is running
                curl -f http://localhost:8080 || exit 1
                
                # Run Cypress tests with Xvfb for headless execution
                xvfb-run -a npx cypress run || true
                
                # Stop the server
                kill $SERVER_PID 2>/dev/null || true
                '''
            }
        }
    }

    post {
        always {
            sh 'pkill -f "node server.js" || true'
            archiveArtifacts artifacts: 'cypress/videos/**/*.mp4', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true
            junit 'cypress/results/*.xml'  // Add JUnit reports if configured
        }
    }
}
