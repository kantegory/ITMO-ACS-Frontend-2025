export default class Recipe {
  constructor({
    id,
    authorId,
    name,
    text,
    ingredients,
    difficulty,
    type,
    photo,
    video = null,
    comments = [],
    likes = 0,
    author
  }) {
    this.id = id,
    this.authorId = authorId
    this.name = name
    this.text = text
    this.ingredients = ingredients
    this.difficulty = difficulty
    this.type = type
    this.photo = photo
    this.video = video
    this.comments = comments
    this.likes = likes
    this.author = author
  }
}
