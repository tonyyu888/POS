const express = require('express');
const router = express.Router();
const order = require('../models/order');

//List all orders
router.get('/', async (req, res) =>{
    let data = await order.find({}).populate("customer", {name:1}).populate("salesPerson", {firstName:1, lastName:1})
                                   .populate("orderStatus", {name:1}).populate("orderDetail.product", {name:1});
    console.info('Records retrieved from mongoose:', data?.length);
    res.send(data);
})

//Find one order by id
router.get('/:id', async (req,res) => {
    try{
        let data = await order.find({}).populate("customer", {name:1}).populate("salesPerson", {firstName:1, lastName:1});
        console.info('Found the order:', data);
        res.send(data);
    } catch(error){
        console.log(error);
        res.sendStatus(500);
    }
})

//Create a new order
router.post('/', async (req, res) =>{
    try{
        let newOrder = new order(req.body);
        await newOrder.save();
        console.log("Created a new order:", newOrder);
        await res.send(newOrder)
    } catch(error){
        console.log(error);
        if(error.code === 11000){
            res.status(409).send(`Order '${req.body.name}' already exists`);
        }else{
            res.sendStatus(500);
        }
    }
})

//Update a order by id
router.put('/:id', async (req, res) =>{
    let orderToUpdate = req.body;
    try{
        let data = await order.findByIdAndUpdate(req.params.id, orderToUpdate);
        console.log('updated order:', data);
        res.send(data);
    } catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

//delete a order by id
router.delete('/:id', async (req, res) => {
    try{
        let data = await order.findByIdAndDelete(req.params.id)
        if(!data){
            res.sendStatus(404) 
        }else{
            console.log('Deleted order:', data);
            res.send(data);
        }
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = router;