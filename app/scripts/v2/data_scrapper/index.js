const axios = require('axios');
const fs = require('fs'); 

const client = async (page = 1)=>{
  console.log("Fetching page: " + page);
  
  return axios.get(`https://nakamadecks.com/getFilteredCards?search=&text=&power_type==&orderVar=code&orderDir=ASC&rows=120&page=${page}&collection=non-active`); 
}

(async ()=>{
  let finalObj = [];

  page = 1;

  while(true){
    
    const {data} = await client(page);
    
    console.log("Mergin data for page:" + page);
    
    finalObj.push(...data.data);

    page++; 
    
    if(data.data.length == 0) {
      console.log("No more data, breaking");
      
      break
    }; 
  } 
  
  console.log("Writing file");

  fs.writeFile(__dirname + '/data.json', JSON.stringify(finalObj), (err)=>{
    if(err){
      console.log(err);
    }
  });

  console.log("End of script");
})()
