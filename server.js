const express = require('express')
const app = express()
const BodyParser = require("body-parser")
const response = require('./response')
const port = 3000
app.use(BodyParser.urlencoded({ extended: true }));

// untuk database
const mysql = require('mysql')
const db = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "",
  database : "uc"
})


db.connect()

db.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  if (err) throw err

  else {
    console.log("DB aman sejah tere masbro")
  }
})



// respown


//app untuk itulah  

app.use(express.static('public'));
app.use(BodyParser.json())
app.set("view engine","ejs")
app.set("views", "views")

// konek database


// API dan configurasi
app.get('/', (req, res) => {

  const sql = `SELECT * FROM mahasiswa ORDER BY id DESC LIMIT 1;
  `

    db.query(sql, (err,fields)=>{ 
      // response(200,fields,"ini get data",res)
      const users = JSON.parse(JSON.stringify(fields))

       res.render("index",{users:users})
})
  })
   
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})