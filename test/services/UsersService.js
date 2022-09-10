class UserService 
{
    constructor(users = []){
        this.users = users;
    }

    /* 
    * @param Object conditions
    *   @param Function<Boolean> | null where 
    *   @param Integer | null offset 
    *   @param Integer | null limit 
    */
    resolver(conditions){
        if(conditions){
            Object.keys(conditions).forEach(methodName => {
                this[methodName](conditions[methodName]);
            }); 
        }; 

        return this;
    }

    offset(offset = 1){
        if(offset > 0 ){
            this.users = this.users.slice(offset);
        }

        return this; 
    }

    limit(limit = null){
        if(limit !== null && limit <= this.users.length){ 
            this.users.length = limit
        };

        return this;
    }
    where(callback){
        if(typeof callback == 'function'){
            this.users = this.users.filter(callback)
        }
        
        return this;  
    }

    findAll(conditions = null){
        return this.resolver(conditions).users;
    }

    findOne(callback){
        return typeof callback == 'function' 
            ? this.users.find(callback)
            : undefined;
    }
    
    setUser(users){
        this.users = users; 

        return this;
    }

    count(){
        return this.users.length;
    }
}

module.exports = UserService;