const expresss = require('express');

const { handleGetProducto, handleCreateProducto, handleGetProductoByCategory } = require('./producto-handler');

const router = expresss.Router();

router.get('/:id', handleGetProducto);
router.post('/', handleCreateProducto);
router.get('/categoria/:categoriaId', handleGetProductoByCategory);

module.exports = router;