require('dotenv').config();
const axios = require('axios');
const PAGE_TO_GET_NAMES  = process.env.PAGE_TO_GET_NAMES;
const db = require('../../services/database/models');

module.exports = async () => {
    const { 
        green, red, blue, purple, dons
        , leaders
        , characters
        , events
        , stages
        , don_name } = require('../image_scrapper/urls');

    let db_files = await db.files.findAll();
    let db_colors = await db.colors.findAll();
    let db_types = await db.types.findAll();
    let db_packs = await db.packs.findAll();

    //CREATE COLORS
    const createColors = async () => {
        const colors = ['no color', 'red', 'blue', 'purple', 'green'];
        while (colors.length > 0) {
            const color = colors.shift();
            const exists = db_colors.find(_color => _color.name == color);

            if (!exists) {
                const newColor = await db.colors.create({
                    name: color,
                });
                db_colors.push(newColor);
            }
        }
    };

    //CRATE TYPES
    const createTypes = async () => {
        const types = ['character', 'don', 'event', 'stage', 'leader'];
        while (types.length > 0) {
            const type = types.shift();
            const exists = db_types.find(_type => _type.name == type);
            if (!exists) {
                const newType = await db.types.create({
                    name: type,
                });
                db_types.push(newType);
            }
        }
    };

    //CREATE PACK
    const getOrCreatePack = async (pack) => {
        let newpack = null; 
        const exists = db_packs.find(_pack => _pack.code == pack);

        if (!exists) {
            newpack = await db.packs.create({
                name: pack,
                code: pack,
            });
            db_packs.push(newpack);
        }
        
        return newpack || exists;
    };

    //CREATE FILE
    const getOrCreateFile = async (file, route) => {
        let newfile = null;
        const exists = db_files.find(_file => _file.route == route);

        if (!exists) {
            newfile = await db.files.create({
                name: file,
                route: route,
            });
            db_files.push(newfile);
        }

        return exists || newfile;
    };
    
    const getNameFromOtherPage = async (name_without_alt, full_name)=>{        
        const response = await axios.get(`${PAGE_TO_GET_NAMES}=${name_without_alt}`); 
        const data = response.data;
        const html = data.products;
        const htmlName = html[html.length - 1]; 
        let final_name = null;
        let other_name = full_name; 

        if(htmlName){
            other_name = htmlName.name;
            final_name = htmlName.name.match(/.*-(.*)/);
            final_name = final_name && final_name[1] ? final_name[1] : final_name; 
            final_name = final_name ? final_name : htmlName.name;
        }

        return {
            name : final_name ? final_name : name_without_alt,
            other_name
        } 
    }

    const getTypeFromName = (url) =>{
        let type_name = null; 

        if(don_name.includes(url)){
            type_name = 'don';
        }
        else if(leaders.includes(url)){
            type_name = 'leader';
        }
        else if(characters.includes(url)){
            type_name = 'character';
        }
        else if(events.includes(url)){
            type_name = 'event';
        }
        else if(stages.includes(url)){
            type_name = 'stage';
        }
        
        const type = db_types.find(type => type.name === type_name); 

        return type ? type.id : null;
    };

    //CREATE CARD 
    const findOrCreateCard = async (card_data, other_data = {}) => {
        let new_card = null; 
        let old_card = await db.cards.findOne({
            where: card_data
        });

        if (!old_card) {
            card_data = {...card_data, ...other_data};
            new_card = await db.cards.create(card_data);
        }

        return {new_card, old_card};
    }; 
    
    const createPivots = async ({is_new, card_id, color_id, type_id, pack_id}) => {
        
        await db.pivot_cards_colors.create({
            card_id,
            color_id
        });

        if(is_new){
            await db.pivot_cards_types.create({
                card_id: card_id,
                type_id,
            });
            await db.pivot_cards_packs.create({
                card_id: card_id,
                pack_id,
            });
        }
    }

    const formatAndInsertCards = async (arr, color)=>{
        while(arr.length > 0){
            try{
                const url = arr.shift();
                const url_name = url.split('/').pop();
                const name = url_name.replace('.png', '');
                const is_alt = /alt/i.test(name);
                const name_without_alt = name.replace(/_alt\d?/i, ''); 
                const split_number = name_without_alt.split('-');
                const pack_code_name = name.split('-')[0];
                const card_number = split_number[1] ? split_number[1] : split_number[0];
    
                //get name from other page
                console.log('Obteniendo datos para' + name_without_alt);
                const {name : _name, other_name} = await getNameFromOtherPage(name_without_alt, name);
               
                //search for color
                console.log('Buscando Color' + color);
                const color_id = db_colors.find(_color => _color.name == color).id; 
                
                //search for card type
                console.log('Buscando Tipo de Carta');
                const type_id = getTypeFromName(url_name);
                console.log('Tipo de carta' + type_id);
                
                //search for pack or create it
                const _pack = await getOrCreatePack(pack_code_name);
                const pack_id = _pack ? _pack.id : null;
                
                //search for file or create it
                const _color = color == 'no color' ? 'don' : color;
                const img_url = `images/${_color}/${name_without_alt}/${url_name}`;
                const img_url_full = `images/${_color}/cards/${name_without_alt}/full_${url_name}`;
    
                const _image = await getOrCreateFile(name, img_url);
                const image_id = _image ? _image.id : null;
    
                const _full_image = await getOrCreateFile(`full_${url_name}`, img_url_full);
                const full_image_id = _full_image ? _full_image.id : null; 
    
                console.log('Formateando data');
                const card_data = {
                    cost : 0 ,	
                    power : 0,	
                    name : 	_name,
                    other_name,
                    is_alternative : is_alt,
                    type_id,	
                    pack_id, 
                    card_number,	
                    codigo : name_without_alt, 
                    card_text : '',
                };
    
                console.log('Guardando data');
                const {old_card, new_card} = await findOrCreateCard(card_data, {image_id, full_image_id});
                console.log(old_card ? 'Carta Ya existente': 'Nueva Carta creada');
    
                // Crear tablas pivotes para la carta
                createPivots({
                    is_new : Boolean(new_card),
                    card_id: Boolean(new_card) ? new_card.id : old_card.id, 
                    color_id, 
                    type_id, 
                    pack_id
                });
            }
            catch(e){
                console.log('Error' + e.message);   
            }
        }
    }

    await createColors();
    await createTypes();
    await formatAndInsertCards(green , 'green');
    await formatAndInsertCards(red , 'red');
    await formatAndInsertCards(blue , 'blue');
    await formatAndInsertCards(purple , 'purple');
    await formatAndInsertCards(dons , 'no color');
}; 