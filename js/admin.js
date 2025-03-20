document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const articleForm = document.getElementById("articleForm");
    const adminPanel = document.getElementById("adminPanel");
    const logoutButton = document.getElementById("logout");

    if (!loginForm || !articleForm || !adminPanel || !logoutButton) {
        console.error("❌ שגיאה: אלמנטים לא נמצאו ב-HTML!");
        return;
    }

    // התחברות למערכת
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                alert("✅ התחברת בהצלחה!");
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

    // הוספת כתבה ל-Firestore
    articleForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const newArticle = {
            title: document.getElementById("title").value,
            intro: document.getElementById("intro").value,
            content: document.getElementById("content").value,
            category: document.getElementById("category").value,
            genre: document.getElementById("genre").value,
            images: document.getElementById("images").value ? document.getElementById("images").value.split(",") : [],
            logoImage: document.getElementById("logoImage").value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection("articles").add(newArticle).then(() => {
            alert("✅ כתבה נוספה בהצלחה!");
            articleForm.reset();
        }).catch(error => {
            alert("❌ שגיאה בהוספה: " + error.message);
        });
    });
});
