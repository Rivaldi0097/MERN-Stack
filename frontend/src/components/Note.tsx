import styles from "../styles/Note.module.css";
import { Card } from "react-bootstrap";
import { Note as NoteModel} from "../models/note";
import { formateDate } from "../utils/formatDate";
import { MdDelete } from 'react-icons/md';
import styleUtils from "../styles/utils.module.css";

interface NoteProps{
    note: NoteModel,
    onNoteClicked: (note:NoteModel) => void,
    onDeleteNoteClicked: (note:NoteModel) => void,
    className?: string,
}

const Note = ({ note, onNoteClicked,  className, onDeleteNoteClicked }: NoteProps) => {

    const {
        title,
        text,
        createdAt,
        updatedAt,
    } = note;

    let createUpdatedText: string;
    if(updatedAt > createdAt){
        createUpdatedText = "Updated: " + formateDate(updatedAt);
    }else{
        createUpdatedText = "Created: " + formateDate(createdAt)
    }

    return(
        <Card 
            className={`${styles.noteCard} ${className}` }
            onClick={()=>onNoteClicked(note)}    
        >
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    {note.title}
                    <MdDelete 
                        className="text-muted ms-auto"
                        onClick={(e)=>{
                            onDeleteNoteClicked(note);
                            e.stopPropagation();
                        }}
                    />
                </Card.Title>

                <Card.Text className={styles.cardText}>
                    {text}
                </Card.Text>
            </Card.Body>

            <Card.Footer className="text-muted">
                {createUpdatedText}
            </Card.Footer>
        </Card>
    )
}

export default Note;