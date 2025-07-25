import { getFirestore, collection, query, orderBy, limit, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { toHTML } from "https://cdn.jsdelivr.net/npm/@odiffey/discord-markdown@3.3.0/+esm";

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

const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("id");

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
        link.href = `article.html?id=${docSnap.id}`;
    }
}

setLastArticleLink();

async function loadArticle() {
    if (!articleId) {
        document.getElementById("article-content").innerHTML = "<p>Article introuvable</p>";
        return;
    }

    const articleRef = doc(db, "articles", articleId);
    const articleSnap = await getDoc(articleRef);    

    if (articleSnap.exists()) {
        let article = articleSnap.data();

        document.title = `RTL World - ${article.title}`;

        document.getElementById("article-category").textContent = article.category;

        let discordContent = toHTML(article.content);
        let htmlContent = discordContent.replaceAll('</small>', '</small><br>');

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