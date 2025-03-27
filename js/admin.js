// admin.js - עם בדיקות לשליחת כתבה והתראות מדויקות

document.addEventListener("DOMContentLoaded", function () {
  const cloudName = "dtuomb64g";
  const unsignedPreset = "unsigned";
  const db = firebase.firestore();

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
        alert("\u2705 התחברת!");
        showAdminPanel();
      })
      .catch(error => {
        alert("\u274C שגיאה: " + error.message);
      });
  });

  logoutButton.addEventListener("click", function () {
    auth.signOut().then(() => {
      alert("\ud83d\udeaa התנתקת!");
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

  // שליחת כתבה ל־Firebase
  articleForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const intro = document.getElementById("intro").value.trim();
    const contentInput = document.getElementById("content");
    const content = contentInput ? contentInput.value.trim() : "";
    const category = document.getElementById("category").value;
    const genre = document.getElementById("genre").value;

    if (!title || !intro || !content || !category || !genre) {
      alert("\u274C חובה למלא את כל השדות החיוניים!");
      return;
    }

    let logoImage = document.getElementById("logoImage").value.trim();
    if (!logoImage) logoImage = null;

    const captions = document.querySelectorAll(".caption-input");
    const images = [...captions].map(input => ({
      url: input.dataset.url,
      caption: input.value.trim()
    }));

    const newArticle = {
      title,
      intro,
      content,
      category,
      genre,
      images,
      logoImage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    console.log("📤 שולח את הכתבה:", newArticle);

    db.collection("articles").add(newArticle)
      .then(() => {
        alert("✅ כתבה נוספה בהצלחה!");
        articleForm.reset();
        document.getElementById("imagePreviewArea").innerHTML = "";
      })
      .catch(error => {
        console.error("❌ שגיאה בהוספת כתבה:", error);
        alert("❌ שגיאה בהוספת כתבה: " + error.message);
      });
  });
});
