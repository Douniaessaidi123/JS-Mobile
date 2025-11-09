import { Book } from './book.js';
import { fetchBooks, createBook } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('book-form');
  const booksList = document.getElementById('books-list');
  const totalBooksEl = document.getElementById('total-books');
  const finishedBooksEl = document.getElementById('finished-books');
  const totalPagesEl = document.getElementById('total-pages');

  // Fonction pour charger les livres depuis le backend
  async function loadBooks() {
    try {
      const books = await fetchBooks();
      booksList.innerHTML = '';

      let totalBooks = books.length;
      let finishedBooks = books.filter(b => b.finished).length;
      let totalPages = books.reduce((sum, b) => sum + b.numberOfPages, 0);

      totalBooksEl.textContent = totalBooks;
      finishedBooksEl.textContent = finishedBooks;
      totalPagesEl.textContent = totalPages;

      books.forEach(book => {
        const div = document.createElement('div');
        div.className = 'bg-gray-100 p-2 rounded';
        div.innerHTML = `
          <strong>${book.title}</strong> par ${book.author} <br>
          ${book.pagesRead}/${book.numberOfPages} pages lues <br>
          Statut: ${book.status} | Format: ${book.format} | Prix: ${book.price}€ | Suggéré par: ${book.suggestedBy}
        `;
        booksList.appendChild(div);
      });
    } catch (err) {
      console.error('Erreur fetch books:', err);
      alert('Impossible de charger les livres.');
    }
  }

  // Ajouter un livre
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      title: formData.get('title'),
      author: formData.get('author'),
      numberOfPages: Number(formData.get('numberOfPages')),
      status: formData.get('status'),
      price: Number(formData.get('price')) || 0,
      pagesRead: Number(formData.get('pagesRead')) || 0,
      format: formData.get('format'),
      suggestedBy: formData.get('suggestedBy')
    };

    console.log('Données envoyées au backend:', data);

    if (!data.title || !data.author || !data.numberOfPages || !data.status || !data.format) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    try {
      await createBook(data);
      form.reset();
      alert(`Livre "${data.title}" ajouté avec succès !`);
      loadBooks(); // rafraîchir la liste
    } catch (err) {
      console.error('Erreur création livre:', err);
      alert(`Erreur lors de l'ajout du livre : ${err.message}`);
    }
  });

  // Effacer le formulaire
  document.getElementById('clear').addEventListener('click', () => form.reset());

  // Charger les livres au démarrage
  loadBooks();
});
