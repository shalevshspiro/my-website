document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML = "<h2>❌ כתבה לא נמצאה</h2>";
    return;
  }

  const backgroundStyles = {
    "טיולים": "linear-gradient(to top, #e9fefc, #ffffff)",
    "ספורט": "linear-gradient(to top, #fffce2, #ffffff)",
    "צבא": "linear-gradient(to top, #e5f4ff, #ffffff)",
    "ילדות": "linear-gradient(to top, #fff0f7, #ffffff)",
    "אחר": "#fdfaf5"
  };

  const defaultBackground = "#fdfaf5";

  db.collection("life").doc(id).get().then(doc => {
    if (!doc.exists) {
      document.body.innerHTML = "<h2>❌ כתבה לא קיימת</h2>";
      return;
    }

    const article = doc.data();

    const genre = article.genre || "אחר";
    const bg = backgroundStyles[genre] || defaultBackground;
    document.body.style.transition = "background 0.5s ease";
    document.body.style.background = bg;

    document.getElementById("title").innerText = article.title || "ללא כותרת";
    document.getElementById("intro").innerText = article.intro || "";

    if (article.logoImage) {
      const logo = document.getElementById("logo");
      logo.src = article.logoImage;
      logo.alt = "לוגו";
    }

    // הצגת תוכן הכתבה כמו שהוא – עם <p> ו-<br>
    document.getElementById("content").innerHTML = article.content;

    // תמונות עם כיתוב
    if (article.images && article.images.length) {
      const gallery = document.getElementById("gallery");
      article.images.forEach(imgObj => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = imgObj.url || imgObj;
        img.alt = imgObj.caption || "תמונה";

        const caption = document.createElement("figcaption");
        caption.textContent = imgObj.caption || "";

        figure.appendChild(img);
        figure.appendChild(caption);
        gallery.appendChild(figure);
      });
    }

    document.getElementById("genre").innerText = `ז'אנר: ${genre}`;
  }).catch(err => {
    console.error("שגיאה בשליפת כתבה:", err);
    document.body.innerHTML = "<h2>⚠️ שגיאה בטעינת הכתבה</h2>";
  });
});
