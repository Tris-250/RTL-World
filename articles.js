import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

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