document.addEventListener("DOMContentLoaded", () => {
  const articlesContainer = document.getElementById("articles-container");
  const recentArticlesContainer = document.getElementById("recent-articles");
  const recentArticlesSection = document.getElementById("recent-articles-section");

  if (!articlesContainer || !recentArticlesContainer || !recentArticlesSection) {
    console.error("❌ אלמנט להצגת הכתבות לא נמצא!");
    return;
  }

  const genres = {
    "טיולים": [],
    "ספורט": [],
    "צבא": [],
    "ילדות": []
  };

  const defaultBackground = "#f5f5f5";
  let closeBtn;

  db.collection("life")
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      const allArticles = [];

      snapshot.forEach(doc => {
        const article = doc.data();
        article.id = doc.id;
        allArticles.push(article);

        const genre = article.genre || "אחר";
        if (genres[genre]) {
          genres[genre].push(article);
        }
      });

      allArticles.slice(0, 3).forEach(article => {
        const div = buildArticleDiv(article);
        recentArticlesContainer.appendChild(div);
      });

      const categoryButtonsContainer = document.createElement("div");
      categoryButtonsContainer.id = "category-buttons";
      categoryButtonsContainer.style.marginTop = "40px";
      articlesContainer.appendChild(categoryButtonsContainer);

      Object.keys(genres).forEach(genre => {
        const btn = document.createElement("button");
        btn.textContent = genre;
        btn.className = "category-toggle";
        btn.addEventListener("click", () => showCategory(genre, btn));
        categoryButtonsContainer.appendChild(btn);
      });

      closeBtn = document.createElement("button");
      closeBtn.id = "close-category";
      closeBtn.className = "category-toggle";
      closeBtn.textContent = "סגור";
      closeBtn.style.display = "none";
      closeBtn.addEventListener("click", () => {
        document.body.style.background = defaultBackground;
        document.querySelectorAll(".category-section").forEach(el => el.remove());
        document.querySelectorAll(".category-toggle").forEach(btn => {
          btn.style.backgroundColor = "";
          btn.style.color = "";
        });
        recentArticlesSection.style.display = "block";
        closeBtn.style.display = "none";
      });
      categoryButtonsContainer.appendChild(closeBtn);
    })
    .catch(error => {
      console.error("❌ שגיאה בטעינת הכתבות:", error);
    });

  function showCategory(genre, clickedButton) {
    document.querySelectorAll(".category-section").forEach(el => el.remove());

    document.body.style.transition = "background 0.6s ease";
    document.body.style.background = defaultBackground;

    document.querySelectorAll(".category-toggle").forEach(btn => {
      btn.style.backgroundColor = "";
      btn.style.color = "";
    });
    clickedButton.style.backgroundColor = "rgba(255,255,255,0.9)";
    clickedButton.style.color = "#000";

    recentArticlesSection.style.display = "none";
    if (closeBtn) closeBtn.style.display = "inline-block";

    db.collection("life")
      .where("genre", "==", genre)
      .orderBy("createdAt", "desc")
      .get()
      .then(snapshot => {
        const section = document.createElement("section");
        section.classList.add("category-section");
        section.id = `genre-${genre}`;
        section.innerHTML = `<h2>${genre}</h2>`;

        snapshot.forEach(doc => {
          const article = doc.data();
          article.id = doc.id;
          const div = buildArticleDiv(article);
          section.appendChild(div);
        });

        articlesContainer.appendChild(section);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        });
      });
  }

  function buildArticleDiv(article) {
    const articleDiv = document.createElement("div");
    articleDiv.classList.add("article");

    const link = document.createElement("a");
    link.href = `lifeart.html?id=${article.id}`;
    link.target = "_blank";

    const tag = `<span class="category-tag" data-genre="${article.genre}">${article.genre}</span>`;
    const title = `<h2 class="article-title">${article.title}</h2>`;
    const subtitle = `<p class="article-subtitle">${article.intro || ""}</p>`;
    const logo = article.logoImage ? `<img src="${article.logoImage}" alt="לוגו" class="logo">` : "";

    link.innerHTML = `${tag}${title}${subtitle}${logo}`;

    articleDiv.appendChild(link);
    return articleDiv;
  }
});
