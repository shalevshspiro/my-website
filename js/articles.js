document.addEventListener("DOMContentLoaded", async () => {
    const articlesContainer = document.getElementById("articles-container");
    const categoriesContainer = document.getElementById("categories-container");
    const introSection = document.getElementById("intro");
    const latestSection = document.getElementById("latest");

    function renderArticle(article, isLatest = false) {
        const articleElement = document.createElement("div");
        articleElement.classList.add("article");

        // בדיקות על התמונות
        console.log("🟢 מציג כתבה:", article.title);

        const logoImgTag = article.logoImage
            ? `<img src="${article.logoImage}" alt="לוגו" class="logo" onerror="console.warn('❌ שגיאה בטעינת לוגו:', this.src)">`
            : "";

        const imagesGallery = article.images && article.images.length
            ? `
            <div class="image-gallery">
                ${article.images.map(img => `
                    <img src="${img}" alt="תמונה" onerror="console.warn('❌ שגיאה בטעינת תמונה:', this.src)">
                `).join("")}
            </div>
            `
            : "";

        articleElement.innerHTML = `
            <button class="article-toggle">
                <h3>${article.title}</h3>
                ${logoImgTag}
                <p>${article.intro || ""}</p>
                <small>ז'אנר: ${article.genre}</small>
            </button>
            <div class="article-content" style="display: none;">
                <p>${article.content}</p>
                ${imagesGallery}
            </div>
        `;

        const toggleButton = articleElement.querySelector(".article-toggle");
        const contentDiv = articleElement.querySelector(".article-content");
        toggleButton.addEventListener("click", () => {
            contentDiv.style.display = contentDiv.style.display === "none" ? "block" : "none";
        });

        if (isLatest) {
            latestSection.appendChild(articleElement);
        } else {
            articlesContainer.appendChild(articleElement);
        }
    }

    function renderCategoryButtons(categories) {
        categoriesContainer.innerHTML = "";
        categories.forEach(category => {
            const btn = document.createElement("button");
            btn.textContent = category;
            btn.classList.add("category-button");
            btn.addEventListener("click", () => loadArticlesByGenre(category));
            categoriesContainer.appendChild(btn);
        });
    }

    async function loadLatestArticles() {
        const snapshot = await db.collection("articles")
            .orderBy("createdAt", "desc")
            .limit(3)
            .get();

        snapshot.forEach(doc => {
            const article = doc.data();
            renderArticle(article, true);
        });
    }

    async function loadArticlesByGenre(genre) {
        articlesContainer.innerHTML = "";
        console.log("📘 טוען כתבות בז'אנר:", genre);

        const snapshot = await db.collection("articles")
            .where("category", "==", "articles")
            .where("genre", "==", genre)
            .orderBy("createdAt", "desc")
            .get();

        snapshot.forEach(doc => {
            const article = doc.data();
            renderArticle(article);
        });
    }

    // התחלה
    const categories = ["ספורט", "ביטחון", "פוליטיקה", "אחר"];
    renderCategoryButtons(categories);
    await loadLatestArticles();
});
