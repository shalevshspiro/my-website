document.addEventListener("DOMContentLoaded", () => {
    const articlesContainer = document.getElementById("articles-container");

    if (!articlesContainer) {
        console.error("❌ לא נמצא אלמנט להצגת הכתבות!");
        return;
    }

    db.collection("articles")
        .where("category", "==", "articles") // ✅ מציג רק כתבות ששייכות ל-"articles"
        .orderBy("createdAt", "desc")
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const article = doc.data();

                // יצירת אלמנט לכתבה
                const articleDiv = document.createElement("div");
                articleDiv.classList.add("article");

                articleDiv.innerHTML = `
                    <h2>${article.title}</h2>
                    <p><strong>${article.intro}</strong></p>
                    <p>${article.content}</p>
                    <p><small>ז'אנר: ${article.genre}</small></p>
                    ${article.logoImage ? `<img src="${article.logoImage}" alt="תמונת לוגו" style="max-width: 200px;">` : ""}
                    ${article.images ? article.images.map(img => `<img src="${img}" alt="תמונה" style="max-width: 200px;">`).join("") : ""}
                `;

                articlesContainer.appendChild(articleDiv);
            });
        })
        .catch(error => {
            console.error("❌ שגיאה בטעינת הכתבות:", error);
        });
});
