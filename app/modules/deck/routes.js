module.exports  = (controller)=>{
    return [
        {
            method: 'get',
            path: '/decks',
            handler: async (req, res) => controller.getAllDecks(req, res),
        },
        {
            method: 'get',
            path: '/cards',
            handler: async (req, res) => controller.getAllCards(req, res),
        },
    ]
}