const BASE = 'http://localhost:5000/api/books'; // backend est sur le port 5000

// Récupérer tous les livres
export async function fetchBooks() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Erreur fetch books');
  return res.json();
}

// Créer un nouveau livre
export async function createBook(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Erreur création');
  return res.json();
}

// Mettre à jour un livre complet (PUT) — si tu veux l’utiliser
export async function updateBook(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Erreur update');
  return res.json();
}

// Mettre à jour uniquement le nombre de pages lues (PATCH) — si tu crées cette route
export async function patchPagesRead(id, pagesRead) {
  const res = await fetch(`${BASE}/${id}`, { // actuellement notre backend n'a pas /pagesRead
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pagesRead })
  });
  if (!res.ok) throw new Error('Erreur pagesRead');
  return res.json();
}

// Supprimer un livre
export async function deleteBookAPI(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur delete');
  return res.json();
}
