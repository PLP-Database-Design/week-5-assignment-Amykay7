//import dependancies
const express = require("express")
const app = express()
const mysql = require('mysql2')
const dotenv = require('dotenv')

//configure environment variables
dotenv.config();

//connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

//test connection
db.connect((err) => {
    if(err) {
        //connection not successful
        return console.log("Error connecting to the database: ", err)
    }
    //connection successful
    console.log("successfully connected to MySql: ", db.threadId)

})

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


//retrieve all patients
app.get('', (req, res) => {
    const getPatients = "SELECT * FROM patients"
    db.query(getPatients, (err, data) => {
        //Failed to fetch data
        if(err) {
            return res.status(400).send("Failed to get patients", err)
        }
        res.status(200).render('data', { data })
    })
})


// 2. Retrieve all providers
app.get('/api/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching providers:', err);
      return res.status(500).send('Error fetching providers');
    }
    res.json(results);
  });
});

// 3. Filter patients by First Name
app.get('/api/patients/filter/:firstName', (req, res) => {
  const firstName = req.params.firstName;
  const query = 'SELECT * FROM patients WHERE first_name = ?';
  db.query(query, [firstName], (err, results) => {
    if (err) {
      console.error('Error filtering patients:', err);
      return res.status(500).send('Error filtering patients');
    }
    res.json(results);
  });
});

// 4. Retrieve all providers by their specialty
app.get('/api/providers/specialty/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  const query = 'SELECT * FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      console.error('Error filtering providers:', err);
      return res.status(500).send('Error filtering providers');
    }
    res.json(results);
  });
});

//start and listen to the server
app.listen(3300, () => {
    console.log('server is running on port 3300...')
})