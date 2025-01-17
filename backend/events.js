const express = require('express');
const router = express.Router();

let eventEntry = [
  {id:0, name:'birthday', owner:'admin', description:'video game console', date:'Jan 16 2025', picture:'assets/placeholder-events.png'},
  {id:1, name:'birthday again', owner:'bdmin', description:'video game console', date:'Jan 16 2025', picture:'assets/placeholder-events.png'}
];


// localhost:3000/events?page=1&pageSize=10
router.get('/',(req,res,next)=>{
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const eventItems = eventEntry.slice((page - 1) * pageSize, page * pageSize);

    res.json({
        page,
        pageSize,
        totalItems: eventEntry.length,
        items: eventItems,
      });
})

// localhost:3000/events/0
router.get('/:eventId', (req, res, next) => {
    const eventId = parseInt(req.params.eventId);
  
    const allEvents = eventEntry.filter(events => events.id === eventId);
    
    res.json({
      events: allEvents,
    });
  });


  router.post('/add', (req, res) => {

    eventEntry.push({id: req.body.id, 
      name: req.body.name,
      owner: req.body.owner,
      description: req.body.description,
      date: req.body.date, 
      picture: req.body.picture});
    
    res.status(200).json({
        message: 'Post submitted'
    });
  });


  module.exports = router;