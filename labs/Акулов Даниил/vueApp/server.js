import express from 'express'
import cors from "cors"
const app = express();
const PORT = 8000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','DELETE','OPTIONS'],
}));
app.use(express.json());

let notes = [];          // each note: { id: number, name: string, text: string }
let nextId = 1;

app.get('/notes', (req, res) => {
    res.json(notes);
});

app.post('/notes', (req, res) => {
    const { name, text } = req.body;
    if (typeof name !== 'string' || !name.trim() || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Invalid note name or text' });
    }

    const newNote = { id: nextId++, name: name.trim(), text: text.trim() };
    notes.push(newNote);
    res.status(201).json(newNote);
});

app.get('/notes/:id', (req, res) => {
    const note = notes.find(n => n.id === Number(req.params.id));
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
});

app.delete('/notes/:id', (req, res) => {
    const index = notes.findIndex(n => n.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Note not found' });
    const [deleted] = notes.splice(index, 1);
    res.json(deleted);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
