const path = require('path'); 
const fs = require('fs');
const axios  = require('axios');
const {red, blue, green, purple, dons} = require('./urls');

const getImageStream = (url)=>{
    return axios(url, { responseType: 'stream'});
};

const createFolders = (route, created_routes = {}) =>{
    return new Promise((resolve, reject) =>{
        if(created_routes[route]) resolve(); 

        fs.mkdir(route, { recursive: true , mode: 0o777 }, function(err){
            if(err) { console.log(err); reject(err)};

            resolve("todo ok");
        });
    }); 
}

const getNamesFromUrl = (url)=>{
    const url_parts = url.match(/.*\/(\w+-\w{1,3})(_)?(Alt)?/); 

    console.log(url, url_parts);
    return {
        name: url.replace(/.*\/(.*)/g, '$1'),
        folder_name : url_parts[1],
        is_alternative : url_parts[3] != undefined, 
    } 
}

const createImageStream = (data, image_writer)=>{
    return new Promise((resolve, reject) =>{
        data.pipe(image_writer);         
        data.on('end', resolve); 
        data.on('error', reject); 
    });
}
const downloadImage = async(arr, color)=>{
    const base_route = '../public/images'; 
    let created_routes = {}; 

    try{
        while(arr.length > 0){
            //get urls
            let image_url = arr[0];
            let full_image_url = arr[0].replace('little', 'full');
            
            //get formated names
            let {name, folder_name} = getNamesFromUrl(image_url); 
            let folder_route = `${base_route}/${color}/${folder_name}`; 

            //create routes
            await createFolders(folder_route, created_routes);

            //get small images buffers
            let small_card_route = `${folder_route}/${name}`;
            console.log(small_card_route)
            const { data : _image_data } = await getImageStream(image_url);
            const image_writer = fs.createWriteStream(small_card_route);    
            
            await createImageStream(_image_data, image_writer); 

            // const { data : _full_image_data} = await getImageStream(image_url);
            
            // const full_image_writer = fs.createWriteStream(`${folder_route}/full_${name}`);    

            // _full_image_data.pipe(full_image_writer); 

            arr.splice(0,1);
        }
    }
    catch(e){
        console.error(e);
    }
};

module.exports = ()=>{
    red.length = 2; 
    downloadImage(red, 'red')
}; 

