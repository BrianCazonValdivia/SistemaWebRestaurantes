const {createProduct, findProductById, findProductByCategorry} = require('./producto-queries');

const getProducto = async (productoId) => {
    return await findProductById(productoId);

}


const addProducto = async (productoData) => {
    if (productoData.items && productoData.items.length === 0) {
        throw new Error('Producto debe tener al menos un item');
    }
    return await createProduct(productoData);
}


const getProductByCategorry = async (categoriaId) => {
    return await findProductByCategorry(categoriaId);
}


module.exports = { 
    getProducto,
    addProducto,
    getProductByCategorry
};  
