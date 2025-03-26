document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML = "<h2>❌ כתבה לא נמצאה</h2>";
    return;
  }

  db.collection("articles").doc(id).get().then(doc => {
    if (!doc.exists) {
      document.body.innerHTML = "<h2>❌ כתבה לא קיימת</h2>";
      return;
    }

    const article = doc.data();

    document.getElementById("title").innerText = article.title || "ללא כותרת";
    document.getElementById("intro").innerText = article.intro || "";

    if (article.logoImage) {
      const logo = document.getElementById("logo");
      logo.src = article.logoImage;
      logo.alt = "לוגו";
    }

    document.getElementById("content").innerHTML = article.content
      .split("\\n")
      .map(p => `<p>${p}</p>`)
      .join("");

    if (article.images && article.images.length) {
      const gallery = document.getElementById("gallery");
      article.images.forEach(imgUrl => {
        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = "תמונה";
        gallery.appendChild(img);
      });
    }

    document.getElementById("genre").innerText = `ז'אנר: ${article.genre || "לא צויין"}`;
  }).catch(err => {
    console.error("שגיאה בשליפת כתבה:", err);
    document.body.innerHTML = "<h2>⚠️ שגיאה בטעינת הכתבה</h2>";
  });
});
