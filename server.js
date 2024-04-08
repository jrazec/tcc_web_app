const express = require("express");
const app = express();

// To Access the Views Directory
app.use(express.static(__dirname+"/views"));


// Get Requests which simply will let this route to READ
app.get('/user/:userid',(req,res)=>{ // req - contains all info about the user | res - contains all the info about the server
    // Once a user enters this route, the server sends RESponse
    // The REQuest shows everything about the user, e.g. OS, IP, etc
    const data = req.params.userid; // params = the parameter that the request contains
    

    // res.sendFile(__dirname+"/views/user/index.html");
});

obj = {
    hello : -1,
    bitch : 20,
    sup : 12
}
app.get('/trial/:word/:score',(req,res)=>{
    const word = req.params.word;
    const score = req.params.score;

    res.send("")
});

// The Port Where the Server would run
app.listen(3000,()=>{
    console.log("Listening...")
});
