var express = require('express');
const customer = require('../models/customer');
var router = express.Router();

/* List all customers */
router.get('/', async (req, res) => {
  let data = await customer.find({});
  console.info(`records retrieved from mongoose:`, data?.length)
  console.log('data returned=',data)
  res.send(data);
});

/* List one product category by ID. */
router.get('/:id', async function(req, res) {
  
  try {
    const data = await customer.findOne({_id: req.params.id});
    console.info(`Found customer:`, data)
    res.send(data);
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
});

/* Create a customer */
router.post('/', async (req, res) => {

  console.log("*** INSIDE router.post");

  let customerCreate = req.body

  try {
    let newCustomer = new customer(customerCreate)
    await newCustomer.save()
    console.log("Created customer", newCustomer)
    res.send(newCustomer)  
  }
  catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(409).send('Customer ' + customerCreate.name + ' already exists');      
    }
    else {
      res.sendStatus(500)
    }
  }
})

/* Update a customer by ID. */
//router.put('/:name', async function(req, res) {
  router.put('/:id', async function(req, res) {  
  let customerToUpdate = req.body
  try {

    console.log("customerToUpdate = ", customerToUpdate);

//    let data = await customer.findByIdAndUpdate(req.params.name, customerToUpdate);
    let data = await customer.findByIdAndUpdate(req.params.id, customerToUpdate);
    console.log("Updated customer", data)
    res.send(data);
  }
  catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
})

/* Delete a customer by ID. */
router.delete("/:id", async (req, res) => {
  try {
    const data = await customer.findByIdAndDelete(req.params.id);

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
