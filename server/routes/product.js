const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

//List all products
router.get('/', async (req, res) =>{
    //let data = await Product.find({}).populate("productCategory").populate("supplier").sort({name:1});
    let data = await Product.find({}).populate("productCategory", {name:1}).populate("supplier", {name:1});
    console.info('Records retrieved from mongoose:', data?.length);
    res.send(data);
})

//Find one product by id
router.get('/:id', async (req,res) => {
    try{
        let data = await Product.find({}).populate("productCategory", {name:1}).populate("supplier", {name:1});
        console.info('Found the Product:', data);
        res.send(data);
    } catch(error){
        console.log(error);
        res.sendStatus(500);
    }
})

//Create a new product
router.post('/', async (req, res) =>{
    try{
        let newProduct = new Product(req.body);
        await newProduct.save();
        console.log("Created a new product:", newProduct);
        res.send(newProduct);
    } catch(error){
        console.log(error);
        if(error.code === 11000){
            res.status(409).send(`Product '${req.body.name}' already exists`);
        }else{
            res.sendStatus(500);
        }
    }
})

//Update a product by id
router.put('/:id', async (req, res) =>{
    let productToUpdate = req.body;
    try{
        let data = await Product.findByIdAndUpdate(req.params.id, productToUpdate);
        console.log('updated product:', data);
        res.send(data);
    } catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

//delete a product by id
router.delete('/:id', async (req, res) => {
    try{
        let data = await Product.findByIdAndDelete(req.params.id)
        if(!data){
            res.sendStatus(404) 
        }else{
            console.log('Deleted product:', data);
            res.send(data);
        }
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
})


module.exports = router;
  
      












