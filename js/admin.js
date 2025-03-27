// admin.js - כולל תיקון כפתור העלאת תמונות ✅

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

  // ✅ העלאת תמונות נוספות ל-Cloudinary
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
      })
        .then(res => res.json())
        .then(data => {
          console.log("📷 Cloudinary image upload:", data);
          if (data.secure_url) {
            addImagePreview(data.secure_url);
          } else {
            alert("❌ שגיאה בהעלאת תמונה: לא התקבל קישור תקף");
          }
        })
        .catch(err => {
          console.error("❌ שגיאה בהעלאת תמונה", err);
        });
    });

    Promise.all(uploadPromises).then(() => {
      alert("✅ כל התמונות הועלו!");
    });
  });

  // הוספת תמונה לפי קישור URL
  document.getElementById("addImageByUrl").addEventListener("click", () => {
    const url = document.getElementById("imageUrlInput").value.trim();
    if (!url) return alert("⚠️ נא להדביק קישור קודם");
    addImagePreview(url);
  });

  // הצגת תמונה עם שדה תיאור וכפתור הסרה
  function addImagePreview(url) {
    const container = document.getElementById("imagePreviewArea");

    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "20px";
    wrapper.style.position = "relative";
    wrapper.style.padding = "10px";
    wrapper.style.border = "1px solid #ddd";
    wrapper.style.borderRadius = "8px";

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

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "🗑 הסר";
    removeBtn.style.position = "absolute";
    removeBtn.style.top = "8px";
    removeBtn.style.left = "8px";
    removeBtn.style.background = "#eee";
    removeBtn.style.border = "1px solid #ccc";
    removeBtn.style.borderRadius = "6px";
    removeBtn.style.padding = "4px 10px";
    removeBtn.style.cursor = "pointer";
    removeBtn.addEventListener("click", () => wrapper.remove());

    wrapper.appendChild(img);
    wrapper.appendChild(captionInput);
    wrapper.appendChild(removeBtn);
    container.appendChild(wrapper);
  }
});
