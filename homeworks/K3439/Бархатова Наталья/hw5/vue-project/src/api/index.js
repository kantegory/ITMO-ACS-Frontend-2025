import instance from "@/api/instance.js"
import NotesApi from "@/api/notes.js"


const notesApi = new NotesApi(instance)


export {
  notesApi
}
