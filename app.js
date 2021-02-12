const express = require('express')
const app = express()
require('dotenv').config()
const db = require("./config/dbConnect")
const bodyParser = require('body-parser');



db.connect();
console.log("conectado a bd");

app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Importar rutas
const indexRoutes = require('./routes/index');

//Rutas
app.use('/', indexRoutes);

app.listen(process.env.PORT, () => {
  console.log(`iniciado en http://localhost:${process.env.PORT || 3000}`)
})
