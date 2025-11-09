// Book class module
export class Book {
  constructor({
    _id = null,
    title,
    author,
    numberOfPages,
    status,
    price = 0,
    pagesRead = 0,
    format,
    suggestedBy = '',
    finished = false
  }) {
    this._id = _id; // ID MongoDB
    this.title = title;
    this.author = author;
    this.numberOfPages = Number(numberOfPages) || 0;
    this.status = status;
    this.price = Number(price) || 0;
    this.pagesRead = Number(pagesRead) || 0;
    this.format = format;
    this.suggestedBy = suggestedBy;
    // finished est automatiquement true si pagesRead >= numberOfPages
    this.finished = Boolean(finished) || (this.pagesRead >= this.numberOfPages);
  }

  // Retourne le pourcentage lu (0..100)
  currentlyAt() {
    if (!this.numberOfPages) return 0;
    return Math.min(100, Math.round((this.pagesRead / this.numberOfPages) * 100));
  }

  // Supprime localement l'objet (frontend) — suppression permanente via API
  deleteBook() {
    return { deleted: true, id: this._id };
  }
}
