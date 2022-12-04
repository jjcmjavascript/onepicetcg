1) Clone the proyect and  npm install 
2) Create db 
3) Create .env in  root folder
  NODE_ENV=dev 
  TEST_DB_NAME=onepiece
  TEST_DB_USER=root 
  TEST_DB_PASS=yourpassword
  TEST_DB_HOST=DOCKER_SERVICE_NAME
  TEST_DB_PORT=3307

APP_PORT=4000
    
4) npm run migrate:dev