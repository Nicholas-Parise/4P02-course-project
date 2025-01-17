const express = require('express');
const router = express.Router();

let userEntry = [
    {id:0, username:'admin',description:'test',visible:true},
    {id:1, username:'bdmin',description:'test',visible:true},
    {id:2, username:'cdmin',description:'test',visible:true},
    {id:3, username:'ddmin',description:'test',visible:true}
]

// localhost:3000/users?page=1&pageSize=10?username=admin
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
router.get('/:userId', (req, res, next) => {
  const userId = parseInt(req.params.userId);

  const allusers = userEntry.filter(user => user.id === userId);
  
  res.json({
    users: allusers,
  });
});


  router.post('/add', (req, res) => {

    reviewEntry.push({id: req.body.id, 
        username: req.body.username,
        description: req.body.description,
        visible: req.body.visible});
    res.status(200).json({
        message: 'Post submitted'
    });

  });


  module.exports = router;