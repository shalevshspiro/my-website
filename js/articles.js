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
        article.id = doc.id; // שימוש במזהה של המסמך
        allArticles.push(article);

        const genre = article.genre || "אחר";
        if (categories[genre]) {
          categories[genre].push(article);
        } else {
          categories["אחר"].push(article);
        }
      });

      // הצגת 3 כתבות אחרונות
      allArticles.slice(0, 3).forEach(article => {
        const div = buildArticleDiv(article);
        recentArticlesContainer.appendChild(div);
      });

      // כפתורי קטגוריות
      const categoryButtonsContainer = document.createElement("div");
      categoryButtonsContainer.id = "category-buttons";
      categoryButtonsContainer.style.marginTop = "40px";
      articlesContainer.appendChild(categoryButtonsContainer);

      Object.keys(categories).forEach(genre => {
        const btn = document.createElement("button");
        btn.textContent = genre;
        btn.className = "category-toggle";
        btn.addEventListener("click", () => showCategory(genre));
        categoryButtonsContainer.appendChild(btn);
      });
    })
    .catch(error => {
      console.error("❌ שגיאה בטעינת הכתבות:", error);
    });

  function showCategory(genre) {
    const existing = document.querySelectorAll(".category-section");
    existing.forEach(el => el.remove());

    db.collection("articles")
      .where("category", "==", "articles")
      .where("genre", "==", genre)
      .orderBy("createdAt", "desc")
      .get()
      .then(snapshot => {
        const section = document.createElement("section");
        section.classList.add("category-section");
        section.innerHTML = `<h2>${genre}</h2>`;

        snapshot.forEach(doc => {
          const article = doc.data();
          article.id = doc.id;
          const div = buildArticleDiv(article);
          section.appendChild(div);
        });

        articlesContainer.appendChild(section);
      });
  }

  function buildArticleDiv(article) {
    const articleDiv = document.createElement("div");
    articleDiv.classList.add("article");

    const link = document.createElement("a");
    link.href = `article.html?id=${article.id}`;
    link.innerHTML = `
      <h3>${article.title}</h3>
      <p><strong>${article.intro || ""}</strong></p>
      ${article.logoImage ? `<img src="${article.logoImage}" alt="לוגו" class="logo">` : ""}
    `;

    articleDiv.appendChild(link);
    return articleDiv;
  }
});
