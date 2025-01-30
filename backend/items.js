const express = require('express');
const { parseArgs } = require('util');
const router = express.Router();

let itemEntry = [
  {id:0, member_id:0, wishlist_id:0, name:'PS5', description:'video game console', url:'', image:'public/placeholder-item.png', quantity:1, price:10.0, datecreated:'2025-1-29', dateupdated:'2025-1-29'},
  {id:1, member_id:0, wishlist_id:0, name:'Switch 2', description:'video game console', url:'', image:'public/placeholder-item.png', quantity:1, price:10.0, datecreated:'2025-1-29', dateupdated:'2025-1-29'}
];

// localhost:3000/items?page=1&pageSize=10&wishlist=somevalue
// get all items from a wishlist
router.get('/',(req,res,next)=>{
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const wishlist = parseArgs(req.query.wishlist) || 0; // idk if this is the right one I haven't run this yet, it should just expect a string
    
    const paginatedItems = itemEntry.slice((page - 1) * pageSize, page * pageSize);

    res.json({
        page,
        pageSize,
        totalItems: itemEntry.length,
        items: paginatedItems,
      });
})

// localhost:3000/items/0
// get the contents of a single item
router.get('/:itemId', (req, res, next) => {
    const itemsId = parseInt(req.params.itemId);
  
    const allItems = itemEntry.filter(items => items.id === itemsId);
    
    res.json({
      items: allItems,
    });
  });

  
  router.post('/add', (req, res) => {

    itemEntry.push({
      id: req.body.id, 
      name: req.body.name,
      description: req.body.description,
      url: req.body.url,
      image: req.body.image,
      quantity: req.body.quantity,
      price: req.body.price,
      date: req.body.date 
    });
    
    res.status(200).json({
        message: 'Post submitted'
    });
  });


  module.exports = router;