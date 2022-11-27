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
    const url_parts = url.split("/");
    folder_name = url_parts[url_parts.length - 1]
        .replace('_Alt', '').replace('.png', '');
    
    return {
        name: url.replace(/.*\/(.*)/g, '$1'),
        folder_name,
    } 
}

const setImageWithPipeAndWriter = (data, image_writer)=>{
    return new Promise((resolve, reject) =>{
        data.pipe(image_writer);   
        data.on('end', resolve(true)); 
        data.on('error', reject(false)); 
    });
}

const downloadImage = async(arr, color)=>{
    const base_route = './public/images'; 
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
           
            //get small image buffers
            const { data : _image_data } = await getImageStream(image_url);
            // set small image
            const image_writer = fs.createWriteStream(`${folder_route}/${name}`);  
            let result = await setImageWithPipeAndWriter(_image_data, image_writer);

            //get full images buffers
            const { data : _full_image_data } = await getImageStream(full_image_url);
            // set full image
            const _full_image_writer = fs.createWriteStream(`${folder_route}/full_${name}`);  
            await setImageWithPipeAndWriter(_full_image_data, _full_image_writer);

            arr.splice(0,1);
        }
    }
    catch(e){
        console.error(e);
    }
};

async function execute(){
    try {
        await downloadImage(red, 'red');
        await downloadImage(blue, 'blue');
        await downloadImage(green, 'green');
        await downloadImage(purple, 'purple');
        await downloadImage(dons, 'no color');
        
        return {
            success: true,
        }
    } catch (error) {
        return {
            error: error,
            status: false
        };   
    }
}; 
module.exports = execute;