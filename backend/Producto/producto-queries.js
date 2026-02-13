const db = require('../config/db.js');


const findProductById = async (productoId) => {
    const [rows] = await db.execute('SELECT * FROM producto WHERE id_producto = ?', [productoId]);
    return rows[0];
    }

const createProduct = async (productoData) => {
    const { nombre, descripcion, precio, categoria_id } = productoData;
    const [result] = await db.execute(
        'INSERT INTO producto (nombre, descripcion, precio, categoria_id) VALUES (?, ?, ?, ?)',
        [nombre, descripcion, precio, categoria_id]
    );
    return { id_producto: result.insertId,
        nombre,
        descripcion,
        precio,
        categoria_id};
}


const findProductByCategorry = async (categoriaId) => {
    const [rows] = await db.execute('SELECT * FROM producto WHERE categoria_id = ?', [categoriaId]);
    return rows;
}

module.exports = {
    findProductById,
    createProduct,
    findProductByCategorry
};