document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML = "<h2>❌ כתבה לא נמצאה</h2>";
    return;
  }

  db.collection("life").doc(id).get()
    .then(doc => {
      if (!doc.exists) {
        document.body.innerHTML = "<h2>❌ כתבה לא קיימת</h2>";
        return;
      }

      const article = doc.data();
      document.title = article.title || "כתבה אישית";

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
        article.images.forEach(imgObj => {
          const figure = document.createElement("figure");
          figure.classList.add("article-image");

          const img = document.createElement("img");
          img.src = imgObj.url || imgObj;
          img.alt = imgObj.caption || "תמונה";

          const caption = document.createElement("span");
          caption.textContent = imgObj.caption || "";

          figure.appendChild(img);
          figure.appendChild(caption);
          gallery.appendChild(figure);
        });
      }
    })
    .catch(err => {
      console.error("שגיאה בשליפת כתבה:", err);
      document.body.innerHTML = "<h2>⚠️ שגיאה בטעינת הכתבה</h2>";
    });
});
