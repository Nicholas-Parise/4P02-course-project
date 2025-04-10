const express = require('express');
const router = express.Router();
const db = require('./db');
const fs = require('fs');
const path = require('path');

const authenticate = require('./middleware/authenticate');
const uploadPicture = require('./middleware/upload');


// localhost:3000/items/0
// get all the ideas sorted by how much they relate to each person
router.get('/', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  try {
    // category weight 
    // true = +10 points (user likes the category)
    // false = -5 points (user dislikes the category)
    // null = 0 points (user has no opinion)

    // Get all categories the user has preferences for (both loved and disliked)
    const userCategoriesResult = await db.query(`
        SELECT c.id, uc.love
        FROM categories c
        JOIN user_categories uc ON c.id = uc.category_id
        WHERE uc.user_id = $1;
    `, [userId]);

    const userCategories = userCategoriesResult.rows;

    if (userCategories.length === 0) {
      return res.status(200).json({ suggestedItems: [] }); // No preferences set, return nothing
    }

    const lovedCategoryIds = userCategories
      .filter(cat => cat.love === true)
      .map(cat => cat.id);

    const dislikedCategoryIds = userCategories
      .filter(cat => cat.love === false)
      .map(cat => cat.id);

    /*
    // query explanation:
    // for each idea we want to calculate the score by:
    // getting each category associated with the idea
    // if the idea is equal to one the user likes: add 10 to score
    // if the idea is equal to one the user hates: subtract 5 to score
    // after all this each idea has a score calculated
    // then we order by score going higher to lower, breakign ties with popularity 
    // ---- 
    // note if we only want ideas where score is above 0 we have to use a sub query instead: 
    // SELECT * FROM (....)sub WHERE sub.score > -1 ORDER BY sub.score DESC, sub.created DESC;
    const result = await db.query(`
        SELECT i.*, 
        json_agg(json_build_object('id', c.id, 'name', c.name)) AS categories,
               SUM(CASE 
                   WHEN ic.category_id = ANY($1::int[]) THEN 10  -- Loved category
                   WHEN ic.category_id = ANY($2::int[]) THEN -5  -- Disliked category
                   ELSE 0
               END) AS score
        FROM ideas i
        LEFT JOIN idea_categories ic ON i.id = ic.idea_id
        LEFT JOIN categories c ON ic.category_id = c.id
        GROUP BY i.id
        ORDER BY score DESC, i.uses DESC;
    `, [lovedCategoryIds, dislikedCategoryIds]);
  */


    const result = await db.query(`
      SELECT i.*, 
          json_agg(json_build_object('id', c.id, 'name', c.name, 'love', uc.love)) AS categories,
          SUM(CASE 
              WHEN uc.love = true THEN 10   -- Loved category
              WHEN uc.love = false THEN -5  -- Disliked category
              ELSE 0                      
          END) AS score
      FROM ideas i
      LEFT JOIN idea_categories ic ON i.id = ic.idea_id
      LEFT JOIN categories c ON ic.category_id = c.id
      LEFT JOIN user_categories uc ON uc.category_id = c.id AND uc.user_id = $1
      GROUP BY i.id
      ORDER BY score DESC, i.uses DESC;
  `, [userId]);



    res.status(200).json({ ideas: result.rows });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// localhost:3000/items/0
// get the top 6 most used items
router.get('/trending', async (req, res, next) => {

  try {
    const result = await db.query(
      `SELECT i.*,
      json_agg(json_build_object('id', c.id, 'name', c.name)) AS categories 
      FROM ideas i
      LEFT JOIN idea_categories ic ON i.id = ic.idea_id
      LEFT JOIN categories c ON ic.category_id = c.id
      GROUP BY i.id 
      ORDER BY i.uses DESC LIMIT 10;`);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No trending items found." });
    }

    const ideas = result.rows;

    res.status(200).json({ trending: ideas });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// localhost:3000/items
// create an item (given wishsts id)
router.post('/', authenticate, uploadPicture, async (req, res, next) => {

  const { name, description, url, image, sponsored } = req.body;
  const userId = req.user.userId; // Get user ID from authenticated token
  const price = req.body.price ? parseFloat(req.body.price) : undefined;

  // Parse the 'sponsored' field as a boolean
  let parsedSponsored = false;
  if (sponsored !== undefined) {
    parsedSponsored = sponsored === 'true'; // This will convert 'true' to true and anything else to false
  }

  if (userId !== 1) {
    deleteUploadedFile(req);
    return res.status(403).json({ message: "only admin can create ideas" });
  }


  if (!name) {
    deleteUploadedFile(req);
    return res.status(400).json({ message: "name is required" });
  }

  // Type checking
  if (name !== undefined && typeof name !== "string") {
    deleteUploadedFile(req);
    return res.status(400).json({ error: "name must be a string" });
  }
  if (description !== undefined && typeof description !== "string") {
    deleteUploadedFile(req);
    return res.status(400).json({ error: "description must be a string" });
  }
  if (url !== undefined && typeof url !== "string") {
    deleteUploadedFile(req);
    return res.status(400).json({ error: "url must be a string" });
  }
  if (price !== undefined && (typeof price !== "number" || price < 0)) {
    deleteUploadedFile(req);
    return res.status(400).json({ error: "price must be a non-negative number" });
  }

  try {
    // Determine image path 
    let image = "/assets/placeholder-item.png"; // Default image
    if (req.file) {
      image = `/uploads/ideas/${req.file.filename}`; // Use uploaded image path
    }

    // insert the idea
    const result = await db.query(`
      INSERT INTO ideas (name, description, url, image, price, sponsored)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
  `, [name, description, url, image, price, parsedSponsored]);

    const ideaId = result.rows[0].id;

    //    res.status(201).json({ message: "idea created successfully", idea: result.rows[0] });


    if (Array.isArray(req.body.categories)) {
      const categories = req.body.categories;
      try {
        await db.query("BEGIN"); // Start transaction

        const errors = [];

        for (const category of categories) {
          const { id, name } = category;

          if (!id && !name) {
            errors.push({ id, message: "id is a required fields" });
            continue;
          }

          try {
            let tempCatId = id;
            if(name){
              tempCatId = await db.query(
                `SELECT id FROM categories WHERE name = $1;`,
                [id]);
            }

            await db.query(
              `INSERT INTO idea_categories 
              (idea_id, category_id)
              VALUES ($1, $2);`,
              [ideaId, tempCatId]
            );

          } catch (error) {
            errors.push({ id, message: "Database error" });
          }
        }

        if (errors.length > 0) {
          await db.query("ROLLBACK");
          //return res.status(400).json({ message: "Some categories could not be added", errors });
        }

        await db.query("COMMIT");


      } catch (error) {
        await db.query("ROLLBACK");
        console.error("Error adding categories:", error);
      }
    }


    return res.status(201).json({ message: "idea created successfully", idea: result.rows[0] });

  } catch (error) {
    console.error("Error adding idea:", error);
    deleteUploadedFile(req);
    return res.status(500).json({ error: "Internal Server Error" });
  }

});



// Assign categories to an idea: post /1234/categories
router.post('/:ideaId/categories', authenticate, async (req, res, next) => {

  const ideaId = parseInt(req.params.ideaId);
  const userId = req.user.userId; // Get user ID from authenticated token

  if (userId !== 1) {
    return res.status(403).json({ message: "only admin can add categories to an idea" });
  }

  // MULTIPLE INSERT
  if (Array.isArray(req.body.categories)) {
    const categories = req.body.categories;
    try {
      await db.query("BEGIN"); // Start transaction

      const errors = [];

      for (const category of categories) {
        const { id } = category;

        if (!id) {
          errors.push({message: "id is a required fields multiple" });
          continue;
        }

        try {
          await db.query(
            `INSERT INTO idea_categories 
            (idea_id, category_id)
            VALUES ($1, $2);`,
            [ideaId, id]
          );

        } catch (error) {
          if (error.code === "23505") {
            errors.push({ id, message: "Category is already added" });
          } else {
            errors.push({ id, message: "Database error" });
          }
        }
      }

      if (errors.length > 0) {
        await db.query("ROLLBACK");
        console.error("Error adding categories:", errors);
        return res.status(400).json({ message: "Some categories could not be added", errors });
      }

      await db.query("COMMIT");
      return res.status(200).json({ message: "Categories assigned successfully" });

    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Error adding categories:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

  } else {

    /// SINGLE INSERT
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: "id is a required field" });
      }

      const result = await db.query(
        `INSERT INTO idea_categories 
      (idea_id, category_id)
      VALUES ($1, $2);`,
        [ideaId, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "categories not found." });
      }

      res.status(200).json("success");

    } catch (error) {
      // Handle duplicate category error
      if (error.code === "23505") {
        return res.status(409).json({ message: "Category is already added" });
      }

      console.error("Error adding category:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});




// localhost:3000/items/upload-profile
// upload new item picture
router.post('/upload/:itemId', authenticate, uploadPicture, async (req, res) => {

  const itemId = parseInt(req.params.itemId);
  const userId = req.user.userId; // Get user ID from authenticated token

  if (userId !== 1) {
    deleteUploadedFile(req);
    return res.status(403).json({ message: "only admin can add categories to an idea" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const filePath = `/uploads/ideas/${req.file.filename}`; // get file name from file

  try {
    // make sure owner has permission to do this
    const existanceCheck = await db.query(
      `SELECT 1 FROM ideas WHERE i.id = $1`,
      [itemId]
    );

    if (existanceCheck.rows.length === 0) {
      deleteUploadedFile(req);
      return res.status(403).json({ error: "idea doesn't exist" });
    }

    // Delete the old image off of server
    await deleteImage(itemId);

    await db.query("UPDATE items SET image = $1 WHERE id = $2", [filePath, itemId]);
    res.json({ message: "idea image updated!", imageUrl: `http://wishify.ca${filePath}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Delete the old idea picture off of server
async function deleteImage(itemId) {

  //get the file name
  const item = await db.query("SELECT image FROM ideas WHERE id = $1", [itemId]);

  const filePath = item.rows[0].image;

  // if the file is not null and is different that default
  if (filePath && filePath !== "/assets/placeholder-item.png") {
    const oldPicPath = path.join(__dirname, '.', filePath);
    if (fs.existsSync(oldPicPath)) {
      console.log("deleting this file: " + oldPicPath);
      fs.unlinkSync(oldPicPath);
    } else {
      console.log("Old picture file does not exist:", oldPicPath);
    }
  }
}


// Helper function to delete uploaded file if it exists
// used in case of an error
function deleteUploadedFile(req) {
  if (req.file) {
    const filePath = path.join(__dirname, './uploads/ideas', req.file.filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete uploaded file:", err);
      }
    });
    console.log("deleting this file: " + `./uploads/items${req.file.filename}`);
  }
}



module.exports = router;
