const fs = require("fs"); 

const jsonFile = fs.readFileSync("./data.json", "utf8");

const jsonParse = JSON.parse(jsonFile);

