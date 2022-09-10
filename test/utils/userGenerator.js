const { faker } = require('@faker-js/faker');
const User =  require('../models/User'); 

const generateUsers = (quantity)=>{
    let data = [];
    for (let i = 0; i < quantity; i++) {
        data.push(new User({
            email : faker.internet.email(),
            firstName : faker.name.firstName(),
            lastName : faker.name.lastName(),
            password : faker.internet.password(),
            uuid: faker.datatype.uuid(),
            id: i + 1,
        }));
    }

    return data; 
}; 

module.exports =  generateUsers; 