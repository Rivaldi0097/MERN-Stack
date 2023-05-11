import styles from "../styles/Note.module.css";
import { Card } from "react-bootstrap";
import { Note as NoteModel} from "../models/note";
import { formateDate } from "../utils/formatDate";

interface NoteProps{
    note: NoteModel,
    className?: string,
}

const Note = ({ note, className }: NoteProps) => {

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
        <Card className={`${styles.noteCard} ${className}` }>
            <Card.Body className={styles.cardBody}>
                <Card.Title>
                    {note.title}
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