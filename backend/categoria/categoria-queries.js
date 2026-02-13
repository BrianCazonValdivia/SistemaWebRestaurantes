const db = require('../config/db.js');


const findCategories = async () => {
    const [rows] = await db.execute('SELECT * FROM categoria');
    return rows;
    }

const createCatrgory = async (categoryData) => {
    const { id, name, description} = productoData;
    const [result] = await db.execute(
        'INSERT INTO productos (idCategoria, Nombre, Descripccion) VALUES (?, ?, ?)',
        [id,name, description]
    );
    return { id: result.insertId, ...categoryData };
}


module.exports = {
    findCategories,
    createCatrgory
};