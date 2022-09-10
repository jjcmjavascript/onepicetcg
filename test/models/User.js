class User {
    constructor(object){
        this.email = object.email;
        this.firstName = object.firstName;
        this.lastName = object.lastName;
        this.password = object.password;
        this.id = object.id || 0;
        this.uuid = object.uuid;
    }
} 

module.exports = User;