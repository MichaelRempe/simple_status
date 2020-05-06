//********** DEPENDENCIES *********************************************************************************//

//External:
const express = require("express"); // web server
const path = require("path"); // directory management
const fs = require("fs"); // file system access

//Internal:
const Issue = require("./DB/Issue.js");

//********* SERVER CONFIG *********************************************************************************//

const app = express();
const PORT = process.env.PORT || 3000; //deployed OR local development port

app.use(express.static("public")); //Specify static directory

app.use(express.urlencoded({ extended: true })); //handle post requests
app.use(express.json());

//********* ROUTE CONFIG *********************************************************************************//

//HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html")); //serve landing page
});
//API
app.get("/api/issue", (req, res) => {
  res.sendFile(path.join(__dirname, "/DB/proxyDB.json"));
});

app.post("/api/issue", (req, res) => {
  // Create new issue with collected data => write new issue to  JSON 'database'
  let issue = new Issue(req.body.title, req.body.content, req.body.progress);
  console.log(issue);
  let newIssues = [issue];

  fs.readFile(path.join(__dirname, "/DB/proxyDB.json"), (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let trackedIssues = JSON.parse(data);
      newIssues = newIssues.concat(trackedIssues); //concat stored issues into new list
    }
    fs.writeFile(
      path.join(__dirname, "/DB/proxyDB.json"),
      JSON.stringify(newIssues),
      (err) => {
        // push new list back to db.json
        if (err) {
          console.log(err);
        }
      }
    );
  });
  res.sendFile(path.join(__dirname, "/DB/proxyDB.json"));
});

app.delete("/api/issue/:id", (req, res) => {
  let issue_id = parseInt(req.params.id);
  fs.readFile(path.join(__dirname, "/DB/proxyDB.json"), (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error: Data Object Read")
    } else {
      let trackedIssues = JSON.parse(data);
      let newIssues = trackedIssues.filter((obj) => {
        if (obj.id !== issue_id) {
          return obj.id;
        }
      });
      fs.writeFile(
        path.join(__dirname, "/DB/proxyDB.json"),
        JSON.stringify(newIssues),
        (err) => {
          // push new list back to db.json
          if (err) {
            console.log(err);
          }
        }
      );
    }
  });
  res.sendFile(path.join(__dirname, "/DB/proxyDB.json"));
  res.status(200).send("Success");
});

app.put("/api/issue/:id", (req, res) => {
  let issue_id = req.params.id;
  fs.readFile(path.join(__dirname, "/DB/proxyDB.json"), (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error: Data Object Read")
    } else {
      let trackedIssues = JSON.parse(data);
      let newIssues = trackedIssues.map((issue) =>
        issue.id == issue_id
          ? { ...issue, progress: issue.progress + 20 }
          : issue
      );
      fs.writeFile(
        path.join(__dirname, "/DB/proxyDB.json"),
        JSON.stringify(newIssues),
        (err) => {
          // push new list back to db.json
          if (err) {
            console.log(err);
          }
        }
      );
    }
  });

  res.sendFile(path.join(__dirname, "/DB/proxyDB.json"));
  res.status(200).send("Success");
});

//HTML -- invalid paths
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html")); //handle invalid routes
});

//********* SERVER LAUNCH *********************************************************************************//

app.listen(PORT, function () {
  console.log(`API Server listening on port:${PORT}!`);
});
