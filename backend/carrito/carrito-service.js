const {findCarritoByUser, createCarrito} = require('./carrito-queries.js');

const getCarritoByUser = async (userId) => {
    return await findCarritoByUser(userId);
}

const addCarrito = async (carritoData) => {
    return await createCarrito(carritoData);
}

module.exports = { 
   getCarritoByUser,
   addCarrito
};
