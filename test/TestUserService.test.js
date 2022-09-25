const UserService = require("./services/UsersService"); 
const userGenerator  = require("./utils/userGenerator"); 

const usersList =  userGenerator(20); 
let userService = new UserService(usersList); 

beforeAll(()=>{
    userService.users = usersList; 
});

describe.skip("Service test", ()=>{
    test("Limit: get 15 Users", ()=>{
        const users = userService.findAll({
            limit: 15
        }); 

        expect(users.length === 15).toBe(true);
    }); 

    test("offset: get Users After 5 ", ()=>{
        const users = userService.users = userService.findAll({
            offset: 5
        }); 

        expect(users.length).toBe(10);
    }); 

    test("Find: user ID 5", ()=>{
        const user =  userService.findOne((userItem) => userItem.id == 6); 
        expect(user.id === 6).toBe(true);
    }); 

    test("Find: non-existent user 1", ()=>{
        const user =  userService.findOne((userItem) => userItem.id == 1); 
        
        expect(user).toBeUndefined();
    });

    test("Find: return undefined with param null", ()=>{
        const user =  userService.findOne(null); 
        
        expect(user).toBeUndefined(undefined);
    });

    test("Find: return undefined with param {}", ()=>{
        const user =  userService.findOne({}); 
        
        expect(user).toBeUndefined();
    });

    test("Integration", ()=>{
        const users = userService.users = userService.findAll({
            offset: 2,
            limit: 7,
            where: (item)=> {
                return item.id > 9;
            }
        }); 

        expect(users.length).toBe(5);
    }); 
});
