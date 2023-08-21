pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
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
                    def pm2ListOutput = sh(returnStdout: true, script: 'pm2 list').trim()

                    if (pm2ListOutput.contains('keno-api')) {
                        sh '/home/ubuntu/.nvm/versions/node/v18.12.1/bin/pm2 delete keno-api'  // Delete the process if found
                    }

                    sh '/home/ubuntu/.nvm/versions/node/v18.12.1/bin/pm2 start "npm start" --name keno-api --namespace keno-api'  // Start the process
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
