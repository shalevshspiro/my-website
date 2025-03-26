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

  const backgroundStyles = {
    "ספורט": "linear-gradient(to top, #fff176, #fefefe)",
    "ביטחון": "linear-gradient(to top, #d3eefe, #f8fdff)",
    "פוליטיקה": "linear-gradient(to top, #e0e0e0, #f9f9f9)",
    "אחר": "#f8faff"
  };

  const defaultBackground = "#f8faff";

  db.collection("articles")
    .where("category", "==", "articles")
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      const allArticles = [];

      snapshot.forEach(doc => {
        const article = doc.data();
        article.id = doc.id;
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
        btn.addEventListener("click", () => showCategory(genre, btn));
        categoryButtonsContainer.appendChild(btn);
      });

      // כפתור סגירה
      const closeBtn = document.createElement("button");
      closeBtn.id = "close-category";
      closeBtn.className = "category-toggle";
      closeBtn.textContent = "סגור";
      closeBtn.addEventListener("click", () => {
        document.body.style.background = defaultBackground;
        document.querySelectorAll(".category-section").forEach(el => el.remove());
        document.querySelectorAll(".category-toggle").forEach(btn => {
          btn.style.backgroundColor = "";
          btn.style.color = "";
        });
        recentArticlesContainer.style.display = "block";
      });
      categoryButtonsContainer.appendChild(closeBtn);
    })
    .catch(error => {
      console.error("❌ שגיאה בטעינת הכתבות:", error);
    });

  function showCategory(genre, clickedButton) {
    document.querySelectorAll(".category-section").forEach(el => el.remove());

    const bg = backgroundStyles[genre] || defaultBackground;
    document.body.style.transition = "background 0.6s ease";
    document.body.style.background = bg;

    document.querySelectorAll(".category-toggle").forEach(btn => {
      btn.style.backgroundColor = "";
      btn.style.color = "";
    });
    clickedButton.style.backgroundColor = "rgba(255,255,255,0.9)";
    clickedButton.style.color = "#000";

    recentArticlesContainer.style.display = "none";

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
      <h2 class="article-title">${article.title}</h2>
      <p class="article-subtitle">${article.intro || ""}</p>
      ${article.logoImage ? `<img src="${article.logoImage}" alt="לוגו" class="logo">` : ""}
    `;

    articleDiv.appendChild(link);
    return articleDiv;
  }
});
