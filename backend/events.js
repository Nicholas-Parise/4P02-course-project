const express = require('express');
const router = express.Router();

let eventEntry = [
  {id:0, user_id:0, name:'birthday', description:'video game console', url:'', addr:'', city:'', image:'assets/placeholder-events.png', datecreated:'2025-1-29', dateupdated:'2025-1-29'},
  {id:1, user_id:0, name:'birthday again', description:'video game console', url:'', addr:'', city:'', image:'assets/placeholder-events.png', datecreated:'2025-1-29', dateupdated:'2025-1-29'}
];


// localhost:3000/events?page=1&pageSize=10&member=admin
// get all the events a user is in
router.get('/',(req,res,next)=>{
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const member = parseArgs(req.query.member) || 0; // idk if this is the right one I haven't run this yet, it should just expect a string

    const eventItems = eventEntry.slice((page - 1) * pageSize, page * pageSize);

    res.json({
        page,
        pageSize,
        totalEvents: eventEntry.length,
        events: eventItems,
      });
})

// localhost:3000/events/0
// get event details
router.get('/:eventId', (req, res, next) => {
    const eventId = parseInt(req.params.eventId);
  
    const allEvents = eventEntry.filter(events => events.id === eventId);
    
    res.json({
      events: allEvents,
    });
  });


// localhost:3000/events/0
// update event details
router.put('/:eventId', (req, res, next) => {
  const eventId = parseInt(req.params.eventId);

  eventEntry.forEach(event => {
    if (event.id === eventId){
      event.owner = req.body.user_id,
      event.name = req.body.name,
      event.description = req.body.description,
      event.url = req.body.url,
      event.addr = req.body.addr,
      event.city = req.body.city,
      event.image = req.body.image,
      event.date = req.body.date 
    }
  });

  res.status(200).json({
      message: 'Post submitted'
  });
});


// localhost:3000/events/0
// delete event details
router.delete('/:eventId', (req, res, next) => {
  const eventId = parseInt(req.params.eventId);

  eventEntry.forEach(event => {
    if (event.id === eventId){
        
    }
  });

  res.status(200).json({
      message: 'Post submitted'
  });
});



  // create a new event
  router.post('/', (req, res) => {

    eventEntry.push({
      id: req.body.id, 
      owner: req.body.user_id,
      name: req.body.name,
      description: req.body.description,
      url: req.body.url,
      addr: req.body.addr,
      city: req.body.city,
      image: req.body.image,
      date: req.body.date 
    });
    
    res.status(200).json({
        message: 'Post submitted'
    });
  });


  module.exports = router;