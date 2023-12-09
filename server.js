
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors()); 


// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mane@3009',
  database: 'mydatabase',
});

db.connect((err) => {
  if (err) {
    console.log('Error connecting to the database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});



app.post('/signup', async (req, res) => {
 
  const { username, password, email } = req.body; 

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, email], (err, result) => {
      if (err) {
        console.error('Signup error:', err);
        res.status(500).send('Error signing up');
      } else {
        res.status(201).send('Signup successful umesh');
      }
    });
  } catch (error) {
    console.error('Password hashing error:', error);
    res.status(500).send('Error signing up');
  }
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, result) => {
    if (err) {
      console.error('Login error (Database Query):', err);
      res.status(500).send('Error logging in');
    } else {
      try {
        if (result.length > 0) {
          const isPasswordValid = await bcrypt.compare(password, result[0].password);
          if (isPasswordValid) {
            res.status(200).send('Login successful');
          } else {
            console.error('Invalid password for user:', username);
            res.status(401).send('Invalid credentials');
          }
        } else {
          console.error('User not found:', username);
          res.status(401).send('Invalid credentials');
        }
      } catch (error) {
        console.error('Password comparison error:', error);
        res.status(500).send('Error logging in');
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
