const {findCategories, createCatrgory} = require('./categoria-queries.js');

const getCategories = async () => {
    return await findCategories();
}

const addCategory = async (categoryData) => {
    return await createCatrgory(categoryData);
}

module.exports = { 
   getCategories,
   addCategory
};
