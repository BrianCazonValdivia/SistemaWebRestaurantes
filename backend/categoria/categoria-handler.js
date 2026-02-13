const express = require('express');
const { getCategories, addCategory } = require('./categoria-service');

const handlerGetCategories = async (req, res) => {
    try {
        const categories = await getCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving categories', error: error.message });
    }
};

const handleCreateCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        const newCategory = await addCategory(categoryData);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

module.exports = {
    handlerGetCategories,
    handleCreateCategory
};
