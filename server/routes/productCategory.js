var express = require('express');
const productCategory = require('../models/productCategory');
var router = express.Router();

/* List all product categories */
router.get('/', async (req, res) => {
  let data = await productCategory.find({});
  console.info(`records retrieved from mongoose:`, data?.length)
  console.log('data returned=',data)
  res.send(data);
});

/* List one product category by ID. */
router.get('/:id', async function(req, res) {
  
  try {
    const data = await productCategory.findOne({_id: req.params.id});
    console.info(`Found Product Category:`, data)
    res.send(data);
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
});

/* Create a product category */
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

/* Update a product category by ID. */
//router.put('/:name', async function(req, res) {
  router.put('/:id', async function(req, res) {  
  let productCategoryToUpdate = req.body
  try {

    console.log("productCategoryToUpdate = ", productCategoryToUpdate);

//    let data = await productCategory.findByIdAndUpdate(req.params.name, productCategoryToUpdate);
    let data = await productCategory.findByIdAndUpdate(req.params.id, productCategoryToUpdate);
    console.log("Updated Product Category", data)
    res.send(data);
  }
  catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
})

/* Delete a product category by ID. */
router.delete("/:id", async (req, res) => {
  try {
    const data = await productCategory.findByIdAndDelete(req.params.id);

    if (!data) {
      res.sendStatus(404);
    } else {
      console.log("Deleted Product Category", data);
      res.send(data);
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(500)  }
});

module.exports = router;
