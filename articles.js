import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// Configuration Firebase RTL World
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

let allArticles = [];

async function loadArticles() {
    const articlesRef = collection(db, "articles");
    const querySnapshot = await getDocs(articlesRef);

    const categoryFilter = document.getElementById("category-filter");
    const articlesContainer = document.getElementById("articles-container");

    const categoriesSet = new Set();

    querySnapshot.forEach((doc) => {
        let article = doc.data();
        article.id = doc.id;
        allArticles.push(article);
        if (article.category) categoriesSet.add(article.category);
    });

    // Tri par date
    allArticles.sort((a, b) => {
        let dateA = a.timestamp.split('/').reverse().join('-');
        let dateB = b.timestamp.split('/').reverse().join('-');
        return dateB.localeCompare(dateA);
    });

    // Remplissage du menu de filtre
    categoryFilter.innerHTML = '<option value="all">Toutes les catégories</option>';
    Array.from(categoriesSet).sort().forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    displayArticles(allArticles);

    categoryFilter.addEventListener("change", () => {
        const selected = categoryFilter.value;
        if (selected === "all") {
            displayArticles(allArticles);
        } else {
            const filtered = allArticles.filter(a => a.category === selected);
            displayArticles(filtered);
        }
    });
}

function displayArticles(articles) {
    const container = document.getElementById("articles-container");
    container.innerHTML = "";

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
        container.appendChild(articleElement);
    });
}

window.onload = loadArticles;
