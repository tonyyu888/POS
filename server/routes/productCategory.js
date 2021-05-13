var express = require('express');
var router = express.Router();

const ProductCategory = require('../models/productCategory');

/* List all productCategories */
router.get('/', async (req, res) => {
  let data = await ProductCategory.find({});
  console.info(`records retrieved from mongoose:`, data?.length)
  console.log('data returned=',data)
  res.send(data);
});

module.exports = router;
