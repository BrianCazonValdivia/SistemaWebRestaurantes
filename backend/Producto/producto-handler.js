const express = require('express');
const { getProducto, addProducto, getProductByCategorry} = require('./producto-service');


const handleGetProducto = async (req, res) => {
    try {
        const productoId = req.params.id;
        const producto = await getProducto(productoId);
        if (!producto) {
            return res.status(404).json({ message: 'Producto not found' });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving producto', error: error.message });
    }
};

const handleCreateProducto = async (req, res) => {
    try {
        const productoData = req.body;
        const newProducto = await addProducto(productoData);
        res.status(201).json(newProducto);
    } catch (error) {
        res.status(500).json({ message: 'Error creating producto', error: error.message });
    }
};

const handleGetProductoByCategory = async (req, res) => {
    try {
        const categoriaId = req.params.categoriaId;
        const productos = await getProductByCategorry(categoriaId);
        if (!productos || productos.length === 0) {
            return res.status(404).json({ message: 'No products found for this category' });
        }
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products by category', error: error.message });
    }
}

module.exports = {
    handleGetProducto,
    handleCreateProducto,
    handleGetProductoByCategory
};  