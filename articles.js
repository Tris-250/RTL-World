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

import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

showdown.extension('smallText', function() {
    return [{
        type: 'lang',
        regex: /-# (.*?)(\n|$)/g,
        replace: '<small>$1</small>$2'
    }];
});

let converter = new showdown.Converter({
    simplifiedAutoLink: true,
    strikethrough: true,
    tables: true,
    extensions: ['smallText']
});

async function loadArticles() {    
    const articlesRef = collection(db, "articles");
    const querySnapshot = await getDocs(articlesRef);

    let articlesContainer = document.getElementById("articles-container");
    let articles = [];

    querySnapshot.forEach((doc) => {
        let article = doc.data();
        article.id = doc.id;
        articles.push(article);
    });

    articles.sort((a, b) => {
        let dateA = a.timestamp.split('/').reverse().join('-');
        let dateB = b.timestamp.split('/').reverse().join('-');
        return dateB.localeCompare(dateA);
    });

    articles.forEach((article) => {
        let previewText = article.content.substring(0, 200);
        let previewHTML = converter.makeHtml(previewText);

        let articleElement = document.createElement("div");
        articleElement.classList.add("article-card");
        articleElement.innerHTML = `
            <a href="article.html?id=${article.id}" class="article-link">
                <h2>${article.title}</h2>
                <p>Auteur : ${article.author} - Publié le : ${article.timestamp} - Catégorie : ${article.category}</p>
                <div>${previewHTML}...</div>
                ${article.meme ? `<img src="${article.meme}" alt="Meme" class="article-image">` : ''}
            </a>
        `;
        articlesContainer.appendChild(articleElement);
    });
}

window.onload = loadArticles;