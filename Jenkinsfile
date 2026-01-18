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
                TEST_USER_NAME = 'consultant' // Fallback oder auch als Credential
                TEST_USER_PASSWORD = 'pwd'
            }
            steps {
                dir('e2e-tests') {
                    echo "🚀 Running Tests in Docker..."
                    // Startet die Tests in Docker
                    // Variablen aus dem environment Block werden automatisch an sh weitergereicht
                    // und docker compose übernimmt sie, weil sie im docker-compose.yml definiert sind.
                    sh "docker compose up --exit-code-from maven"
                }
            }
        }
    }

    // Aufräumen nach dem Lauf
    post {
        always {
            dir('e2e-tests') {
                echo "🧹 Cleaning up Docker resources..."
                sh "docker compose down"
            }
            // Optional: Altes Image löschen um Disk Space zu sparen
            // sh "docker rmi ${IMAGE_NAME} || true"
        }
    }
}
