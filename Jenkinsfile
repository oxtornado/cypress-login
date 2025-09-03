pipeline {
    agent any

    environment {
        NODE_VERSION = '18.x'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/oxtornado/cypress-login.git', 'main' // Specify the branch here
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                # Install Node.js
                curl -sL https://deb.nodesource.com/setup_${NODE_VERSION} | sudo -E bash -
                sudo apt-get install -y nodejs

                # Install Cypress
                npm install cypress --save-dev

                # Install Xvfb
                sudo apt-get update
                sudo apt-get install -y xvfb
                '''
            }
        }

        stage('Run Cypress Tests') {
            steps {
                sh 'npx cypress run'
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
