var express = require('express');
var router = express.Router();
const userLevel = require('../models/userLevel');

/* List all product categories */
router.get('/', async (req, res) => {
  let data = await userLevel.find({});
  console.info(`records retrieved from mongoose:`, data?.length)
  console.log('data returned=',data)
  res.send(data);
});

/* List one user level by ID. */
router.get('/:id', async function(req, res) {
  
  try {
    const data = await userLevel.findOne({_id: req.params.id});
    console.info(`Found User Level:`, data)
    res.send(data);
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
});

/* Create a user level */
router.post('/', async (req, res) => {

  console.log("*** INSIDE router.post");

  let userLevelCreate = req.body

  try {
    let newUserLevel = new userLevel(userLevelCreate)
    await newUserLevel.save()
    console.log("Created User Level", newUserLevel)
    res.send(newUserLevel)  
  }
  catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(409).send('User Level  ' + userLevelCreate.name + ' already exists');      
    }
    else {
      res.sendStatus(500)
    }
  }
})

/* Update auser level by ID. */
//router.put('/:name', async function(req, res) {
  router.put('/:id', async function(req, res) {  
  let userLevelToUpdate = req.body
  try {

    console.log("userLevelToUpdate = ", userLevelToUpdate);

//    let data = await userLevel.findByIdAndUpdate(req.params.name, userLevelToUpdate);
    let data = await userLevel.findByIdAndUpdate(req.params.id, userLevelToUpdate);
    console.log("Updated Product Category", data)
    res.send(data);
  }
  catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
})

/* Delete a user level by ID. */
router.delete("/:id", async (req, res) => {
  try {
    const data = await userLevel.findByIdAndDelete(req.params.id);

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
