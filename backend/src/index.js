const express = require("express");
const cors = require("cors");
const {PrismaClient} = require("@prisma/client");

const app = express();
const prisma = new PrismaClient(); 

app.use(express.json())
app.use(cors())

app.get("/api/notes", async (req, res)=>{
    //".note is the model. FindMany() for getting all the data"
    const notes = await prisma.note.findMany()
    res.json(notes)
});

app.post("/api/notes", async(req, res)=>{
    const {title, content} = req.body;

    if(!title || !content){
       return res.status(400).send("title and content feild required");
    }

    try {
        const note = await prisma.note.create({
            data : { title, content}
        })
        res.json(note);
    } catch (error) {
        res.status(500).send("Oops something went wrong")
    }
})

app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).send("Unable to edit! Title or Content missing");
  }

  if(!title || !content){
    return res.status(400).send("title and content feild required");
 }

  try {
    const updateNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updateNote);
  } catch (error) {
    res.status(500).send("Oops! Something went wrong");
  }
});


app.delete("/api/notes/:id", async (req, res)=>{

    let id = parseInt(req.params.id)

    if(!id || isNaN(id)){
        return res.status(400).send("Invalid Id")
    }

    try {
        await prisma.note.delete({
            where : {id}
        })
        res.status(204).send()
    } catch (error) {
        res.status(500).send("Oops! Something went wrong");
    }
})


app.listen(5000, ()=>{
    console.log("server running on port 5000")
})
