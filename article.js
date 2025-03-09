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

// Récupérer l'ID de l'article depuis l'URL
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

        // Mise à jour du titre de la page
        document.title = `Imago Veritatis - ${article.title}`;

        // Affichage de la catégorie dans le bandeau
        document.getElementById("article-category").textContent = article.category;

        let converter = new showdown.Converter({
            simplifiedAutoLink: true,
            strikethrough: true,
            tables: true,
            extensions: ['smallText']
        });

        // Convertir le contenu en HTML
        let htmlContent = converter.makeHtml(article.content);

        document.getElementById("article-content").innerHTML = `
            <h1 class="article-title">${article.title}</h1>
            <p class="article-meta">${article.author} - ${article.timestamp}</p>
            <div class="article-body">${htmlContent}</div>
        `;

        // Ajouter l'image en dehors de "article-content"
        if (article.image) {
            let img = document.createElement("img");
            img.src = article.image;
            img.alt = "Planche";
            img.classList.add("article-image");

            // Insérer l'image après l'article
            document.body.appendChild(img);
        }
    } else {
        document.getElementById("article-content").innerHTML = "<p>Article non trouvé</p>";
    }
}

// Charger l'article au chargement de la page
window.onload = loadArticle;