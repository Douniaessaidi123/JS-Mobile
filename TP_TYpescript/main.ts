// main.ts
import { Book } from "./book";

import { Status, Format } from "./enums";
let books: Book[] = [];

const form = document.getElementById("bookForm") as HTMLFormElement;
const bookList = document.getElementById("bookList")!;
const stats = document.getElementById("stats")!;

form.addEventListener("submit", (e) => {s
  e.preventDefault();

  const title = (document.getElementById("title") as HTMLInputElement).value;
  const author = (document.getElementById("author") as HTMLInputElement).value;
  const pages = Number((document.getElementById("pages") as HTMLInputElement).value);
  const pagesRead = Number((document.getElementById("pagesRead") as HTMLInputElement).value);
  const price = Number((document.getElementById("price") as HTMLInputElement).value);
  const suggestedBy = (document.getElementById("suggestedBy") as HTMLInputElement).value;

  const book = new Book(title, author, pages, Status.CURRENTLY_READING, price, pagesRead, Format.PRINT, suggestedBy);
  books.push(book);
  displayBooks();
});

function displayBooks() {
  bookList.innerHTML = "";
  let totalBooksRead = 0;
  let totalPagesRead = 0;

  books.forEach((b) => {
    const percent = ((b.pagesRead / b.numberOfPages) * 100).toFixed(1);
    totalPagesRead += b.pagesRead;
    if (b.finished) totalBooksRead++;

    const div = document.createElement("div");
    div.className = "border p-3 my-2 rounded shadow-sm";
    div.innerHTML = `
      <strong>${b.title}</strong> de ${b.author} — ${percent}% lu
      <br><em>${b.format}</em> | ${b.price} € | Suggéré par ${b.suggestedBy}
      <br><button class="text-red-500 mt-1" onclick="deleteBook('${b.title}')">🗑 Supprimer</button>
    `;
    bookList.appendChild(div);
  });

  stats.textContent = `Livres terminés : ${totalBooksRead} | Pages lues : ${totalPagesRead}`;
}

(window as any).deleteBook = (title: string) => {
  books = books.filter((b) => b.title !== title);
  displayBooks();
};
