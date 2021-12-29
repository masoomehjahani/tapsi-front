export default class NotesView{
    constructor (root,handler)
    {
      this.root = root;

      //get func from top class
      const {onNoteAdd,onNoteEdit,onNoteSelected,onNoteDelete} = handler;
      this.onNoteAdd = onNoteAdd;
      this.onNoteEdit = onNoteEdit;
      this.onNoteSelected = onNoteSelected;
      this.onNoteDelete = onNoteDelete;

      this.root.innerHTML = `<div class="notes__sidebar">
      <div class="note__logo">NOTE APP</div>
      <div class="note__list">
          <div class="note__list-item">
          </div>
      </div>
      <button class="note__add">NOTE ADD</button>
  </div>
  <div class="notes__preview">
      <input type="text" class="notes__title" placeholder="note title ...">
      <textarea name="" class="notes__body">take some note ...</textarea>
  </div>`;

  const addBtn = this.root.querySelector(".note__add");
  const inputTitle = this.root.querySelector(".notes__title");
  const inputBody = this.root.querySelector(".notes__body");

   addBtn.addEventListener("click" , () =>{
    this.onNoteAdd();
   });

   [inputTitle ,inputBody].forEach(inputField =>{
    inputField.addEventListener("blur", () =>{
       const newTitle = inputTitle.value.trim();
       const newBody = inputBody.value.trim();
       this.onNoteEdit(newTitle,newBody);
    })
   });
   
// hide notes in first loade:
this.updateNotePreviewVisiblity(false);
 }

 // private func:
 //***** dataset ha hatman ba - tarif shode va hengham estefade bade
 // "data" ra bedune fasele az ham benevis
 _createListItemHTML(id,title,body,updated){
     const MAX_BODY_LENGTH = 50;
     return ` <div class="note__list-item" data-note-id="${id}" >
     <div class="note__item-header">
     <div class="note__smal-title">${title}</div>
     <span class="note__list-trash" data-note-id="${id}">
     <i class="far fa-trash-alt"></i>
     </span>
     </div>
     <div class="note__smal-body">
     ${body.substring(0,MAX_BODY_LENGTH)}
     ${body.length > MAX_BODY_LENGTH ? "..." : ""}
     </div>
     <div class="note__smal-update">${new Date(updated).toLocaleString("en" ,{
         dateStyle:"full",
         timeStyle:"short",
     })}</div>
      </div>`;
 }

 // append to dom list:
 updateNoteList(notes){
 const notesContainer = this.root.querySelector(".note__list");
 notesContainer.innerHTML= "";
 let noteList = "";
 for (const note of notes) {
    const  {id,title,body,updated} = note;
    const html = this._createListItemHTML(id,title,body,updated);
    noteList += html;
 }
 notesContainer.innerHTML = noteList;
 notesContainer.querySelectorAll(".note__list-item").forEach(item =>{
    item.addEventListener("click" , () =>{
        this.onNoteSelected(item.dataset.noteId);
    });
 });

 // delete note item:
 notesContainer.querySelectorAll(".note__list-trash").forEach(item =>{
     item.addEventListener("click" , (e) => {
         e.stopPropagation();
         this.onNoteDelete (item.dataset.noteId)
     });
 });
 }
//show selected note on page
 updateActiveNote(note){
    this.root.querySelector(".notes__title").value = note.title; 
    this.root.querySelector(".notes__body").value = note.body; 
    
    // add selected class
    /// 1:all last selected class must delete
    this.root.querySelectorAll(".note__list-item").forEach(item =>
     {
        item.classList.remove("note__list-item--selected");
    });
   // then add selected
    this.root.querySelector(`.note__list-item[data-note-id = "${note.id}"]`)
    .classList.add("note__list-item--selected");
 }

 // onload page , dont show notes on page:
 updateNotePreviewVisiblity(visible){
     this.root.querySelector(".notes__preview").style.visibility =visible
      ? "visible" : "hidden";
 }
}