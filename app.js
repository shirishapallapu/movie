const express = require("express");
const path = require("path");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname,"moviesData.db");
let db = null;

const initializeDbAndServer = async()=>{
    try{
        db = await open({
        filename:dbPath,
        driver:sqlite3.Database
        app.listen(3000)
    });}
    catch(e){
        console.log(`DB Error : ${e.message}`);
        process.exit(1);
    }

};

app.get("/movies/",async (request,response)=>{
    const getMovieNamesQuery = "SELECT movie_name FROM
    movie ORDER BY movie_id;";
    const movieNameArray = await db.all(getMovieNamesQuery);
    response.send(movieNameArray);    
});

app.post("/movies/",async(request,response)=>{
    const movieDetails = request.body;
    const{director_id,movie_name,lead_actor} = movieDetails;
    const addMovieNameQuery = "INSERT INTO 
    movie(director_id,movie_name,lead_actor)
    VALUES (${director_id},${movie_name},${lead_actor});";
    const dbResponse = await db.run(addMovieNameQuery);
    response.send("Movie Successfully Added");

});

app.get("/movies/:movieId/", async(request,response)=>{
    const {movieId} = request.params;
    const getMovieNameQuery = "SELECT * FROM 
    movie 
    WHERE movie_id = ${movieId};";
    const dbResponse = await db.get(getMovieNameQuery);
    response.send(dbResponse);
});

app.put("/movies/:movieId/", async(request,response)=>{
    const {movieId} = request.params;
    const {"directorId","movieName","leadActor"} = request.body;
    const updateMovieDetails = "UPDATE movie SET 
    director_id = ${directorId},
    movie_name = ${movie_name},
    leadActor = ${lead_actor}
    WHERE movie_id = ${movieId};";
    const dbResponse = await db.run(updateMovieDetails);
    response.send("Movie Details Updates");
});

app.delete("/movie/:movieId/",async (request,response)=>{
    const {movieId} = request.params;
    const deleteMovieQuery = "DELETE FROM movie 
    WHERE movie_id = ${movieId};";
    await db.run(deleteMovieQuery);
    response.send("Movie Removed");
});

app.get("/directors/",async (request,response)=>{
    const getDirectorNamesQuery = "SELECT director_name FROM
    director ORDER BY director_id;";
    const directorNameArray = await db.all(getDirectorNamesQuery);
    response.send(directorNameArray);    
});

app.get("/directors/:directorId/movies/",async(request,response)=>{
    const {directorId} = request.params;
    const moviesDirectedQuery = "SELECT movie_name FROM movie LEFT JOIN 
    director 
    ON movie_name.director_id = director.director_id
    WHERE director_id = ${directorId};";
    const movieDirectedList = await db.all(moviesDirectedQuery);
    response.send(movieDirectedList);
});


module.exports = app;