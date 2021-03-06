'use strict';

const cors = require('cors');
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;

const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);
client.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('./public'));

// app.get('/', function(request, response) {
//   response.sendFile('./public/index.html');
// });

app.get('DATABASE_URL', function(request, response) {
  client.query('SELECT * FROM DATABASE_URL;')
  .then(function(data) {
    response.send(data);
  })
  .catch(function(err) {
    console.error(err);
  });
});

loadDB();

function loadBooks() {
 fs.readFile('../book-list-client/data/books.json', function(err, fd) {
   JSON.parse(fd.toString()).forEach(function(ele) {
     client.query(
       'INSERT INTO books(title, author, isbn, image_url, description) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
       [ele.title, ele.author, ele.isbn, ele.image_url, ele.description]
     )
   })
 })
}

function loadDB() {
 client.query(`
   CREATE TABLE IF NOT EXISTS
   books(id SERIAL PRIMARY KEY, title VARCHAR(255), author VARCHAR(255), isbn VARCHAR(255), image_url VARCHAR(255), description TEXT NOT NULL);
   `)

   .then(loadBooks());
}
// app.post('/db/person', function(request, response) {
//   client.query(`
//     INSERT INTO persons(name, age, ninja)
//     VALUES($1, $2, $3);
//     `,
//     [
//       request.body.name,
//       request.body.age,
//       request.body.ninja
//     ]
//   )
//   .then(function(data) {
//     response.redirect('/');
//   })
//   .catch(function(err) {
//     console.error(err);
//   });
// });

// createTable();

app.listen(PORT, () => {
  console.log(`currently listening on ${PORT}`);
});

function createTable() {
  client.query(`
    CREATE TABLE IF NOT EXISTS persons(
      id SERIAL PRIMARY KEY,
      name VARCHAR(256),
      age INTEGER,
      ninja BOOLEAN
    );`
  )
  .then(function(response) {
    console.log('created table in db!!!!');
  });
};