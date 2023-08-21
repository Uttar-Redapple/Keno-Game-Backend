pipeline {
    agent any

    environment {
        NVM_VERSION = '16.20.2'  // Specify the desired Node.js version
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    sh 'export NVM_DIR="$HOME/.nvm"'
                    sh '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"'
                    sh '[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"'
                    sh "nvm install $NVM_VERSION"
                    sh "nvm use $NVM_VERSION"
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        // stage('Build') {
        //     steps {
        //         sh 'npm run build'
        //     }
        // }
        
        stage('Deploy') {
            steps {
                sh 'cp -R * /var/www/html/Keno-Game-Backend'
            }
        }
        
        stage('Start Application') {
            steps {
                script {
                    sh 'sudo su ubuntu'
                    def pm2ListOutput = sh(returnStdout: true, script: 'pm2 list').trim()

                    // if (pm2ListOutput.contains('keno-api')) {
                    //     sh 'pm2 delete keno-api'
                    //     //sh 'sudo /home/ubuntu/.nvm/versions/node/v18.12.1/bin/pm2 delete keno-api'  // Delete the process if found
                    // }

                    sh 'pm2 start "npm start" --name keno-api --namespace keno-api'

                    //sh 'sudo /home/ubuntu/.nvm/versions/node/v18.12.1/bin/pm2 start "npm start" --name keno-api --namespace keno-api'  // Start the process
                }
            }
        }
    }
    // post {
    //     always {
    //         // Clean up or other post-build actions
    //     }
    // }
}
