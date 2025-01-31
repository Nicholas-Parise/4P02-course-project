const express = require('express');
const { parseArgs } = require('util');
const router = express.Router();

let wishlistEntry = [
  {id:0, event_id:0, user_id:0, name:'nicks list', description:'video game console', image:'public/placeholder-wishlist.png', datecreated:'2025-1-29', dateupdated:'2025-1-29'},
  {id:1, event_id:0, user_id:0, name:'lists list', description:'video game console', image:'public/placeholder-wishlist.png', datecreated:'2025-1-29', dateupdated:'2025-1-29'}
];


// localhost:3000/wishlists?page=1&pageSize=10&event=somevalue&member=0
// get list of wishlists from a member or is in an event 
router.get('/',(req,res,next)=>{
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const event = parseArgs(req.query.event) || "somevalue"; // idk if this is the right one I haven't run this yet, it should just expect a string
    const member = parseArgs(req.query.member) || 0; // idk if this is the right one I haven't run this yet, it should just expect a string

    const paginatedWishlists = wishlistEntry.slice((page - 1) * pageSize, page * pageSize);

    res.json({
        page,
        pageSize,
        totalWishlists: wishlistEntry.length,
        wishlists: paginatedWishlists,
      });
})

// localhost:3000/wishlists/0
// get the contents of a single wishlist
router.get('/:wishlistId', (req, res, next) => {
    const wishlistId = parseInt(req.params.wishlistId);
  
    const allwishlists = wishlistEntry.filter(wishlists => wishlists.id === wishlistId);

    res.json({
      wishlists: allwishlists,
    });
  });


  router.post('/add', (req, res) => {

    wishlistEntry.push({
      id: req.body.id, 
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      datecreated: req.body.dateCreated, 
      dateupdated: req.body.dateupdated
    });
    
    res.status(200).json({
        message: 'Post submitted'
    });
  });


  module.exports = router;