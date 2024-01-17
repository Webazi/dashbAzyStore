const express = require('express')
const favicon = require('serve-favicon');
const app = express()
const path = require('path');
const BodyParser = require("body-parser")
const response = require('./response')
const port = 3000
const mysql = require('mysql')
app.use(BodyParser.urlencoded({ extended: true }));

// favicon

app.use(favicon(path.join(__dirname, 'public', 'faviconn.ico')));

// untuk database update harga
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

// APP.GET
app.get('/', (req, res) => {
  const sql = `SELECT * FROM mahasiswa ORDER BY id DESC LIMIT 1;`
    db.query(sql, (err,fields)=>{ 
      // response(200,fields,"ini get data",res)
      const users = JSON.parse(JSON.stringify(fields))
       res.render("index",{users:users})
})
  })

app.get('/jual', (req,res)=> {
  res.render("jual")
})

app.get('/beli', (req,res)=> {
  res.render("beli")
})

app.get('/admin', (req,res)=>{
  const sql = `SELECT * FROM mahasiswa ORDER BY id DESC LIMIT 1;`
    db.query(sql, (err,fields)=>{ 
      // response(200,fields,"ini get data",res)
      const users = JSON.parse(JSON.stringify(fields))
       res.render("dasboard",{users:users})
})
})
   

// APP.POST

// ini post di dashboard
app.post("/tambah", (req,res) =>{
  const jual = req.body.jual
  const beli = req.body.beli
  const jBgl = req.body.jual_bgl
  const bBgl = req.body.beli_bgl
// query database
  const sql = `INSERT INTO mahasiswa (id, jual, beli, jual_bgl, beli_bgl) VALUES (NULL, '${jual}', '${beli}', '${jBgl}', '${bBgl}');`
db.query(sql,(err,result)=>{
  console.log(result)
  res.redirect("/admin")
})

})

// post untuk jual

app.post("/jualkan", (req,res)=>{

})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})