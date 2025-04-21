import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [triggerRefresh, setTriggerRefresh] = useState(false); // for refetching after update/delete
  const [editNote, setEditNote] = useState(null); // note currently being edited
  const [formData, setFormData] = useState({ title: '', body: '' });

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/notes/getnotes", {
        withCredentials: true,
      });
      setNotes(res.data.Notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [triggerRefresh]);

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/notes/delete/${id}`, {
        withCredentials: true,
      });
      setTriggerRefresh(!triggerRefresh); // trigger re-fetch
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEditClick = (note) => {
    setEditNote(note._id);
    setFormData({ title: note.title, body: note.body });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:3000/notes/update/${editNote}`,
        formData,
        {
          withCredentials: true,
        }
      );
      setEditNote(null);
      setFormData({ title: '', body: '' });
      setTriggerRefresh(!triggerRefresh); // refresh notes
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <div style={{ padding: '1rem', color: 'white' }}>
      <h2>Your Notes</h2>

      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note._id} style={{ marginBottom: '1rem' }}>
              {editNote === note._id ? (
                <>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  /><br />
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  ></textarea><br />
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditNote(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <h4>{note.title}</h4>
                  <p>{note.body}</p>
                  <button onClick={() => handleEditClick(note)}>Edit</button>{' '}
                  <button onClick={() => deleteNote(note._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
