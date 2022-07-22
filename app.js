const express = require("express");
const app = express();
const port = 3004;
const mysql = require("./connection").con;
//Configuration
app.set("view engine", "hbs");
app.set("views", "./view");
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded());
app.use(express.json());

//Routing
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/search", (req, res) => {
  res.render("search");
});

app.get("/update", (req, res) => {
  res.render("update");
});

app.get("/delete", (req, res) => {
  res.render("delete");
});
app.get("/view", (req, res) => {
  let qry="select * from student";
  mysql.query(qry,(err, results)=>{
    if(err) throw err
    else {
      res.render("view",{data: results})
    }
  })
});

app.get("/addstudent", (req, res) => {
  //Fetching the data
  const { name, phone, email, gender } = req.query;

  //Sanitization XSS
  let qry = "SELECT * FROM `student` WHERE email=? or phone=?";
  mysql.query(qry, [email, phone], (err, results) => {
    if (err) {
      throw err;
    } else {
      if (results.length > 0) {
        res.render("add", { checkmesg: true });
      } else {
        //Insert query
        let qry2 = "INSERT INTO student VALUES(?,?,?,?)";
        mysql.query(qry2, [name, phone, email, gender], (err, results) => {
          if (results.affectedRows > 0) {
            res.render("add", { mesg: true });
          }
        });
      }
    }
  });
});

app.get("/searchstudent", (req, res) => {
  //fetch data from form
  const { phone } = req.query;
  let qry = "select * from student where phone=?";
  mysql.query(qry, [phone], (err, results) => {
    if (err) throw err;
    else {
      if (results.length > 0) {
        res.render("search", { mesg1: true, mesg2: false });
      } else {
        res.render("search", { mesg1: false, mesg2: true });
      }
    }
  });
});

app.get("/updatesearch", (req, res) => {
  //fetch data from form
  const { phone } = req.query;
  let qry = "select * from student where phone=?";
  mysql.query(qry, [phone], (err, results) => {
    if (err) throw err;
    else {
      if (results.length > 0) {
        res.render("update", { mesg1: true, mesg2: false, data: results });
      } else {
        res.render("update", { mesg1: false, mesg2: true });
      }
    }
  });
});
app.get("/updatestudent", (req, res) => {
  //fetch data
  const { phone, name, gender } = req.query;
  let qry = "UPDATE student set name=?, gender=? WHERE phone=?";
  mysql.query(qry, [name, gender, phone], (err, results) => {
    if (err) throw err;
    else {
      if (results.affectedRows > 0) {
        res.render("update", { umesg: true });
      }
    }
  });
});
app.get("/deletesearch", (req, res) => {
  //fetch data from form
  const { phone } = req.query;
  let qry = "select * from student where phone=?";
  mysql.query(qry, [phone], (err, results) => {
    if (err) throw err;
    else {
      if (results.length > 0) {
        res.render("delete", { mesg1: true, mesg2: false, data: results });
      } else {
        res.render("delete", { mesg1: false, mesg2: true });
      }
    }
  });
});

app.get("/removestudent", (req, res) => {
  //fetch data
  const { phone } = req.query;
  let qry = "DELETE FROM `student` WHERE phone=?";
  mysql.query(qry, [phone], (err, result) => {
    if (err) throw err;
    else {
      if (result.affectedRows > 0) {
        res.render("delete", { mesg3:true });
      }
    }
  });
});


//Creating Server
app.listen(port, (err) => {
  if (err) throw err;
  else console.log("Server is running at port %d: ", port);
});
