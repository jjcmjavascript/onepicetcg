module.exports  = (controller)=>{
    return [
        {
            method: 'get',
            path: '/cards',
            handler: async (req, res) => controller.getAllCards(req, res),
        },
        {
            method: 'get',
            path: '/cards/selects',
            handler: async (req, res) => controller.getCardSelects(req, res),
        },
    ]
}