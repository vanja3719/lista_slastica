import { db } from "../lib/firebase.js";
import {
  collection, doc, getDoc, getDocs, setDoc, deleteDoc, addDoc,
  query, orderBy
} from "firebase/firestore";

// ─── Cakes ───────────────────────────────────────────────

/** Dohvati sve kolače iz Firestore kolekcije `cakes` */
export async function getCakes() {
  const snap = await getDocs(collection(db, "cakes"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Dohvati jedan kolač po ID-u */
export async function getCakeById(id) {
  const ref = doc(db, "cakes", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/** Client-side pretraživanje — filtrira po nazivu ili oznaci */
export function searchCakes(cakes, searchQuery) {
  if (!searchQuery || !searchQuery.trim()) return cakes;
  const q = searchQuery.toLowerCase().trim();
  return cakes.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.tags || []).some(t => t.toLowerCase().includes(q))
  );
}

/** Dodaj novi kolač u Firestore */
export async function addCake(cakeData) {
  // Generate URL-friendly ID from name
  const id = cakeData.name
    .toLowerCase()
    .replace(/č/g, "c").replace(/ć/g, "c").replace(/š/g, "s")
    .replace(/ž/g, "z").replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  const ref = doc(db, "cakes", id);
  await setDoc(ref, { ...cakeData, id });
  return id;
}

// ─── Favorites ───────────────────────────────────────────

/** Dodaj kolač u favorite korisnika */
export async function addFavorite(userId, cakeId) {
  const ref = doc(db, "users", userId, "favorites", cakeId);
  await setDoc(ref, { addedAt: new Date().toISOString() });
}

/** Ukloni kolač iz favorita korisnika */
export async function removeFavorite(userId, cakeId) {
  const ref = doc(db, "users", userId, "favorites", cakeId);
  await deleteDoc(ref);
}

/** Dohvati sve favorite korisnika (vraća array cake ID-ova) */
export async function getFavoriteIds(userId) {
  const snap = await getDocs(collection(db, "users", userId, "favorites"));
  return snap.docs.map(d => d.id);
}

/** Provjeri je li kolač u favoritima */
export async function isFavorite(userId, cakeId) {
  const ref = doc(db, "users", userId, "favorites", cakeId);
  const snap = await getDoc(ref);
  return snap.exists();
}

// ─── Comments ────────────────────────────────────────────

/** Dodaj komentar na kolač */
export async function addComment(cakeId, { userId, userName, text }) {
  const ref = collection(db, "cakes", cakeId, "comments");
  await addDoc(ref, {
    userId,
    userName,
    text,
    createdAt: new Date().toISOString()
  });
}

/** Dohvati sve komentare za kolač */
export async function getComments(cakeId) {
  try {
    const q = query(
      collection(db, "cakes", cakeId, "comments"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    // If index not ready yet, get without ordering
    const snap = await getDocs(collection(db, "cakes", cakeId, "comments"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

// ─── Seed ────────────────────────────────────────────────

/** Zapiši seed podatke kolača u Firestore */
export async function seedCakes(cakesArray) {
  let count = 0;
  for (const cake of cakesArray) {
    const ref = doc(db, "cakes", cake.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { ...cake });
      count++;
    }
  }
  return count;
}
