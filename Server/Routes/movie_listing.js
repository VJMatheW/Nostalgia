const router = require("express").Router();
const { DatabaseService } = require('../../Components');

let movieListing = DatabaseService.movieListing;

router.post("/", (req, res)=>{
    let { movie_name, quality, magnet_link } = req.body
    try{
        // console.log(req.body)
        let sql = `insert into movies(movie_name, quality, magnet_link) values(?,?,?)`
        movieListing.run(sql, [movie_name, quality, magnet_link], function(err){
            if(err){
                console.log("Insert Error : ",err)
                throw("Not inserted into db : ", err)
            }
            res.status(200).json({ "insert_id": this.lastID })
        })        
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err })
    }
})

router.get("/", (req, res)=>{
    try{
        let sql = `select * from movies`
        movieListing.all(sql, function(err, result){
            if(err){
                console.log("Select Error : ", err);
                throw("Select operation error ", err);
                return;
            }
            res.json({ result })
        })
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err })
    }
})

module.exports = router;