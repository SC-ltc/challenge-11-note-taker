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
    res.json(dbNotes)
});

// POST request to add note
app.post('api/reviews', (req, res) => {

    //Destructure for items in req.body
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        // Obtain existing notes
        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);

                //Write updated notes back to the file
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (err) => {
                    console.error(err);
                });
                res.json('Successfully added new note');
            };
        });
    };
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