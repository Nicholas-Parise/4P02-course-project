const express = require('express');
const router = express.Router();

let userEntry = [
    {id:0, username:'admin', password:'password', email:'admin@test.com', picture:'public/placeholder-avatar.png', datecreated:'2025-1-29', dateupdated:'2025-1-29'},
    {id:1, username:'bdmin', password:'password', email:'bdmin@test.com', picture:'public/placeholder-avatar.png', datecreated:'2025-1-29', dateupdated:'2025-1-29'},
    {id:2, username:'cdmin', password:'password', email:'cdmin@test.com', picture:'public/placeholder-avatar.png', datecreated:'2025-1-29', dateupdated:'2025-1-29'},
    {id:3, username:'ddmin', password:'password', email:'ddmin@test.com', picture:'public/placeholder-avatar.png', datecreated:'2025-1-29', dateupdated:'2025-1-29'}
]


// localhost:3000/users?page=1&pageSize=10
// get list of users
router.get('/',(req,res,next)=>{
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const username = req.query.username || "admin";

    const paginatedUsers = userEntry.slice((page - 1) * pageSize, page * pageSize);

    res.json({
        page,
        pageSize,
        totalUsers: userEntry.length, //allUsers.length,
        users: paginatedUsers,
      });
})

// localhost:3000/users/0
// get specific user
router.get('/:userId', (req, res, next) => {
  const userId = parseInt(req.params.userId);

  const allusers = userEntry.filter(user => user.id === userId);
  
  res.json({
    users: allusers,
  });
});


  router.post('/add', (req, res) => {

    reviewEntry.push({
        id: req.body.id, 
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        picture: req.body.picture
      });
    res.status(200).json({
        message: 'Post submitted'
    });

  });


  module.exports = router;