var express = require('express');
var router = express.Router();

/* List all productCategories */
router.get('/', async (req, res) => {
  let data = await productCategory.find({});
  console.info(`records retrieved from mongoose:`, data?.length)
  res.send(data);
});

module.exports = router;
