const express = require("express");
const app = express();

const PORT = 3000;

const userRoute = require("./server/routes/user");
const adminRoute = require("./server/routes/admin");

app.set('view engine', 'ejs');

app.get('', (req, res) => {
    console.log("Home Page");
    res.send(`<!DOCTYPE html>
<html>
<head>
<style>
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    padding: 0;

}
a:link, a:visited {
  background-color: #f44336;
  color: white;
  padding: 14px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

a:hover, a:active {
  background-color: red;
}
</style>
</head>
<body>

<h2>The Campus Chronicles</h2>

<a href="/user/game/1025">Go to the Game</a>

</body>
</html>


`); // Ensure this is correct and the path exists
});

app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use(express.static("public"));// For static images, css and js transitions