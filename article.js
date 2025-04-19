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

import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

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

const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("id");

showdown.extension('smallText', function() {
    return [{
        type: 'lang',
        regex: /-# (.*?)(\n|$)/g,
        replace: '<small>$1</small>$2<br>$2'
    }];
});

async function loadArticle() {
    if (!articleId) {
        document.getElementById("article-content").innerHTML = "<p>Article introuvable</p>";
        return;
    }

    const articleRef = doc(db, "articles", articleId);
    const articleSnap = await getDoc(articleRef);    

    if (articleSnap.exists()) {
        let article = articleSnap.data();

        document.title = `Imago Veritatis - ${article.title}`;

        document.getElementById("article-category").textContent = article.category;

        let converter = new showdown.Converter({
            simplifiedAutoLink: true,
            strikethrough: true,
            tables: true,
            extensions: ['smallText']
        });

        let htmlContent = converter.makeHtml(article.content);

        document.getElementById("article-content").innerHTML = `
            <h1 class="article-title">${article.title}</h1>
            <p class="article-meta">${article.author} - ${article.timestamp}</p>
            <div class="article-body">${htmlContent}</div>
        `;

        if (article.image) {
            let img = document.createElement("img");
            img.src = article.image;
            img.alt = "Planche";
            img.classList.add("article-image");

            document.body.appendChild(img);
        }
    } else {
        document.getElementById("article-content").innerHTML = "<p>Article non trouvé</p>";
    }
}

window.onload = loadArticle;