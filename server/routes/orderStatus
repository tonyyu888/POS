var express = require('express');
var router = express.Router();
const orderStatus = require('../models/orderStatus');

/* List all order status records */
router.get('/', async (req, res) => {
  let data = await orderStatus.find({});
  console.info(`records retrieved from mongoose:`, data?.length)
  console.log('data returned=',data)
  res.send(data);
});

/* List one order status by ID. */
router.get('/:id', async function(req, res) {  
  try {
    const data = await orderStatus.findOne({_id: req.params.id});
    console.info(`Found User Level:`, data)
    res.send(data);
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
});

/* Create an order status record */
router.post('/', async (req, res) => {
  let orderStatusCreate = req.body

  try {
    let neworderStatus = new orderStatus(orderStatusCreate)
    await neworderStatus.save()
    console.log("Created User Level", neworderStatus)
    res.send(neworderStatus)  
  }
  catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(409).send('User Level  ' + orderStatusCreate.name + ' already exists');      
    }
    else {
      res.sendStatus(500)
    }
  }
})

/* Update order status record by ID. */
  router.put('/:id', async function(req, res) {  
  let orderStatusToUpdate = req.body
  try {    
    let data = await orderStatus.findByIdAndUpdate(req.params.id, orderStatusToUpdate);
    res.send(data);
  }
  catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
})

/* Delete a order status record by ID. */
router.delete("/:id", async (req, res) => {
  try {
    const data = await orderStatus.findByIdAndDelete(req.params.id);

    if (!data) {
      res.sendStatus(404);
    } else {
      console.log("Deleted order status record:", data);
      res.send(data);
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(500)  }
});

module.exports = router;
