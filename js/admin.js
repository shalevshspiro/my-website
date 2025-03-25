document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase === 'undefined') {
        console.error("❌ Firebase לא נטען, בדוק את הסקריפטים!");
        return;
    }

    console.log("✅ Firebase נטען! מוודא שהכל מחובר...");

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

    if (!loginForm || !articleForm || !adminPanel || !logoutButton) {
        console.error("❌ שגיאה: אלמנטים לא נמצאו ב-HTML!");
        return;
    }

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

    articleForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const logoFile = document.getElementById("logoImage").files[0];
        const imageFiles = document.getElementById("images").files;
        const storageRef = firebase.storage().ref();

        if (!logoFile) {
            alert("❌ יש לבחור תמונת לוגו!");
            return;
        }

        const logoRef = storageRef.child("logos/" + logoFile.name);
        logoRef.put(logoFile).then(snapshot => snapshot.ref.getDownloadURL())
        .then(logoURL => {
            const imageUploadPromises = [];
            for (let i = 0; i < imageFiles.length; i++) {
                const imgRef = storageRef.child("images/" + imageFiles[i].name);
                imageUploadPromises.push(imgRef.put(imageFiles[i]).then(snap => snap.ref.getDownloadURL()));
            }

            return Promise.all(imageUploadPromises).then(imageURLs => {
                const newArticle = {
                    title: document.getElementById("title").value,
                    intro: document.getElementById("intro").value,
                    content: document.getElementById("content").value,
                    category: categorySelect.value,
                    genre: genreSelect.value,
                    images: imageURLs,
                    logoImage: logoURL,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                return db.collection("articles").add(newArticle).then(() => {
                    alert("✅ כתבה נוספה בהצלחה!");
                    articleForm.reset();
                });
            });
        }).catch(error => {
            console.error("❌ שגיאה בהעלאה:", error);
            alert("❌ שגיאה בהעלאת כתבה: " + error.message);
        });

        return;
    });
});
