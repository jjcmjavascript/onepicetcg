1) Clone the proyect
2) Create db 
3) Create .env in  root folder
    # ENVIRONMENT MODE
    MODE=dev

    # DATABASE
    TEST_DB_USER=
    TEST_DB_PASS=
    TEST_DB_NAME=
    TEST_DB_HOST=

    # PAGES FOR SCRAPPING
    PAGE_TO_GET_NAMES=

2) in root folder execute :  node -e 'require("./app/scripts/image_scrapper")()'
2) in root folder execute : node -e 'require("./app/scripts/manual_seeder")()'