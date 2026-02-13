const express = require('express');
const cors = require('cors');

const productoRoutes = require('./Producto/producto-routes');
const categoriaRoutes = require('./categoria/categoria-routes');
const carritoRoutes = require('./carrito/carrito-routes');

const app = express();

//cors nos ayuda con request de otros dominios
app.use(cors());
app.use(express.json());

//esto es para las rutas de productos
app.use('/api/product', productoRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/carrito', carritoRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


module.exports = app;