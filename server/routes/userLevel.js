var express = require('express');
var router = express.Router();
const UserLevel = require('../models/UserLevel');

// List all user levels 
router.get('/', async (req, res) => {
  let data = await UserLevel.find({});
  console.info(`records retrieved from mongoose:`, data?.length)
  console.log('data returned=',data)
  res.send(data);
});

// List one user level by ID
router.get('/:id', async function(req, res) {
  
  try {
    const data = await UserLevel.findOne({_id: req.params.id});
    console.info(`Found User Level:`, data)
    res.send(data);
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
});

// Create a user level
router.post('/', async (req, res) =>{
    try{
        let newUserLevel = new UserLevel(req.body);
        await newUserLevel.save();
        console.log("Created a new user level:", newUserLevel);
        res.send(newUserLevel);
    } catch(error){
        console.log(error);
        if(error.code === 11000){
            res.status(409).send(`User level '${req.body.name}' already exists`);
        }else{
            res.sendStatus(500);
        }
    }
})

//Update a user level by id
router.put('/:id', async (req, res) =>{
    let userlevelToUpdate = req.body;
    try{
        let data = await UserLevel.findByIdAndUpdate(req.params.id, userlevelToUpdate);
        console.log('updated user-level:', data);
        res.send(data);
    } catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

//delete a user-level by id
router.delete('/:id', async (req, res) => {
    try{
        let data = await UserLevel.findByIdAndDelete(req.params.id)
        if(!data){
            res.sendStatus(404) 
        }else{
            console.log('Deleted user level:', data);
            res.send(data);
        }
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
})


module.exports = router;
  
      












