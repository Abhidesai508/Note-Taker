const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3002;

const app = express();


//Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api', api);

app.use(express.static('public'));


app.get('/api/notes', (req, res) => {
    const notes = getNotes();
    res.json(notes);
  });
  
  // POST route for creating a new note
  app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = getNotes();
    newNote.id = generateUniqueID();
    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
    res.json(newNote);
  });
  
  // DELETE route for deleting a note
  app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    const notes = getNotes();
    const filteredNotes = notes.filter((note) => note.id !== noteId);
    saveNotes(filteredNotes);
    res.sendStatus(204);
  });
  
  // Helper functions
  
  // Function to read notes from the database file
  const getNotes = () => {
    try {
      const notesData = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'UTF8');
      const notes = JSON.parse(notesData);
      console.log('Read notes:', notes);
      return notes;
    } catch (err) {
      console.error('Error reading notes:', err);
      return [];
    }
  };
  
  // Function to generate a unique ID for a new note
  const generateUniqueID = () => {
    const timestamp = Date.now().toString();
    const randomNumber = Math.floor(Math.random() * 1000).toString();
    return timestamp + randomNumber;
  }
  
  // Function to save notes to the database file
  const saveNotes = (notes) => {
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));
  };



//GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//GET route for home page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
//console message for localhost
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);