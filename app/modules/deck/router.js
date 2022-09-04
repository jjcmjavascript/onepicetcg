module.exports  = (controller)=>{
    const express = require('express');
    const router = express.Router();

    router.get('/decks', async (req, res) => controller.getAllDecks(req, res)); 
    router.get('/cards', async (req, res) => await controller.getAllCards(req, res));

    return router;
}