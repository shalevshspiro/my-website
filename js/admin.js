document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase === 'undefined') {
        console.error("❌ Firebase לא נטען, בדוק את הסקריפטים!");
        return;
    }

    console.log("✅ Firebase נטען! מוודא שהכל מחובר...");

    // בדיקה אם auth נטען לפני שמנסים להשתמש בו
    if (!firebase.auth) {
        console.error("❌ Firebase Auth לא נטען כראוי!");
        return;
    }

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
                alert("✅ יאללה ביתר");
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
            console.log("✅ משתמש מחובר: ", user.email);
            showAdminPanel();
        } else {
            console.log("❌ אף משתמש לא מחובר.");
            adminPanel.style.display = "none";
            logoutButton.style.display = "none";
        }
    });

    // ✅ הוספת כתבה - עכשיו בתוך ה-DOMContentLoaded
    articleForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const newArticle = {
            title: document.getElementById("title").value,
            intro: document.getElementById("intro").value,
            content: document.getElementById("content").value,
            category: document.getElementById("category").value,  // ✅ שומר קטגוריה
            genre: document.getElementById("genre").value,
            images: document.getElementById("images").value ? document.getElementById("images").value.split(",") : [],
            logoImage: document.getElementById("logoImage").value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        console.log("📌 מנסה לשלוח את הנתונים הבאים ל-Firebase:", newArticle);

        db.collection("articles").add(newArticle).then(() => {
            console.log("✅ הנתונים נשלחו בהצלחה ל-Firebase!");
            alert("✅ כתבה נוספה בהצלחה!");
            articleForm.reset();
        }).catch(error => {
            console.error("❌ שגיאה בשליחה ל-Firebase:", error);
            alert("❌ שגיאה בהוספת הכתבה: " + error.message);
        });
    });

});
