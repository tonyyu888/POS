var express = require('express');
const supplier = require('../models/supplier');
var router = express.Router();

/* List all suppliers */
router.get('/', async (req, res) => {
  let data = await supplier.find({});
  console.info(`records retrieved from mongoose:`, data?.length)
  console.log('data returned=',data)
  res.send(data);
});

/* List one supplier by ID. */
router.get('/:id', async function(req, res) {  
  try {
    const data = await supplier.findOne({_id: req.params.id});
    console.info(`Found Supplier:`, data)
    res.send(data);
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
});

/* Create a supplier */
router.post('/', async (req, res) => {
  let supplierCreate = req.body

  try {
    let newSupplier = new supplier(supplierCreate)
    await newSupplier.save()
    console.log("Created Supplier", newSupplier)
    res.send(newSupplier)  
  }
  catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(409).send('Supplier ' + supplierCreate.name + ' already exists');      
    }
    else {
      res.sendStatus(500)
    }
  }
})

/* Update a supplier by ID. */
  router.put('/:id', async function(req, res) {  
  let supplierToUpdate = req.body
  try {

    console.log("supplierToUpdate = ", supplierToUpdate);
    let data = await supplier.findByIdAndUpdate(req.params.id, supplierToUpdate);
    console.log("Updated Supplier", data)
    res.send(data);
  }
  catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
})

/* Delete a supplier by ID. */
router.delete("/:id", async (req, res) => {
  try {
    const data = await supplier.findByIdAndDelete(req.params.id);

    if (!data) {
      res.sendStatus(404);
    } else {
      console.log("Deleted Supplier", data);
      res.send(data);
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(500)  }
});

module.exports = router;