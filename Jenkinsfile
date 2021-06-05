pipeline {
    agent any
    stages {
        stage('SAST') {
            parallel {
                stage('Backend') {
                    stages {
                        stage("SCA Backend") {
                            steps {
                                echo "Performing static code analysis for backend ..."
                                sh '''sudo su - mr_pool -c 'cd /home/mr_pool/pools-app/scripts/;./semgrep_scan.py --source /var/lib/jenkins/workspace/PoolsApp_main/Pools-App-Backend/ --config=p/r2c-ci --export-format mysql --host 192.168.1.24 &> /dev/null &' ''' 
                            }
                        }
                        stage("Dependency Checker Backend") {
                            steps {
                                echo "Scanning dependencies for vulnerabilites ..."
                                sh '''sudo su - mr_pool -c 'cd /home/mr_pool/pools-app/scripts/;./npmaudit_scan.py --source /var/lib/jenkins/workspace/PoolsApp_main/Pools-App-Backend/ --export-format mysql --host 192.168.1.24 &> /dev/null &' '''
                            }
                        }
                    }
                }
                stage('Frontend') {
                    stages {
                        stage("SCA Frontend") {
                            steps {
                                echo "Performing static code analysis for frontend ..."
                                sh '''sudo su - mr_pool -c 'cd /home/mr_pool/pools-app/scripts/;./semgrep_scan.py --source /var/lib/jenkins/workspace/PoolsApp_main/Pools-App-Frontend/ --config=p/r2c-ci --export-format mysql --host 192.168.1.24 &> /dev/null &' ''' 
                            }
                        }
                        stage("Dependency Checker Frontend") {
                            steps {
                                echo "Scanning dependencies for vulnerabilites ..."
                                sh '''sudo su - mr_pool -c 'cd /home/mr_pool/pools-app/scripts/;./npmaudit_scan.py --source /var/lib/jenkins/workspace/PoolsApp_main/Pools-App-Frontend/ --export-format mysql --host 192.168.1.24 &> /dev/null &' '''
                            }
                        }
                    }
                }
            }
        }
        stage('BUILD') {
            parallel {
                stage('Build Backend') {
                    steps {
                        echo "Building Backend ..."
                        sh script:'''
                        #!/bin/bash
                        cd Pools-App-Backend
                        sudo npm install
                        '''
                    }
                }
                stage('Build Frontend') {
                    steps {
                        echo "Building Frontend ..."
                        sh script:'''
                        #!/bin/bash
                        cd Pools-App-Frontend
                        sudo npm install
                        ./node_modules/.bin/ng build --prod
                        '''
                    }
                }
            }
        }
        stage('DEPLOY') {
            parallel {
                stage("Deploy Backend") {
                    steps {
                        echo "Deploying backend ..."
                        sh "sudo su - mr_pool -c 'pm2 restart index'"
                    }
                }
                stage("Deploy Frontend") {
                    steps {
                        echo "Deploying Frontend ..."
                        sh script:'''
                        #!/bin/bash
                        cd Pools-App-Frontend
                        sudo rm -rf /var/www/pools-app-frontend/*
                        sudo mv ./dist/Pools-App-Frontend/* /var/www/pools-app-frontend/ -f
                        '''
                    }
                }
            }

        }
        stage('DAST') {
            steps {
                echo "DAST stage"
                sh '''sudo su - mr_pool -c 'cd /home/mr_pool/pools-app/scripts/;./nikto_scan.py --target http://poolsapp.frontend.com:81 --export-format mysql --host 192.168.1.24 &> /dev/null &' '''
            }
        }
        stage('COMPLIANCE') {
            steps {
                echo "Compliance checker stage"
                sh '''sudo su - mr_pool -c 'cd /home/mr_pool/pools-app/scripts/;./sebaz_scan.py --export-format mysql --host 192.168.1.24 &> /dev/null &' '''
            }
        }
    }
    post{
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}