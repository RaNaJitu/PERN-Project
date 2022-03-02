require("dotenv").config();
const { query } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./DB");
const app = express();
const PORT = process.env.PORT || 3005;


// app.use(morgan('dev'));
// app.use((req, res, next)=>{
//     console.log("this is middleware");
//     next();
// })


app.use(cors());
app.use(express.json())

/**
 *  Get all Restaurants
 *  */
app.get('/api/V1/restaurants',async (req,res)=>{
    //res.send('my name is jitu');
    try{
        const results = await db.query("SELECT * FROM restaurants");
    console.log(results);
    res.status(200).json({
        status: "Success",
        results: results.rows.length,
        data:{
            restaurants: results.rows,
        },
    });
    }catch(err){
        console.log(err);
    }
    
}); 

/**
 * Get a Restaurants
 * 
*/
app.get('/api/V1/restaurants/:id', async (req,res)=>{
    try{
        const restaurant = await db.query(
            //!this is not a good practices for developer because SQL Injection attacked is happened
            //`SELECT * FROM restaurants WHERE id = ${req.params.id}` 
            //use Parameterized query
            "SELECT * FROM restaurants WHERE id = $1",[req.params.id]
            );
        console.log(restaurant);
            //console.log("name: " + req.params.id);
        //# select  * from restaurants where  id = req.params.id;
        const reviews = await db.query("SELECT * FROM  reviews  WHERE restaurant_id = $1", [req.params.id]);
        //console.log(reviews);
        res.status(200).json({
        status: "Success",
        results: restaurant.rows.length,
        data:{
            restaurants: restaurant.rows,
            reviews: reviews.rows
        },
    });
    }catch(err){
        console.log(err);
    }
    
});


/**
 * POST
 * creating the new restaurants
 */
app.post('/api/V1/restaurants', async(req,res)=>{
    console.log(req.body);
    try{
        const results = await db.query(`insert into restaurants ( name, location, price_range ) 
        values ($1, $2, $3) returning *`,
        [req.body.name, req.body.location, req.body.price_range])
        console.log(results);
        res.status(200).json({
            status: "Success",
            results: results.rows.length,
            data:{
                restaurants: results.rows[0],
            },
        });
    }catch(err){
        console.log(err)
    }
});
/**
 * PUT
 * Update Restaurants
 */
app.put('/api/V1/restaurants/:id',async (req,res)=>{
    //console.log(req.params.id);
    console.log(req.body);
    const results = await db.query(`UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *`,
    [req.body.name,req.body.location, req.body.price_range, req.params.id]);
    console.log(results);
    res.status(200).json({
        status: "Success",
        data:{
            restaurants: results.rows[0],
        },
    });
})

/**
 * DELETE
 * Delete Restaurants
 */
 app.delete('/api/V1/restaurants/:id',async (req,res)=>{
    try{
        const results = await db.query(`DELETE FROM restaurants WHERE id = $1`,[req.params.id]) 
        res.status(204).json({
        status: "Success"
    });
    }catch(err){
        console.log(err);
    }
})

app.listen(PORT, ()=>{
    console.log(`Listening on Port ${PORT}`);
});