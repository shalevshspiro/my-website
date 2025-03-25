document.addEventListener("DOMContentLoaded", () => {
    const articlesContainer = document.getElementById("articles-container");
    const recentArticlesContainer = document.getElementById("recent-articles");

    if (!articlesContainer || !recentArticlesContainer) {
        console.error("❌ אלמנט להצגת הכתבות לא נמצא!");
        return;
    }

    const categories = {
        "ספורט": [],
        "ביטחון": [],
        "פוליטיקה": [],
        "אחר": []
    };

    db.collection("articles")
        .where("category", "==", "articles")
        .orderBy("createdAt", "desc")
        .get()
        .then(snapshot => {
            const allArticles = [];

            snapshot.forEach(doc => {
                const article = doc.data();
                allArticles.push(article);

                const genre = article.genre || "אחר";
                if (categories[genre]) {
                    categories[genre].push(article);
                } else {
                    categories["אחר"].push(article);
                }
            });

            // הצגת 3 כתבות אחרונות (במצב סגור, עם הקדמה)
            allArticles.slice(0, 3).forEach(article => {
                const div = buildArticleDiv(article);
                recentArticlesContainer.appendChild(div);
            });

            // הצגת כל כתבה לפי קטגוריה
            Object.entries(categories).forEach(([genre, articles]) => {
                if (articles.length === 0) return;

                const section = document.createElement("section");
                section.innerHTML = `<h2>${genre}</h2>`;

                articles.forEach(article => {
                    const div = buildArticleDiv(article);
                    section.appendChild(div);
                });

                articlesContainer.appendChild(section);
            });
        })
        .catch(error => {
            console.error("❌ שגיאה בטעינת הכתבות:", error);
        });

    function buildArticleDiv(article) {
        const articleDiv = document.createElement("div");
        articleDiv.classList.add("article");

        const contentId = `content-${Math.random().toString(36).substr(2, 9)}`;

        articleDiv.innerHTML = `
            <button onclick="document.getElementById('${contentId}').style.display =
                document.getElementById('${contentId}').style.display === 'none' ? 'block' : 'none'">
                ${article.title}
            </button>
            <p><strong>${article.intro || ""}</strong></p>
            <div id="${contentId}" class="article-content" style="display:none;">
                ${article.logoImage ? `<img src="${article.logoImage}" alt="לוגו" class="logo">` : ""}
                <p>${article.content}</p>
                <p><small>ז'אנר: ${article.genre}</small></p>
                ${article.images && article.images.length ? `
                    <div class="image-gallery">
                        ${article.images.map(img => `<img src="${img}" alt="תמונה">`).join("")}
                    </div>
                ` : ""}
            </div>
        `;

        return articleDiv;
    }
});
