//********** DEPENDENCIES *********************************************************************************//

//External:
const express = require("express"); // web server
const path = require("path"); // public directory management

//Internal:
// const routes = require("./routes")// custom api routes

//********* SERVER CONFIG *********************************************************************************//

const app = express();
const PORT = process.env.PORT || 3000; //deployed OR local development port

app.use(express.static("public")); //Specify static directory

app.use(express.urlencoded({ extended: true })); //handle post requests
app.use(express.json());

//********* ROUTE CONFIG *********************************************************************************//

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/index.html")); //serve landing page
})
app.use(routes) //API routes

//********* SERVER LAUNCH *********************************************************************************//

app.listen(PORT, function() {
  console.log(`API Server listening on port:${PORT}!`);
});
