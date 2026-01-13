// import instance from './instance'
// import NotesApi from './notes'

import instance from "@/api/instance"
import NotesApi from "@/api/notes"

const notesApi = new NotesApi(instance)

export {
  notesApi
}