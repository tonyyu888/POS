const express = require('express');
const router = express.Router();
const orderDetail = require('../models/orderDetail');

//List all orders detail
router.get('/', async (req, res) =>{
    let data = await orderDetail.find({}).populate("orderDetailRecord.productId", {name:1});
    console.info('Records retrieved from mongoose:', data?.length);
    res.send(data);
})

//Find one order detail by order id
router.get('/:id', async (req,res) => {
    try{
        let data = await orderDetail.find({}).populate("product", {name:1});
        console.info('Found the order detail:', data);
        res.send(data);
    } catch(error){
        console.log(error);
        res.sendStatus(500);
    }
})

//Create a new order detail
router.post('/', async (req, res) =>{
    try{
        let newOrderDetail = new orderDetail(req.body);
        await newOrderDetail.save();
        console.log("Created a new order detail:", newOrderDetail);
        await res.send(newOrderDetail);
    } catch(error){
        console.log(error);
        if(error.code === 11000){
            res.status(409).send(`Order detail'${req.body.name}' already exists`);
        }else{
            res.sendStatus(500);
        }
    }
})

//Update a order detail by id
router.put('/:id', async (req, res) =>{
    let orderDetailToUpdate = req.body;
    try{
        let data = await order.findByIdAndUpdate(req.params.id, orderDetailToUpdate);
        console.log('updated order detail:', data);
        res.send(data);
    } catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

//delete a order detail by id
router.delete('/:id', async (req, res) => {
    try{
        let data = await order.findByIdAndDelete(req.params.id)
        if(!data){
            res.sendStatus(404) 
        }else{
            console.log('Deleted order detail:', data);
            res.send(data);
        }
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = router;