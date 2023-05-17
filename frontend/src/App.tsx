import {useEffect, useState} from 'react';
import logo from './logo.svg';
import { Note as NoteModel} from './models/note';
import Note from './components/Note';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import styles from "./styles/NotesPage.module.css";
import stylesUtils from "./styles/utils.module.css";
import * as NotesAPI from './network/notes_api';
import AddNoteDialog from './components/AddEditNoteDialong';
import { FaPlus } from "react-icons/fa";
import AddEditNoteDialog from './components/AddEditNoteDialong';

function App() {

  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel|null>(null);

  useEffect(()=>{
    async function loadNotes(){

      try{
		setShowNotesLoadingError(false);
		setNotesLoading(true)
        const notes  = await NotesAPI.fetchNotes();
        setNotes(notes)

      }catch(error){
        console.error(error);
        setShowNotesLoadingError(true);
      } finally{
		setNotesLoading(false);
	  }
    }
    loadNotes()
  }, []);

  async function deleteNote(note:NoteModel) {
    
    try{
      await NotesAPI.deleteNote(note._id)
      setNotes(notes.filter(existingNote => existingNote._id !== note._id))

    }catch(error){
      console.error(error)
      alert(error)
    }
  }

  const notesGrid = 
	<Row xs={1} md={2} xl={3} className={`g-4 ${styles.NoteGrid}`}>
	{
		notes.map(note => (
		<Col key={note._id}>
			<Note 
			note={note}
			className={styles.note}
			onNoteClicked={setNoteToEdit}
			onDeleteNoteClicked={deleteNote}
			/>
		</Col>
		))
	}
	</Row>

  return (
    <Container className={styles.NotesPage}>
      <Button 
        className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
        onClick={()=>setShowAddNoteDialog(true)}
      >
        <FaPlus/>
        Add a new note
      </Button>
	
	{notesLoading && <Spinner animation='border' variant='primary'/>}
	{showNotesLoadingError && <p>Something went wrong. Please refresh the page</p>}
	{!notesLoading && !showNotesLoadingError &&
		<>
			{
				notes.length > 0
				?
					notesGrid
				:
					<p>You don't have any notes yet</p>
			}
		</>
	}
      {
         showAddNoteDialog && 
         <AddNoteDialog 
          onDismiss={()=>setShowAddNoteDialog(false)}
          onNoteSaved={(newNote)=>{
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);
            
          }}
         />
      }

      {noteToEdit && 
        <AddEditNoteDialog
          noteToEdit={noteToEdit}
          onDismiss={()=>setNoteToEdit(null)}
          onNoteSaved={(updatedNote)=>{
            setNotes(notes.map(exisitingNote=> exisitingNote._id === updatedNote._id ? updatedNote : exisitingNote))
            setNoteToEdit(null)
          }}
        />
      }
    </Container>
  );
}

export default App;
