import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Card, Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";

const Home2 = () => {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [noteData, setNoteData] = useState({ title: "", body: "" });
  const [editId, setEditId] = useState(null);
  const [auth, setAuth] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/notes/getnotes", {
        withCredentials: true,
      });
      setNotes(res.data.Notes);
    } catch (err) {
      showToast("Error fetching notes", "danger");
    }
  };

  // Check authentication
  const checkAuth = async () => {
    try {
      const res = await axios.post("http://localhost:3000/notes/authCheck", {}, {
        withCredentials: true,
      });
      if (res.data.success) {
        setAuth(true);
        fetchNotes();  // Re-fetch notes after authentication
      } else {
        setAuth(false);
      }
    } catch (err) {
      setAuth(false);
      console.error("Error during auth check:", err);
    }
  };

  useEffect(() => {
    checkAuth(); // Check authentication when component mounts
  }, []);

  // Open modal for add/edit
  const openModal = (note = null) => {
    setNoteData(note ? { title: note.title, body: note.body } : { title: "", body: "" });
    setEditId(note ? note._id : null);
    setShowModal(true);
  };

  // Create new note
  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:3000/notes/createnote", noteData, { withCredentials: true });
      setShowModal(false);
      setNoteData({ title: "", body: "" });
      fetchNotes();
      showToast("Note added successfully", "success");
    } catch (error) {
      showToast("Error creating note", "danger");
    }
  };

  // Update existing note
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/notes/update/${editId}`, noteData, { withCredentials: true });
      setShowModal(false);
      setNoteData({ title: "", body: "" });
      setEditId(null);
      fetchNotes();
      showToast("Note updated successfully", "success");
    } catch (error) {
      showToast("Error updating note", "danger");
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/notes/delete/${id}`, { withCredentials: true });
      fetchNotes();
      showToast("Note deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting note", "danger");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
      setAuth(false);
      navigate("/login");
    } catch (err) {
      showToast("Logout failed", "danger");
    }
  };

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  return (
    <div className="text-white p-5">
      <section className="Home2">
        <div className="header d-flex justify-content-between align-items-center">
          <h1>Thoughts</h1>
          <div className="navButton">
            {auth ? (
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Button variant="outline-primary" onClick={() => navigate("/register")}>Register</Button>{" "}
                <Button variant="success" onClick={() => navigate("/login")}>Login</Button>
              </>
            )}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="cards mt-5">
          {notes.length ? (
            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
              {notes.map((note) => (
                <div className="col" key={note._id}>
                  <Card bg="dark" text="white">
                    <Card.Body>
                      <Card.Title>{note.title}</Card.Title>
                      <Card.Text>{note.body}</Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button size="sm" variant="warning" onClick={() => openModal(note)}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => deleteNote(note._id)}>Delete</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-notes text-center mt-5">
              <h3>Please create some notes!</h3>
            </div>
          )}
        </div>

        {/* Add Button */}
        {auth && (
          <div className="add">
            <button onClick={() => openModal()}>+</button>
          </div>
        )}
      </section>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="custom-modal">
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>{editId ? "Update Note" : "Add Note"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={noteData.title}
                onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Body</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your note..."
                value={noteData.body}
                onChange={(e) => setNoteData({ ...noteData, body: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={editId ? handleUpdate : handleCreate}>
            {editId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        onClose={() => setToast({ show: false, message: "", type: "" })}
        bg={toast.type === "success" ? "success" : "danger"}
        className="position-fixed bottom-0 end-0 m-3"
      >
        <Toast.Body>{toast.message}</Toast.Body>
      </Toast>
    </div>
  );
};

export default Home2;
