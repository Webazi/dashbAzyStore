const express = require('express')
const flash = require('connect-flash');
const cookieSession = require('cookie-session')
const favicon = require('serve-favicon');
const app = express()
const path = require('path');
const BodyParser = require("body-parser")

const port = 3000
const mysql = require('mysql');
const { title } = require('process');
const { error } = require('console');
app.use(BodyParser.urlencoded({ extended: true }));




// favicon


app.use(favicon(path.join(__dirname, './public/img', 'faviconn.ico')));

// untuk database update harga
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "uc"
})

const namaS = {
  home : 'home',
 status : 'status',
 history : 'history',
 price : 'harga'

};

const linkS = {
  
  home : '/',
  status : '/status',
  history : '/history',
  price : '/prices',
}

app.use(cookieSession({
  name: 'session',
  keys: ['your-secret-key'],   // Ganti dengan kunci rahasia yang aman
  maxAge: 24 * 60 * 60 * 1000  // Durasi maksimal cookie (24 jam dalam milidetik)
}));

// Middleware untuk autentikasi
function authMiddleware(req, res, next) {
  if (req.session && req.session.username) {
    next(); // Sesi valid, lanjut ke rute berikutnya
  } else {
    res.redirect("/login"); // Tidak ada sesi, blokir akses
  }
}
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('successMessage');
  next();
});

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
app.set("view engine", "ejs")
app.set("views", "views")

// konek database


// API dan configurasi

// APP.GET


app.get('/login', (req, res) => {
    res.render("login")
  })

  app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const query = 'SELECT * FROM dosen WHERE nama = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length > 0) {
          req.session.username = username;
            res.redirect("/")
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});

app.get('/status', authMiddleware,(req, res) => {
  res.render("jual", { title: namaS.history,title1 : namaS.home, 
    title2 : namaS.status, 
    title3 : namaS.history, 
    title4 : namaS.price,
    link1 : linkS.home ,
      link2 : linkS.status ,
      link3 : linkS.history ,
      link4 : linkS.price , })
})

app.get('/logout', (req, res) => {
    req.session = null; // Hapus sesi
    res.redirect('/login');
});



app.get('/history',authMiddleware, (req, res) => {
  const query = `
    SELECT id, nama, password,status, 'dosen' AS source FROM dosen
    UNION ALL
    SELECT id, jual, beli,status, 'mahasiswa' AS source FROM mahasiswa;
  `;


  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Server error');
      return;
    }console.log(results)
    res.render('dashboard', { data: results , title: "History",title1 : namaS.home, 
      title2 : namaS.status, 
      title3 : namaS.history, 
      title4 : namaS.price,
      link1 : linkS.home ,
        link2 : linkS.status ,
        link3 : linkS.history ,
        link4 : linkS.price , });
  });
})


app.get('/Prices',authMiddleware, (req, res) => {
  const sql = `SELECT * FROM mahasiswa ORDER BY id DESC LIMIT 1;`
  const dat = req.query.j;
  const data = req.query.i;
  console.log(dat)
  db.query(sql, (err, fields) => {
    const users = JSON.parse(JSON.stringify(fields))

    res.render("beli", { 
      users: users, 
      title: "Prices", 
      message:"aman" , 
      dat,data, 
      title1 : namaS.home, 
      title2 : namaS.status, 
      title3 : namaS.history, 
      title4 : namaS.price,
      link1 : linkS.home ,
      link2 : linkS.status ,
      link3 : linkS.history ,
      link4 : linkS.price ,
    })
  })

})

app.get('/',authMiddleware, (req, res) => {
  const sql = `SELECT * FROM transaksi;`
  db.query(sql, (err, fields) => {
    // response(200,fields,"ini get data",res)
    const users = JSON.parse(JSON.stringify(fields))
    res.render("dasboard", { users: users, title: "Admin",username: req.session.username, sesi : req.session,
      title1 : namaS.home, 
      title2 : namaS.status, title3 : namaS.history,
      title4 : namaS.price,link1 : linkS.home ,
      link2 : linkS.status ,link3 : linkS.history ,
      link4 : linkS.price ,
     })
  })
})



// APP.POST

// ini post di dashboard
app.post("/tambah",authMiddleware, (req, res) => {
  const jual = req.body.Jual
  const beli = req.body.Beli
  const j = "anda tidak memasukan data!!"
  const i = "Harga berhasil di ubah"


  // query database
  if (jual && beli > 0) {
    const sql = `INSERT INTO mahasiswa (id, jual, beli,status) VALUES (NULL, '${jual}', '${beli}', 'harga');`
    db.query(sql, (err, result) => {
      console.log(result)
      res.redirect(`/prices?i=${encodeURIComponent(i)}`)
      
    })

  }
  else {
    res.redirect(`/prices?j=${encodeURIComponent(j)}`)
    
  }

})

// post untuk jual


// untuk error
app.use(authMiddleware,(req,res,next)=>{
  error.status = 404
  res.render("error")

})
// Middleware untuk menangkap permintaan yang tidak sesuai


app.post("/jualkan",authMiddleware, (req, res) => {

})



app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})