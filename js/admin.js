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
      if (data.secure_url) {
        document.getElementById("logoImage").value = data.secure_url;
        alert("✅ הלוגו הועלה!");
      }
    })
    .catch(err => alert("❌ שגיאה בהעלאת הלוגו"));
  });

  // העלאת תמונות ל־Cloudinary + תצוגה עם caption
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
        results.forEach(result => {
          if (result.secure_url) {
            addImagePreview(result.secure_url);
          }
        });
        alert("✅ כל התמונות הועלו והתווספו עם שדות תיאור!");
      })
      .catch(err => alert("❌ שגיאה בהעלאת תמונות"));
  });

  // תצוגת תמונה + שדה תיאור
  function addImagePreview(url) {
    const container = document.getElementById("imagePreviewArea");

    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "20px";

    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "200px";
    img.style.display = "block";
    img.style.marginBottom = "8px";

    const captionInput = document.createElement("input");
    captionInput.type = "text";
    captionInput.placeholder = "כתוב תיאור לתמונה זו";
    captionInput.className = "caption-input";
    captionInput.dataset.url = url;
    captionInput.style.width = "100%";
    captionInput.style.padding = "6px";

    wrapper.appendChild(img);
    wrapper.appendChild(captionInput);
    container.appendChild(wrapper);
  }

  // שליחת כתבה
  articleForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const intro = document.getElementById("intro").value.trim();
    const content = document.getElementById("content").value.trim();
    const category = document.getElementById("category").value;
    const genre = document.getElementById("genre").value;

    if (!title || !intro || !content || !category || !genre) {
      alert("❌ חובה למלא את כל השדות החיוניים!");
      return;
    }

    let logoImage = document.getElementById("logoImage").value.trim();
    if (!logoImage) logoImage = null;

    // איסוף תמונות עם כיתוב
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

    db.collection("articles").add(newArticle)
      .then(() => {
        alert("✅ כתבה נוספה בהצלחה!");
        articleForm.reset();
        document.getElementById("imagePreviewArea").innerHTML = "";
      })
      .catch(error => {
        console.error("❌ שגיאה בהוספה:", error);
        alert("❌ שגיאה בהוספת כתבה: " + error.message);
      });
  });
});
