const mysql=require("mysql")
const con=mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "youtube",
    port: 3306
})

con.connect((err)=>{
    if(err) throw err;
    console.log("Connection created.......!!!");
})

module.exports.con=con;