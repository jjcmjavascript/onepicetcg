const paginator = require("../app/helpers/paginate");
const UserService = require("./services/UsersService"); 
const userGenerator  = require("./utils/userGenerator"); 

const getUsers = (quantity, options  = null) => {
    const usersArray = userGenerator(quantity);

    return new UserService(usersArray, options); 
}


describe("Paginate Models", ()=>{
    test('Get Paginated  users Quantities', async()=>{
        const users = getUsers(100);
        const result = await paginator(users); 

        expect(result.total).toBe(100);
    });

    test('Get 5 pages from 100 users', async()=>{
        const users = getUsers(100);
        const result = await paginator(users, {
            size: 20
        }); 

        expect(result.pages).toBe(5);
    })

    test('Get error with null param', async()=>{
        try {
            await paginator(null);
        } 
        catch (e) {
          expect(e.message).toMatch('Please provide a valid model');
        }
    })
}); 