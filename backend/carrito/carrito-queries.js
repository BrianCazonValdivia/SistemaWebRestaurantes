const db = require('../config/db.js');


const findCarritoByUser = async (userId) => {
    const [rows] = await db.execute('SELECT * FROM carrito WHERE usuario_id = ?', [userId]);
    return rows[0];
    }

const createCarrito = async (carritoData) => {
    const { IdCarrito, CantidadProd,Producto_id, estado, userId } = carritoData;
    const [result] = await db.execute(
        'INSERT INTO Carrito (IdCarrito, Cantidad_producto, Producto_id, estado, userID) VALUES (?, ?, ?, ?, ?)',
        [IdCarrito, CantidadProd, Producto_id, estado, userId]
    );
    return { id: result.insertId, ...carritoData };
}


module.exports = {
    findCarritoByUser,
    createCarrito
};