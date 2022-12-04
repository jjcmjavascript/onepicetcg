const fs = require("fs"); 

const jsonFile = fs.readFileSync("./data.json", "utf8");

const jsonParse = JSON.parse(jsonFile);

const client = async (imgName, size = 'little')=>{  
  return axios.get(`https://nakamadecks.com/imgs/cards/${size}/${imgName}`); 
}

const colors = {}; 
const types = {}
const packs = {};
const files = {}; 
const categorys = {}; 

const fillDB = async () => { 

}; 