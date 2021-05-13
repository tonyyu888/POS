var express = require('express');
const productCategory = require('../models/productCategory');
var router = express.Router();

const ProductCategory = require('../models/productCategory');

/* List all productCategories */
router.get('/', async (req, res) => {
  let data = await ProductCategory.find({});
  console.info(`records retrieved from mongoose:`, data?.length)
  console.log('data returned=',data)
  res.send(data);
});


/* Create a productCategory */
router.post('/', async (req, res) => {

  console.log("*** INSIDE router.post");

  let productCategoryCreate = req.body

  try {
    let newProductCategory = new productCategory(productCategoryCreate)
    await newProductCategory.save()
    console.log("Created Product Category", newProductCategory)
    res.send(newProductCategory)  
  }
  catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(409).send('Product Category ' + productCategoryCreate.name + ' already exists');      
    }
    else {
      res.sendStatus(500)
    }
  }
})

module.exports = router;
