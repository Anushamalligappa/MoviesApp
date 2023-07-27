const express=require('express')
const app=express();
require ('dotenv/config');
const PORT=process.env.Port||8000;
const {Pool} =require('pg');
const cors=require('cors');
const pool=new Pool({connectionString:process.env.ELEPHANT_SQL});
app.use(cors())
app.use(express.json());
app.get("/api/movies",(req,res)=>{
    pool .query('SELECT * FROM movies')
    .then((data)=>res.json(data.rows))
    .catch((e)=>res.status(500).json({msg:e.message}))

})
app.get("/api/movies/:id",(req,res)=>{
    const {id}=req.params;
    const safeValue=[id];
    pool .query('SELECT * FROM movies WHERE id=$1',safeValue)
    .then(({rowCount,rows})=>{
        if(rowCount!==0){
            res.json(rows[0])
        }else{
            res.status(404).json({msg:"Not Found"})
        }
    })
    .catch((e)=>res.status(500).json(e.message));
})
app.post("/api/movies",(req,res)=>{
    const {Title,Director,Year,Rating,Poster}=req.body;
    const safeData=[Title,Director,Year,Rating,Poster];
    pool .query('INSERT INTO movies (Title,Director,Year,Rating,Poster) VALUES ($1,$2,$3,$4,$5)',safeData)
    .then(({rows})=>{
        res.json(rows[0])
    })
    .catch((e)=>res.status(500).json({msg:e.message}))

})
app.put("/api/movies/:id",(req,res)=>{
    const {id}=req.params;
    
    const  {Title,Director,Year,Rating,Poster}=req.body;
    const safeData=[Title,Director,Year,Rating,Poster,id];
    
    pool .query('UPDATE movies SET Title=$1,Director=$2,Year=$3,Rating=$4,Poster=$5 WHERE id=$6 RETURNING *',safeData)

.then(({rows})=>[
    res.status(201).json(rows[0])
])
.catch((e)=>res.status(500).json({msg:e.message}))


})
app.delete("/api/movies/:id",(req,res)=>{
    const {id}=req.params;
    const safeData=[id];

    pool .query('DELETE FROM movies WHERE id=$1',safeData)
    .then(({rows})=>{
        res.status(200).json(rows[0])
    })
    .catch((e)=>res.status(500).json({msg:e.message}))

})




app.listen(PORT,()=>console.log(`server is on ${PORT}`) )

