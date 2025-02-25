pipeline {
    agent {
      docker {
        image 'mcr.microsoft.com/playwright:v1.50.1-noble'
        args '--netowork qatw-primeira-edicao_skynet'
      }
    }

    stages {
        stage('Node.js Deps') {
            steps {
                sh 'npm install'
            }
        }
        stage('E2E Testes') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
    
}
