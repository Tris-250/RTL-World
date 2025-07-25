import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, Timestamp, query, orderBy, limit, getDocs, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBw7PSHW4fe2jptxyf7xHtyINSrYG_TupA",
    authDomain: "rtl-world.firebaseapp.com",
    projectId: "rtl-world",
    storageBucket: "rtl-world.firebasestorage.app",
    messagingSenderId: "1092619392407",
    appId: "1:1092619392407:web:f968b6ef5416d66d6360d2",
    measurementId: "G-4GBT38563H"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const form = document.getElementById("articleForm");
const select = document.getElementById("articleSelect");
const loadBtn = document.getElementById("loadBtn");
const createBtn = document.getElementById("createBtn");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const formTitle = document.getElementById("formTitle");

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const dateInput = document.getElementById("date");
const contentInput = document.getElementById("content");
const imageUpload = document.getElementById("imageUpload");
const memeUpload = document.getElementById("memeUpload");
const categoryInput= document.getElementById("category");

let currentDocId = null;

const toggleButton = document.getElementById('dropdownToggle');
const dropdownMenu = document.getElementById('dropdownMenu');

toggleButton.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
});

window.addEventListener('click', () => {
    dropdownMenu.style.display = 'none';
});

dropdownMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

async function ajouterRealTimestamps() {
  const articlesRef = collection(db, "articles");
  const snapshot = await getDocs(articlesRef);


ajouterRealTimestamps();

async function setLastArticleLink() {
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, orderBy('realTimestamp', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const link = document.getElementById('lastArticleLink');
        link.href = `../article.html?id=${docSnap.id}`;
    }
}

setLastArticleLink();

onAuthStateChanged(auth, (user) => {
    if (user) {
        
    } else {
        alert("Veuillez vous connecter pour accéder à cette page.");
        window.location.href = "../login";
    }
});

async function loadArticleList() {
    const snapshot = await getDocs(collection(db, "articles"));
    snapshot.forEach(docSnap => {
        const opt = document.createElement("option");
        opt.value = docSnap.id;
        opt.text  = `${docSnap.data().title} — ${docSnap.id}`;
        select.appendChild(opt);
    });
}

let reloaded = false

window.reloadArticleList = async function() {
    if (reloaded) {
    } else {
        await loadArticleList();
        reloaded = true;
    }
}

loadBtn.addEventListener("click", async () => {
    const id = select.value;
    if (!id) return alert("Veuillez choisir un article.");
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return alert("Article introuvable.");

    const data = docSnap.data();
    titleInput.value = data.title;
    authorInput.value = data.author;
    dateInput.value = data.timestamp;
    contentInput.value = data.content;
    categoryInput.value = data.category;

    createBtn.style.display = "none";
    updateBtn.style.display = "inline-block";
    deleteBtn.style.display = "inline-block";
    formTitle.textContent = "Modifier / Supprimer";

    currentDocId = id;
});

async function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("https://api.imgbb.com/1/upload?key=f5d17031565550135ce61443068b967a", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data.data.url;
    } catch (error) {
        console.error("Erreur d'upload ImgBB :", error);
        return "";
    }
}

form.addEventListener("submit", async e => {
    e.preventDefault();
    if (currentDocId) return;

    await saveArticle();  
});

updateBtn.addEventListener("click", async () => {
    if (!currentDocId) return;
    await saveArticle(currentDocId);
});

deleteBtn.addEventListener("click", async () => {
    if (!currentDocId) return;
    if (!confirm("Confirmer la suppression ?")) return;
    await deleteDoc(doc(db, "articles", currentDocId));
    alert("Article supprimé.");
    window.location.reload();
});

async function saveArticle(docId = null) {
  const [day, month, year] = dateInput.value.split('/').map(Number);
  const realTimestamp = Timestamp.fromDate(new Date(year, month - 1, day));

  let imageUrl = "", memeUrl = "";
  if (imageUpload.files[0]) imageUrl = await uploadToImgBB(imageUpload.files[0]);
  if (memeUpload.files[0])  memeUrl  = await uploadToImgBB(memeUpload.files[0]);

  const data = {
    title: titleInput.value,
    author: authorInput.value,
    timestamp: dateInput.value,
    realTimestamp,
    content: contentInput.value,
    category:categoryInput.value,
    ...(imageUrl && { image: imageUrl }),
    ...(memeUrl  && { meme: memeUrl })
  };

  try {
    if (docId) {
      await updateDoc(doc(db, "articles", docId), data);
      alert("Article modifié !");
    } else {
      await addDoc(collection(db, "articles"), data);
      alert("Article publié !");
    }
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l’opération.");
  }
}
