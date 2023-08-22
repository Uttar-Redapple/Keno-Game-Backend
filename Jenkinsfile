pipeline {
    agent any    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Project') {
            steps {
                script {
                    sh "chmod +x setup.sh"
                    sh "./setup.sh"
                }
            }
        }
        
        // stage('Install Dependencies') {
        //     steps {
        //         sh 'npm install'
        //     }
        // }
        
        // stage('Build') {
        //     steps {
        //         sh 'npm run build'
        //     }
        // }
        
        // stage('Deploy') {
        //     steps {
        //         sh 'cp -R * /var/www/html/Keno-Game-Backend'
        //     }
        // }
        
        // stage('Start Application') {
        //     steps {
        //         script {
        //             sh "pm2 restart all"
        //         }
        //     }
        // }
    }
    // post {
    //     always {
    //         // Clean up or other post-build actions
    //     }
    // }
}
