/*
  Copyright 2025 Imago Veritatis (Timoh de Solarys)

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, Timestamp, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCaexv-0SVEmPeRNYt-WviKBiUhH-Ju7XQ",
    authDomain: "imago-veritatis.firebaseapp.com",
    projectId: "imago-veritatis",
    storageBucket: "imago-veritatis.firebasestorage.app",
    messagingSenderId: "119028191334",
    appId: "1:119028191334:web:44815ae6a51aac8d959da7",
    measurementId: "G-DGMLVJ767X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

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

const form = document.getElementById("articleForm");

onAuthStateChanged(auth, (user) => {
    if (user) {
        
    } else {
        alert("Veuillez vous connecter pour accéder à cette page.");
        window.location.href = "/login";
    }
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

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const category = document.getElementById("category").value;
    const author = document.getElementById("author").value;
    const dateStr = document.getElementById("date").value;

    const [day, month, year] = dateStr.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const realTimestamp = Timestamp.fromDate(dateObj);

    let imageUrl = "";
    let memeUrl = "";

    if (imageUpload.files.length > 0) {
        imageUrl = await uploadToImgBB(imageUpload.files[0]);
    }
    if (memeUpload.files.length > 0) {
        memeUrl = await uploadToImgBB(memeUpload.files[0]);
    }

    try {
        await addDoc(collection(db, "articles"), {
            title: title,
            content: content,
            image: imageUrl,
            category: category,
            author: author,
            meme: memeUrl,
            timestamp: dateStr,
            realTimestamp: realTimestamp
        });

        alert("Article publié !");
        form.reset();
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        alert("Erreur lors de la publication.");
    }
});