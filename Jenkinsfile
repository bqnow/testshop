pipeline {
    agent any

    environment {
        // App Konfiguration
        IMAGE_NAME = "ghcr.io/bqnow/testshop:latest"
        TEST_ENV = "jenkins_ci_local"
    }

    stages {
        // 1. Applikation bauen
        stage('Build App Image') {
            steps {
                script {
                    echo "🔨 Building TestShop Docker Image..."
                    // Wir bauen das Image mit dem Tag 'latest', damit die Tests es finden
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        // 2. Test-Framework vorbereiten
        stage('Checkout E2E Tests') {
            steps {
                dir('e2e-tests') {
                    echo "📥 Cloning Java Playwright Template..."
                    // Wir holen uns das Java-Test-Framework in einen Unterordner
                    git branch: 'main', url: 'https://github.com/bqnow/testshop-playwright-java-template.git'
                }
            }
        }

        // 3. Tests ausführen
        stage('Run E2E Tests') {
            environment {
                GRAFANA_LOKI_URL = credentials('GRAFANA_LOKI_URL')
                GRAFANA_LOKI_USER = credentials('GRAFANA_LOKI_USER')
                GRAFANA_LOKI_KEY = credentials('GRAFANA_LOKI_KEY')
                TEST_ENV = "jenkins_ci_local"
            }
            steps {
                dir('e2e-tests') {
                    echo "🚀 Running Tests in Docker..."
                    // Startet die Tests in Docker
                    // Wir fangen Fehler ab (catchError), damit wir trotzdem reporten können
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        sh "docker compose up --exit-code-from maven"
                    }
                    
                    echo "📊 Extracting Test Reports..."
                    
                    // Kopiere Reports aus dem Container (maven service)
                    // Pfad: /app/target/surefire-reports (Maven Standard im Container)
                    sh "docker compose cp maven:/app/target/surefire-reports ./test-reports || true"
                }
            }
        }
    }

    // Aufräumen nach dem Lauf
    post {
        always {
            dir('e2e-tests') {
                // Veröffentliche JUnit Reports im Jenkins UI
                junit testResults: 'test-reports/**/*.xml', allowEmptyResults: true
                
                echo "🧹 Cleaning up Docker resources..."
                sh "docker compose down"
            }
        }
    }
}

