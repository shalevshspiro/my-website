document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");

  if (!articleId) {
    document.getElementById("article-container").innerHTML = "<p>לא נמצאה כתבה.</p>";
    return;
  }

  db.collection("articles").doc(articleId).get()
    .then(doc => {
      if (!doc.exists) {
        document.getElementById("article-container").innerHTML = "<p>הכתבה לא קיימת.</p>";
        return;
      }

      const article = doc.data();

      document.title = article.title || "כתבה";

      const container = document.getElementById("article-container");
      container.innerHTML = `
        <div class="content-wrapper">
          <header>
            <h1>${article.title}</h1>
          </header>

          ${article.logoImage ? `<img src="${article.logoImage}" class="logo" alt="לוגו">` : ""}
          <p class="intro">${article.intro || ""}</p>

          <div class="article-content">
            ${article.content || ""}
          </div>

          ${article.images && article.images.length > 0 ? `
            <div class="article-images">
              ${article.images.map(img => `
                <div class="article-image">
                  <img src="${img.url}" alt="תמונה">
                  <span>${img.caption || ""}</span>
                </div>
              `).join("")}
            </div>` : ""}

          <a href="articles.html" class="back-link">⬅ חזרה לדף הכתבות</a>
        </div>
      `;
    })
    .catch(error => {
      console.error("שגיאה בטעינת הכתבה:", error);
      document.getElementById("article-container").innerHTML = "<p>אירעה שגיאה בטעינת הכתבה.</p>";
    });
});
