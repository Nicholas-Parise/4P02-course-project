const express = require('express');
const router = express.Router();

let categoriesEntry = [
  {id:0, user_id:0, name:'things', description:'who doesnt like things', like: true},
  {id:1, user_id:0, name:'stuff', description:'who deosnt like stuff', like: true}
];


// localhost:3000/categories?page=1&pageSize=10
// get all the categories
router.get('/',(req,res,next)=>{
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const eventItems = categoriesEntry.slice((page - 1) * pageSize, page * pageSize);

    res.json({
        page,
        pageSize,
        totalCategories: categoriesEntry.length,
        categories: eventItems,
      });
})

// localhost:3000/categories/0
// get event details
router.get('/:categoryId', (req, res, next) => {
    const categoryId = parseInt(req.params.categoryId);
  
    const allCategories = categoriesEntry.filter(events => events.id === categoryId);
    
    res.json({
        categories: allCategories,
    });
  });


// localhost:3000/categories/0
// update event details
router.put('/:categoryId', (req, res, next) => {
  const categoryId = parseInt(req.params.categoryId);

  categoriesEntry.forEach(category => {
    if (category.id === categoryId){
        category.name = req.body.name,
        category.description = req.body.description
    }
  });

  res.status(200).json({
      message: 'Post submitted'
  });
});


// localhost:3000/categories/0
// delete event details
router.delete('/:categoryId', (req, res, next) => {
  const categoryId = parseInt(req.params.categoryId);

  categoriesEntry.forEach(category => {
    if (category.id === categoryId){
        
    }
  });

  res.status(200).json({
      message: 'Post submitted'
  });
});


  // create a new category
  router.post('/', (req, res) => {

    categoriesEntry.push({
      name: req.body.name,
      description: req.body.description,
    });
    
    res.status(200).json({
        message: 'Post submitted'
    });
  });


  module.exports = router;
