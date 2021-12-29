import NotesAPI from "./NotesAPI.js";
import NotesView from "./notesView.js";

export default class{
    constructor (root){
        this.notes = [];
        this.activeNote =null;
       this.view = new NotesView(root , this._handlers());
       this._refreshNotes();
    }

 _refreshNotes(){
        const notes = NotesAPI.getAllNotes();
        //set note list
        this._setNotes(notes);

        //set active note
        if(notes.length > 0){
            this._setActiveNote(notes[0]);
        }
}
_setNotes (notes){
    this.notes = notes;
    this.view.updateNoteList(notes);
    this.view.updateNotePreviewVisiblity(notes.length >0);
}
_setActiveNote(note){
    this.activeNote= note;
    this.view.updateActiveNote(note);
}

_handlers(){
  return{
    onNoteAdd : () =>{
       const newNote ={
           title : "new title",
           body : "new body",
       };
       NotesAPI.saveNote(newNote);
       this._refreshNotes();
    },
    onNoteEdit :(newTitle,newBody) => {
     NotesAPI.saveNote({
        id : this.activeNote.id,
        title :newTitle,
        body :newBody,
     });
     this._refreshNotes();
    },
    onNoteSelected: (noteId) =>{
     const selectedNote = this.notes.find( n => n.id == noteId);
     this._setActiveNote(selectedNote);
    },
    onNoteDelete: (noteId) =>{
        NotesAPI.deleteNote(noteId);
        this._refreshNotes();
    },
  }
    }
}
