import instance from "./instance.js"
import NotesApi from "./notes.js"

const notesApi = new NotesApi(instance)

export {
  notesApi
}