document.addEventListener("DOMContentLoaded", () => {
    const articlesContainer = document.getElementById("articles-container");
    const recentArticlesContainer = document.getElementById("recent-articles");

    if (!articlesContainer || !recentArticlesContainer) {
        console.error("❌ אלמנט להצגת הכתבות לא נמצא!");
        return;
    }

    const genres = {
        "טיולים": [],
        "ספורט": [],
        "צבא": [],
        "ילדות": []
    };

    db.collection("articles")
        .where("category", "==", "life")
        .orderBy("createdAt", "desc")
        .get()
        .then(snapshot => {
            const allArticles = [];

            snapshot.forEach(doc => {
                const article = doc.data();
                allArticles.push(article);

                const genre = article.genre || "אחר";
                if (genres[genre]) {
                    genres[genre].push(article);
                }
            });

            // הצגת 3 כתבות אחרונות
            allArticles.slice(0, 3).forEach(article => {
                const div = buildArticleDiv(article);
                recentArticlesContainer.appendChild(div);
            });

            // הצגת כפתורים לקטגוריות
            const categoryButtonsContainer = document.createElement("div");
            categoryButtonsContainer.id = "category-buttons";
            categoryButtonsContainer.style.marginTop = "40px";
            articlesContainer.appendChild(categoryButtonsContainer);

            Object.keys(genres).forEach(genre => {
                const btn = document.createElement("button");
                btn.textContent = genre;
                btn.style.margin = "0 10px 20px 0";
                btn.className = "category-toggle";
                btn.addEventListener("click", () => showCategory(genre));
                categoryButtonsContainer.appendChild(btn);
            });
        })
        .catch(error => {
            console.error("❌ שגיאה בטעינת הכתבות:", error);
        });

    function showCategory(genre) {
        // הסתרת כל הקטגוריות שכבר נטענו
        const existing = document.querySelectorAll(".category-section");
        existing.forEach(el => el.remove());

        // טעינה והצגה לפי ז'אנר
        db.collection("articles")
            .where("category", "==", "life")
            .where("genre", "==", genre)
            .orderBy("createdAt", "desc")
            .get()
            .then(snapshot => {
                const section = document.createElement("section");
                section.classList.add("category-section");
                section.innerHTML = `<h2>${genre}</h2>`;

                snapshot.forEach(doc => {
                    const article = doc.data();
                    const div = buildArticleDiv(article);
                    section.appendChild(div);
                });

                articlesContainer.appendChild(section);
            });
    }

    function buildArticleDiv(article) {
        const articleDiv = document.createElement("div");
        articleDiv.classList.add("article");

        const contentId = `content-${Math.random().toString(36).substr(2, 9)}`;

        const formattedContent = article.content
            .split("\\n")
            .map(p => `<p>${p}</p>`)
            .join("");

        articleDiv.innerHTML = `
            <button onclick="document.getElementById('${contentId}').style.display =
                document.getElementById('${contentId}').style.display === 'none' ? 'block' : 'none'">
                ${article.title}
            </button>
            <p><strong>${article.intro || ""}</strong></p>
            <div id="${contentId}" class="article-content" style="display:none;">
                ${article.logoImage ? `<img src="${article.logoImage}" alt="לוגו" class="logo">` : ""}
                ${formattedContent}
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
