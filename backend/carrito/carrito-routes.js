const expresss = require('express');

const { handlerGetCarrito, handlerCreateCarrito } = require('./carrito-handler');


const router = expresss.Router();

router.get('/:id', handlerGetCarrito);
router.post('/carrito', handlerCreateCarrito);

module.exports = router;