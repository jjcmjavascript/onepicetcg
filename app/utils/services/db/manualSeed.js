module.exports = async () => {
    const PAGE_TO_GET_NAMES  = process.env.PAGE_TO_GET_NAMES;
    const axios = require('axios');
    const db = require('./models');
    const { 
        green, red, blue, purple, dons
        , leaders
        , characters
        , events
        , stages
        , don_name } = require('../../../../../urls');

    let db_files = await db.files.findAll();
    let db_colors = await db.colors.findAll();
    let db_types = await db.types.findAll();
    let db_packs = await db.packs.findAll();
    let db_cards = await db.cards.findAll();

    let db_cards_colors = await db.pivot_cards_colors.findAll();
    let db_cards_types = await db.pivot_cards_types.findAll();
    let db_cards_packs = await db.pivot_cards_packs.findAll();

    //CREATE COLORS
    const createColors = async () => {
        const colors = ['sin color', 'rojo', 'azul', 'morado', 'verde'];
        while (colors.length > 0) {
            const color = colors.shift();
            const exists = db_colors.exists(_color => _color.name == color);

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
    const createPack = async (pack) => {
        const exists = db_packs.find(_pack => _pack.name == pack.name);

        if (!exists) {
            const newpack = await db.packs.create({
                name: pack,
                code: pack,
            });
            db_packs.push(newpack);
        }
    };

    //CREATE FILE
    const createFile = async (file, route) => {
        const exists = db_files.find(_file => _file.name == file);
        if (!exists) {
            const newfile = await db.files.create({
                name: file,
                route: route,
            });
            db_files.push(newfile);
        }
    };
    
    //CREATE CARD 
    const getAndCreateCard = async (card) => {
        const exists = db_files.map(_card => _card.other_name == card.other_name);
        if (!exists) {
            const newcard = await db.cards.create(card);
            db_cards.push(newcard);
        }

        return exists;
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
            final_name = htmlName.name.match(/.*-(.*)/)[1]; 
            final_name = final_name ? final_name : htmlName.name;
        }

        return {
            name : final_name ? final_name : name_without_alt,
            other_name
        } 
    }

    const getTypeFromName = (url) =>{
        let type_name = null; 

        if(dons.includes(url)){
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

    const getPackFromName = async (pack_code) =>{
        await createPack(pack_code); 
        const pack = db_packs.find(pack => pack.code === pack_code);

        return pack ? pack.id : null;
    };

    const getFileFromName = async (name, route) =>{
        await createFile(name, route); 
        const pack = db_packs.find(pack => pack.code === pack_code);

        return pack ? pack.id : null;
    };

    const formatAndInsertCards = async (arr, color)=>{
        while(arr.length > 0){
            const url = arr.shift();
            const url_name = url.split('/').pop();
            const name = url_name.replace('.png', '');
            const is_alt = /alt/i.test(name);
            const name_without_alt = name.replace(/_alt\d?/i, ''); 
            const pack_code_name = name.split('-')[0];

            const {name : _name, other_name} = await getNameFromOtherPage(name_without_alt, name);
            const type_id = getTypeFromName(url_name);
            const pack_id = await getPackFromName(pack_code_name);
            const card_numero = name_without_alt.split('-')[1];
            
            const _color = color == 'sin color' ? 'don' : color;
            const img_url = `images/${_color}/${name_without_alt}/${url_name}`;
            const img_url_full = `images/${_color}/${name_without_alt}/full_${url_name}`;

            const image_id = await getFileFromName(name, img_url);
            const full_image_id = await getFileFromName(`full_${url_name}`, img_url_full);

            const card = {
                cost : 0 ,	
                power : 0,	
                name : 	_name,
                other_name,
                is_alternative : is_alt,
                type_id,	
                pack_id, 
                card_numero,	
                codigo : name_without_alt, 
                card_text : '',
                image_id,
                full_image_id,
            };

            const new_card = await getAndCreateCard(card);
        }
    }

    // await createColors();
    // await createTypes();
    // await formatAndInsertCards(green , 'green');
}; 