// admin.js - משופר ומלא

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
        console.log("\ud83d\udcf7 Cloudinary response (logo):", data);
        if (data.secure_url) {
          document.getElementById("logoImage").value = data.secure_url;
          alert("\u2705 הלוגו הועלה!");
        } else {
          alert("\u274C העלאת לוגו נכשלה");
        }
      })
      .catch(err => alert("\u274C שגיאה בהעלאת הלוגו"));
  });

  // העלאת תמונות רגילות ל־Cloudinary עם בדיקות מלאות
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
        let successful = 0;
        results.forEach(result => {
          console.log("\ud83d\udcf7 Cloudinary response (image):", result);
          if (result.error) {
            console.error("\u274C Cloudinary error:", result.error);
            return;
          }
          const url = result.secure_url || result.url;
          if (!url) return;
          addImagePreview(url);
          successful++;
        });
        if (successful > 0) {
          alert(`\u2705 ${successful} תמונות הועלו בהצלחה!`);
        } else {
          alert("\u274C לא הועלתה אף תמונה");
        }
      })
      .catch(err => {
        console.error("\u274C שגיאה כללית בהעלאת תמונות:", err);
        alert("\u274C שגיאה כללית בהעלאת תמונות");
      });
  });

  // הוספת תמונה לפי קישור URL
  document.getElementById("addImageByUrl").addEventListener("click", () => {
    const url = document.getElementById("imageUrlInput").value.trim();
    if (!url) return alert("\u26a0\ufe0f נא להדביק קישור קודם");
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
    removeBtn.textContent = "\ud83d\uddd1 הסר";
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

    db.collection("articles").add(newArticle)
      .then(() => {
        alert("\u2705 כתבה נוספה בהצלחה!");
        articleForm.reset();
        document.getElementById("imagePreviewArea").innerHTML = "";
      })
      .catch(error => {
        console.error("\u274C שגיאה בהוספה:", error);
        alert("\u274C שגיאה בהוספת כתבה: " + error.message);
      });
  });
});
