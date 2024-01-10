const express = require('express')
const app = express()
const BodyParser = require("body-parser")
const response = require('./response')
const port = 3000

//app untuk itulah  

app.use(express.static('public'));
app.use(BodyParser.json())
app.set("view engine","ejs")
app.set("views", "views")

// konek database


// API dan configurasi
app.get('/', (req, res) => {
  res.render("index")
})
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})