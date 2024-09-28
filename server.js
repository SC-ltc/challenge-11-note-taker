const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');  //Needed to create a unique id for each note
const dbNotes = require('./db/db.json')

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET api/notes should read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    fs.readFile(dbNotes, 'utf-8', (err,data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

// POST request to add note
// Referenced Module 11, Activity 19 to troubleshoot this POST route
app.post('api/notes', (req, res) => {

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required fields are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new review
        parsedNotes.push(newNote);

        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 2),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting new note');
  }
});

//Will add DELETE functionality in the future


// GET Route for homepage (index.html)
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  );

// Wildcard route to direct users to the homepage
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);