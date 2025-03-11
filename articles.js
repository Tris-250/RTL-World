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
    alert("Le site a quelques bugs connus tels que la date et le markdown, cependant je n'ai pas trop le temps de coder, donc ça attendra. - Timoh de Solarys")
    
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