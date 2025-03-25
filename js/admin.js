document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase === 'undefined') {
        console.error("❌ Firebase לא נטען, בדוק את הסקריפטים!");
        return;
    }

    const categorySelect = document.getElementById("category");
    const genreSelect = document.getElementById("genre");

    const genres = {
        articles: ["ספורט", "ביטחון", "פוליטיקה", "אחר"],
        life: ["חוויה אישית", "מסע", "מפעם", "התבגרות"]
    };

    function updateGenres(category) {
        genreSelect.innerHTML = "";
        genres[category].forEach(genre => {
            const option = document.createElement("option");
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });
    }

    updateGenres(categorySelect.value);
    categorySelect.addEventListener("change", () => updateGenres(categorySelect.value));

    const loginForm = document.getElementById("loginForm");
    const articleForm = document.getElementById("articleForm");
    const adminPanel = document.getElementById("adminPanel");
    const logoutButton = document.getElementById("logout");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                alert("✅ התחברת!");
                showAdminPanel();
            })
            .catch(error => {
                alert("❌ שגיאה: " + error.message);
            });
    });

    logoutButton.addEventListener("click", function () {
        auth.signOut().then(() => {
            alert("🚪 התנתקת!");
            location.reload();
        });
    });

    function showAdminPanel() {
        loginForm.style.display = "none";
        adminPanel.style.display = "block";
        logoutButton.style.display = "block";
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            showAdminPanel();
        } else {
            adminPanel.style.display = "none";
            logoutButton.style.display = "none";
        }
    });

    articleForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const logoImage = document.getElementById("logoImage").value.trim();
        const imageLinksRaw = document.getElementById("images").value.trim();
        const imageURLs = imageLinksRaw ? imageLinksRaw.split(",").map(s => s.trim()) : [];

        if (!logoImage) {
            alert("❌ יש להזין קישור לתמונת לוגו מגוגל דרייב!");
            return;
        }

        const newArticle = {
            title: document.getElementById("title").value,
            intro: document.getElementById("intro").value,
            content: document.getElementById("content").value,
            category: document.getElementById("category").value,
            genre: document.getElementById("genre").value,
            images: imageURLs,
            logoImage: logoImage,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection("articles").add(newArticle)
            .then(() => {
                alert("✅ כתבה נוספה בהצלחה!");
                articleForm.reset();
            })
            .catch(error => {
                console.error("❌ שגיאה בהוספה:", error);
                alert("❌ שגיאה בהוספת כתבה: " + error.message);
            });
    });
});
