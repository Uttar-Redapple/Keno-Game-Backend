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
                sh 'pm2 delete keno-api'
                sh 'pm2 start "npm start" --name keno-api'
            }
        }
    }
    
    // post {
    //     always {
    //         // Clean up or other post-build actions
    //     }
    // }
}
