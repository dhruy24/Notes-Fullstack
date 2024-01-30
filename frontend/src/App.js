import React,{useState, useEffect} from 'react';
import styles from './Styles/App.module.css'

function App() {

  // const [title, setTitle] = useState("")
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  
  async function createNote(e){
    e.preventDefault()

    try {
      let response = await fetch("http://localhost:5000/api/notes",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          title,
          content,
        })
      })
      let newNote = await response.json()
      console.log(newNote)
      setTitle("");
      setContent("");
      setNotes([...notes,newNote])
    } catch (error) {
      console.log(error)
    }
    setTitle("");
    setContent("");
  }

  function handleNoteClick(note){
    setSelectedNote(note)
    setTitle(note.title);
    setContent(note.content);
  }

  async function handleUpdateNote(e){
    e.preventDefault()
    if(!selectedNote){
      return
    }

    try{
      let response = await fetch(`http://localhost:5000/api/notes/${selectedNote.id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          title,
          content,
        })
      })
      let updatedNote = await response.json();
      let updatedNoteList = notes.map((ele)=>{
        if(ele.id === selectedNote.id){
          return updatedNote
        }
        else{
          return ele
        }
      })
  
      setNotes(updatedNoteList)
      setTitle("");
      setContent("");
      setSelectedNote(null)
    }catch(error){
      console.log(error)
    }
  }

  function handleCancel(){
    setTitle("");
    setContent("");
    setSelectedNote(null)
  }

  async function handleDelete(e,id){
    e.stopPropagation()
    try{
      await fetch(`http://localhost:5000/api/notes/${id}`,{
        method:"DELETE",
      })
      let updatedNoteList = notes.filter((ele)=>{
        return ele.id !== id
      })
      setNotes(updatedNoteList)
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
   const getData = async()=>{
     try {
      const response = await fetch("http://localhost:5000/api/notes");
      let data = await response.json()
      console.log("dataaa", data);
      setNotes(data)
     } catch (error) {
      console.log(error)
     }
   }
   getData()
  },[])

 

  return (
    <div className="App">
      <div className={styles.container}>
        <form onSubmit={createNote} className={styles.form}>
            <input type='text' placeholder='Title' value={title} onChange={(e)=>setTitle(e.target.value)} required></input><br/>
            <textarea row={10} placeholder='Enter Task' value={content} onChange={(e)=>setContent(e.target.value)} required></textarea><br/>
            {selectedNote?<div><button onClick={handleUpdateNote}>Save</button><button onClick={handleCancel}>Cancel</button></div>:<button type='submit'>Create</button>}
        </form>

        <div className={styles.notelist}>
          {notes.map((ele, index)=>{
            return (
              <div className={styles.noteitem} key={index} onClick={(e)=>{handleNoteClick(ele)}}>
                <div className={styles.noteheader}>
                  <button onClick={(e)=>handleDelete(e,ele.id)}>x</button>
                </div>
                <h2>{ele.title}</h2>
                <p>{ele.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
