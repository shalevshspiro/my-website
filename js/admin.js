document.addEventListener("DOMContentLoaded", function () {
    const cloudName = "dtuomb64g";
    const unsignedPreset = "unsigned";

    const categorySelect = document.getElementById("category");
    const genreSelect = document.getElementById("genre");

    const genres = {
        articles: ["ספורט", "ביטחון", "פוליטיקה", "אחר"],
        life: ["ילדות", "צבא", "ספורט", "טיולים"]
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

    // העלאת לוגו ל־Cloudinary
    document.getElementById("uploadLogoBtn").addEventListener("click", () => {
        const file = document.getElementById("logoUpload").files[0];
        if (!file) return alert("יש לבחור קובץ קודם");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", unsignedPreset);

        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            console.log("תוצאה מהעלאה:", data);
            if (data.secure_url) {
                document.getElementById("logoImage").value = data.secure_url;
                alert("✅ הלוגו הועלה!");
            }
        })
        .catch(err => alert("❌ שגיאה בהעלאת הלוגו"));
    });

    // העלאת תמונות נוספות ל־Cloudinary
    document.getElementById("uploadImagesBtn").addEventListener("click", () => {
        const files = document.getElementById("imageUpload").files;
        if (!files.length) return alert("יש לבחור קבצים");

        const uploadPromises = [...files].map(file => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", unsignedPreset);

            return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData
            }).then(res => res.json());
        });

        Promise.all(uploadPromises)
            .then(results => {
                const urls = results.map(r => r.secure_url);
                document.getElementById("images").value = urls.join(", ");
                alert("✅ כל התמונות הועלו!");
            })
            .catch(err => alert("❌ שגיאה בהעלאת תמונות"));
    });

    articleForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // שליפת שדות החובה
        const title = document.getElementById("title").value.trim();
        const intro = document.getElementById("intro").value.trim();
        const content = document.getElementById("content").value.trim();
        const category = document.getElementById("category").value;
        const genre = document.getElementById("genre").value;

        // בדיקת חובה
        if (!title || !intro || !content || !category || !genre) {
            alert("❌ חובה למלא את כל שדות התוכן, הכותרת, ההקדמה, הקטגוריה והז'אנר!");
            return;
        }

        let logoImage = document.getElementById("logoImage").value.trim();
        if (!logoImage) logoImage = null;

        const imageLinksRaw = document.getElementById("images").value.trim();
        const imageURLs = imageLinksRaw ? imageLinksRaw.split(",").map(s => s.trim()) : [];

        const newArticle = {
            title,
            intro,
            content,
            category,
            genre,
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
