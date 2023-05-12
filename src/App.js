import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFullNote, setShowFullNote] = useState(false);
  
  useEffect(() => {
    const sortedNotes = [...notes].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setNotes(sortedNotes);
  }, [sortOrder,notes]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const newNote = { title, body, created: new Date(), updated: new Date() };
    setNotes([...notes, newNote]);
    setTitle('');
    setBody('');
  };

  const handleDelete = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
    setSelectedNote(null);
  };

  const handleEdit = (index) => {
    const note = notes[index];
    setTitle(note.title);
    setBody(note.body);
    setSelectedNote(index);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    const updatedNote = { title, body, updated: new Date() };
    const updatedNotes = [...notes];
    updatedNotes[selectedNote] = { ...updatedNote, created: updatedNotes[selectedNote].created };
    setNotes(updatedNotes);
    setTitle('');
    setBody('');
    setSelectedNote(null);
  };

  const handleReadMore = (event, index) => {
    event.preventDefault();
    setSelectedNote(index);
    setShowFullNote(true);
  };

  return (
    <div className="App">
    <h1 style={{textAlign: "center"}}>Notes</h1>
    <div className="notes-controls">
      <input type="text" placeholder="Search notes" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
        <option value="asc">Sort by title (asc)</option>
        <option value="desc">Sort by title (desc)</option>
        <option value="created">Sort by date created</option>
        <option value="updated">Sort by date modified</option>
      </select>
    </div>
    <div className="notes-list">
      {filteredNotes.map((note, index) => (
        <div key={index} className="note-preview">
          <h2>{note.title}</h2>
          {showFullNote && selectedNote === index ? (
                <p>{note.body}</p>
              ) : (
                <p>
                  {note.body.split(' ').length > 10
                    ? `${note.body.split(' ').slice(0, 10).join(' ')}... `
                    : note.body}
                  {note.body.split(' ').length > 10 && (
                    <button className='linkButton' href="#" onClick={(event) => handleReadMore(event, index)}>
                      Read More
                    </button>
                  )}
                </p>
              )}
            <button onClick={() => handleDelete(index)}>Delete</button>
            <button onClick={() => handleEdit(index)}>Edit</button>
            <p>Created: {note.created.toLocaleString()}</p>
            <p>Modified: {note.updated.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="note-form">
        <form onSubmit={selectedNote !== null ? handleUpdate : handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <textarea
            placeholder="Body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
          ></textarea>
          <button type="submit">{selectedNote !== null ? 'Update' : 'Add'}</button>
          {selectedNote !== null && <button onClick={() => setSelectedNote(null)}>Cancel</button>}
        </form>
      </div>
    </div>
  );
}


export default App;
