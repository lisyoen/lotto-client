const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;
const savedir = 'D:\\git\\qrscanner\\';
const fileExt = 'file';

// Create a new database connection
const db = new sqlite3.Database('qrScanner.db');

// Create a table for files if it does not exist
db.run('CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, postdtime DATETIME DEFAULT CURRENT_TIMESTAMP, filename TEXT UNIQUE, filesize INTEGER)');

// configure the server to parse JSON data from the request body
app.use(bodyParser.json());

// Create a route to handle POST requests
app.post('/post', (req, res) => {
  // Get the filename, filesize, offset, codesize and content from the request query and body
  var filename = req.body.filename;
  var filesize = req.body.filesize;
  var offset = req.body.offset;
  var codesize = req.body.codesize;
  var content = req.body.content;

  // Print the parameters to the console
  console.log(`filename: ${filename}, filesize: ${filesize}, offset: ${offset}, codesize: ${codesize}, content: ${content}`);

  // Insert the file into the database
  db.run('INSERT INTO files (filename, filesize) VALUES (?, ?)', [filename, filesize], function (err) {
    if (err) {
      // If the filename already exists, update the filesize instead
      db.run('UPDATE files SET filesize = ? WHERE filename = ?', [filesize, filename], function (err) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
          return;
        }
        // Save the content to a file with the generated ID as the filename
        const fileId = this.lastID;
        let filepath = `${savedir}${fileId}.${fileExt}`;
        console.log(filepath);

        fs.appendFile(filepath, content, (err) => {
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
          }
          let writtenfilesize = 0;
          const stats = fs.statSync(filepath);
          writtenfilesize = stats.size;
          let result = {
            filename: filename,
            filesize: writtenfilesize
          }
          res.json(result);
        });
      });
    } else {
      // Save the content to a file with the generated ID as the filename
      const fileId = this.lastID;
      let filepath = `${savedir}${fileId}.${fileExt}`;
      fs.appendFile(`${fileId}.${fileExt}`, content, (err) => {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
          return;
        }
        let writtenfilesize = 0;
        const stats = fs.statSync(filepath);
        writtenfilesize = stats.size;
        let result = {
          filename: filename,
          filesize: writtenfilesize
        }
        res.json(result);
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
