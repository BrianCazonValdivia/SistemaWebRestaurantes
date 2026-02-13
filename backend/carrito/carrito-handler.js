const express = require('express');
const { getCarritoByUser, addCarrito } = require('./carrito-service');

const handlerGetCarrito = async (req, res) => {
    try {
        const carritoId = req.params.id;
        const carrito = await getCarritoByUser(carritoId);
        res.status(200).json(carrito);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving categories', error: error.message });
    }
};

const handlerCreateCarrito = async (req, res) => {
    try {
        const carritoData = req.body;
        const newCarrito = await addCarrito(carritoData);
        res.status(201).json(newCarrito);
    } catch (error) {
        res.status(500).json({ message: 'Error creating carrito', error: error.message });
    }
};

module.exports = {
    handlerGetCarrito,
    handlerCreateCarrito
}; 
