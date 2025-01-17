const express = require('express');
const { parseArgs } = require('util');
const router = express.Router();

let itemEntry = [
  {id:0, name:'PS5', description:'video game console', date:'Jan 16 2025', picture:'assets/placeholder-item.png'},
  {id:1, name:'Switch 2', description:'video game console', date:'Jan 16 2025', picture:'assets/placeholder-item.png'}
];


// localhost:3000/items?page=1&pageSize=10&event=somevalue
router.get('/',(req,res,next)=>{
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const event = parseArgs(req.query.event) || "somevalue"; // idk if this is the right one I haven't run this yet, it should just expect a string
    
    const paginatedItems = itemEntry.slice((page - 1) * pageSize, page * pageSize);

    res.json({
        page,
        pageSize,
        totalItems: itemEntry.length,
        items: paginatedItems,
      });
})

// localhost:3000/items/0
router.get('/:itemId', (req, res, next) => {
    const itemsId = parseInt(req.params.itemId);
  
    const allItems = itemEntry.filter(items => items.id === itemsId);
    
    res.json({
      items: allItems,
    });
  });


  router.post('/add', (req, res) => {

    itemEntry.push({id: req.body.id, 
      name: req.body.name,
      description: req.body.description,
      date: req.body.date, 
      picture: req.body.picture});
    
    res.status(200).json({
        message: 'Post submitted'
    });
  });


  module.exports = router;