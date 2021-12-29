const notes =[
    {
        id:1,
        title: "this is title 1",
        body: "this is first body",
        updated: "2021-10-31T15:20:30.334Z",
    },
    {
        id:2,
        title: "this is title 2",
        body: "this is two body",
        updated: "2021-10-14T15:21:30.534Z",
    },
    {
        id:3,
        title: "this is title 3",
        body: "this is third body",
        updated: "2021-11-01T15:21:30.534Z",
    },
];

export default class NotesAPI{
 static getAllNotes(){
 
  const savedNotes = JSON.parse(localStorage.getItem("notes-app")) || [];
  return savedNotes.sort((a,b) => {
   return new Date(a.updated) >  new Date(b.updated) ? -1 :1;
  })
 }
static saveNote (noteToSave){
    const notes = NotesAPI.getAllNotes();
     const existedNote = notes.find(n => n.id == noteToSave.id);
     if (existedNote){
        existedNote.title=noteToSave.title;
        existedNote.body=noteToSave.body;
        existedNote.updated = new Date().toISOString();
     }
     else{
        noteToSave.id= new Date().getTime();
        noteToSave.updated = new Date().toISOString();
        notes.push(noteToSave);
     }
     localStorage.setItem("notes-app" , JSON.stringify(notes));
    }
    static deleteNote (id) {
        const notes = NotesAPI.getAllNotes();
        const filteredNotes =notes.filter( n => n.id != id);
        localStorage.setItem("notes-app" , JSON.stringify(filteredNotes));
    }
}

// console.log(NotesAPI.saveNote({
//     id:4,
//     title: "this is title 4",
//     body: "this is forty body",
//     updated: "2021-11-05T15:21:30.534Z",
// },));

// console.log(NotesAPI.getAllNotes());