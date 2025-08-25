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

// Sécurise les handlers du menu si les éléments existent
const toggleButton = document.getElementById("dropdownToggle");
const dropdownMenu = document.getElementById("dropdownMenu");
if (toggleButton && dropdownMenu) {
  toggleButton.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
  });
  window.addEventListener("click", () => {
    dropdownMenu.style.display = "none";
  });
  dropdownMenu.addEventListener("click", (e) => e.stopPropagation());
}

// Lien "Dernier article"
async function setLastArticleLink() {
  try {
    const articlesRef = collection(db, "articles");
    const qy = query(articlesRef, orderBy("realTimestamp", "desc"), limit(1));
    const snapshot = await getDocs(qy);
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const link = document.getElementById("lastArticleLink");
      if (link) link.href = `article.html?id=${docSnap.id}`;
    }
  } catch (e) {
    console.error("setLastArticleLink error:", e);
  }
}
setLastArticleLink();

// --- Emojis personnalisés via images GitHub ---
function injectCustomEmoji(html) {
  const map = {
    ":lieu:"  : "https://tris-250.github.io/RTL-World/emojis/lieu.png",
    ":source:": "https://tris-250.github.io/RTL-World/emojis/source.png",
    ":logo:"  : "https://tris-250.github.io/RTL-World/logo.png"
  };
  return html.replace(/:lieu:|:source:|:logo:/g, (m) =>
    `<img class="emoji" src="${map[m]}" alt="${m}" loading="lazy">`
  );
}

async function loadArticle() {
  const container = document.getElementById("article-content");
  const catElt = document.getElementById("article-category");
  if (!container) return;

  if (!articleId) {
    container.innerHTML = "<p>Article introuvable</p>";
    return;
  }

  try {
    const articleRef = doc(db, "articles", articleId);
    const articleSnap = await getDoc(articleRef);

    if (!articleSnap.exists()) {
      container.innerHTML = "<p>Article non trouvé</p>";
      return;
    }

    const article = articleSnap.data();
    document.title = `RTL World - ${article.title || "Article"}`;
    if (catElt) catElt.textContent = article.category || "";

    // Rendu Discord-Markdown -> HTML
    let htmlContent = toHTML(article.content || "");
    // Petits sauts de ligne et EMOJIs custom
    htmlContent = htmlContent.replaceAll("</small>", "</small><br>");
    htmlContent = injectCustomEmoji(htmlContent);

    container.innerHTML = `
      <h1 class="article-title">${article.title || ""}</h1>
      <p class="article-meta">${article.author || "Anonyme"} - ${article.timestamp || ""}</p>
      <div class="article-body">${htmlContent}</div>
    `;

    if (article.image) {
      const img = document.createElement("img");
      img.src = article.image;
      img.alt = "Illustration";
      img.classList.add("article-image");
      document.body.appendChild(img);
    }
  } catch (err) {
    console.error("loadArticle error:", err);
    container.innerHTML = "<p>Erreur de chargement de l'article.</p>";
  }
}

window.onload = loadArticle;