// One-off: copy data/products.json into the Firestore "products" collection.
// Run from the site folder: node scripts/seed-firestore.mjs
// Needs firebase-service-account.json in the site folder (never commit it).
import fs from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const sa = JSON.parse(fs.readFileSync("firebase-service-account.json", "utf8"));
const db = getFirestore(initializeApp({ credential: cert(sa) }));
const list = JSON.parse(fs.readFileSync("data/products.json", "utf8"));
const batch = db.batch();
list.forEach((p, i) => {
  const { id, ...rest } = p;
  batch.set(db.collection("products").doc(id), { ...rest, order: i, updatedAt: Date.now() }, { merge: true });
});
await batch.commit();
console.log("Seeded", list.length, "products into project", sa.project_id);
