export default class Recipe {
  constructor({
    name,
    text,
    ingredients,
    difficulty,
    type,
    photo,
    video = null,
    comments = [],
    likes = 0,
    subscribed = false,
    author
  }) {
    this.name = name
    this.text = text
    this.ingredients = ingredients
    this.difficulty = difficulty
    this.type = type
    this.photo = photo
    this.video = video
    this.comments = comments
    this.likes = likes
    this.subscribed = subscribed
    this.author = author
  }
}
