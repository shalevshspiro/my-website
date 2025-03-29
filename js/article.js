document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");

  if (!articleId) return;

  db.collection("articles").doc(articleId).get()
    .then(doc => {
      if (!doc.exists) return;

      const article = doc.data();

      document.title = article.title || "כתבה";

      if (article.title) document.getElementById("title").textContent = article.title;
      if (article.intro) document.getElementById("intro").textContent = article.intro;
      if (article.logoImage) {
        const logo = document.getElementById("logo");
        logo.src = article.logoImage;
        logo.alt = "לוגו";
      }
      if (article.content) document.getElementById("content").innerHTML = article.content;
      if (article.genre) document.getElementById("genre").textContent = `ז'אנר: ${article.genre}`;

      const gallery = document.getElementById("gallery");
      if (article.images && Array.isArray(article.images)) {
        article.images.forEach(img => {
          const container = document.createElement("div");
          container.className = "article-image";

          const image = document.createElement("img");
          image.src = img.url;
          image.alt = img.caption || "";

          const caption = document.createElement("span");
          caption.textContent = img.caption || "";

          container.appendChild(image);
          container.appendChild(caption);
          gallery.appendChild(container);
        });
      }
    })
    .catch(error => {
      console.error("שגיאה בטעינת הכתבה:", error);
    });
});
