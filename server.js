const express = require("express");
const app = express();

const PORT = 3000;

const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");



app.set('view engine','ejs')

app.use("/user",userRoute);
app.use("/admin",adminRoute);


// Get Requests which simply will let this route to READ
app.get('/user/:userid',(req,res)=>{ // req - contains all info about the user | res - contains all the info about the server
    // Once a user enters this route, the server sends RESponse
    // The REQuest shows everything about the user, e.g. OS, IP, etc
    const data = req.params.userid; // params = the parameter that the request contains
    

    // res.sendFile(__dirname+"/views/user/index.html");
});


// The Port Where the Server would run
app.listen(PORT,()=>{
    console.log("Listening...")
});
