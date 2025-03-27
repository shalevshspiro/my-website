document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML = "<h2>❌ כתבה לא נמצאה</h2>";
    return;
  }

  const backgroundStyles = {
    "ספורט": "linear-gradient(to top, #fffbe7, #ffffff)",
    "ביטחון": "linear-gradient(to top, #eef7fc, #ffffff)",
    "פוליטיקה": "linear-gradient(to top, #f2f2f2, #ffffff)",
    "אחר": "#f8faff"
  };

  const defaultBackground = "#f8faff";

  db.collection("articles").doc(id).get().then(doc => {
    if (!doc.exists) {
      document.body.innerHTML = "<h2>❌ כתבה לא קיימת</h2>";
      return;
    }

    const article = doc.data();

    // רקע לפי ז'אנר
    const genre = article.genre || "אחר";
    const bg = backgroundStyles[genre] || defaultBackground;
    document.body.style.transition = "background 0.5s ease";
    document.body.style.background = bg;

    // הצגת שדות
    document.getElementById("title").innerText = article.title || "ללא כותרת";
    document.getElementById("intro").innerText = article.intro || "";

    if (article.logoImage) {
      document.getElementById("logo").src = article.logoImage;
      document.getElementById("logo").alt = "לוגו";
    }

    // כאן מתבצעת ההצגה של תוכן הכתבה בדיוק כמו שהוא נשמר (כולל <p> ו-<br>)
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
