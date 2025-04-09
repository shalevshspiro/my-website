// admin.js - כולל העלאת לוגו, יצירת כתבה, וחיפוש/עריכה ✅

document.addEventListener("DOMContentLoaded", function () {
  const cloudName = "dtuomb64g";
  const unsignedPreset = "unsigned";

  const categorySelect = document.getElementById("category");
  const genreSelect = document.getElementById("genre");
  const articleIdInput = document.getElementById("articleId");
  const submitBtn = document.getElementById("submitBtn");

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
        console.log("📷 Cloudinary response (logo):", data);
        if (data.secure_url) {
          document.getElementById("logoImage").value = data.secure_url;
          alert("✅ הלוגו הועלה!");
        } else {
          alert("❌ שגיאה בהעלאת לוגו");
        }
      })
      .catch(err => {
        console.error("❌ שגיאה בהעלאת לוגו", err);
      });
  });

  articleForm.addEventListener("submit", function (e) {
    e.preventDefault();
const rawContent = quill.getText().trim();
if (rawContent === "" || rawContent === "\n") {
  console.error("🛑 שגיאה: תוכן הכתבה ריק");
  alert("📝 יש למלא את תוכן הכתבה");
  return;
}

    let raw = quill.root.innerHTML;
    raw = raw
      .replace(/<p><br><\/p>/g, '___PARAGRAPH___')
      .replace(/<\/p><p>/g, '<br>')
      .replace(/^<p>/, '')
      .replace(/<\/p>$/, '')
      .replace(/<\/p>/g, '')
      .replace(/<p>/g, '')
      .replace(/___PARAGRAPH___/g, '</p><p>');
    const finalContent = `<p>${raw}</p>`;

    const title = document.getElementById("title").value.trim();
    const intro = document.getElementById("intro").value.trim();
    const category = categorySelect.value;
    const genre = genreSelect.value;
    const logoImage = document.getElementById("logoImage").value.trim();
    const editingId = articleIdInput.value;

    const captions = document.querySelectorAll(".caption-input");
    const images = [...captions].map(input => ({
      url: input.dataset.url,
      caption: input.value.trim()
    }));

    const articleData = {
      title,
      intro,
      content: finalContent,
      category,
      genre,
      logoImage,
      images,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

if (editingId) {
  const originalCategory = articleIdInput.dataset.originalCategory;

  if (originalCategory !== category) {
    // שינית קטגוריה – מחיקה מהאוסף הישן ושמירה חדש
    db.collection(originalCategory).doc(editingId).delete()
      .then(() => {
        return db.collection(category).add({ 
          ...articleData, 
          createdAt: firebase.firestore.FieldValue.serverTimestamp() 
        });
      })
      .then(() => {
        alert("🔄 הכתבה הועברה ונתונים נשמרו!");
        articleForm.reset();
        document.getElementById("imagePreviewArea").innerHTML = "";
        quill.setText("");
        articleIdInput.value = "";
        submitBtn.textContent = "✅ צור כתבה";
      })
      .catch(error => {
        console.error("❌ שגיאה בהעברה/עדכון:", error);
        alert("❌ שגיאה בהעברה/עדכון: " + error.message);
      });
  } else {
    // לא שינית קטגוריה – עדכון רגיל
    db.collection(category).doc(editingId).update(articleData)
      .then(() => {
        alert("💾 שינויים נשמרו בהצלחה!");
        articleForm.reset();
        quill.setText("");
        document.getElementById("imagePreviewArea").innerHTML = "";
        articleIdInput.value = "";
        submitBtn.textContent = "✅ צור כתבה";
      })
      .catch(error => {
        console.error("❌ שגיאה בעדכון כתבה:", error);
        alert("❌ שגיאה בעדכון כתבה: " + error.message);
      });
  }

    } else {
      db.collection(category).add({ ...articleData, createdAt: firebase.firestore.FieldValue.serverTimestamp() })
        .then(() => {
          alert("✅ כתבה נוספה בהצלחה!");
          articleForm.reset();
          document.getElementById("imagePreviewArea").innerHTML = "";
          quill.setText("");
        })
        .catch(error => {
          console.error("❌ שגיאה בהוספת כתבה:", error);
          alert("❌ שגיאה בהוספת כתבה: " + error.message);
        });
    }
  });

  document.getElementById("searchForm").addEventListener("submit", function (e) {
e.preventDefault();

const searchTitle = document.getElementById("searchTitle").value.trim();
const searchGenre = document.getElementById("searchGenre").value.trim();
const selectedCategory = document.getElementById("category").value;
const articleList = document.getElementById("articleList");
articleList.innerHTML = "";

const collectionsToSearch = selectedCategory ? [selectedCategory] : ["articles", "life"];
const queries = collectionsToSearch.map(col => {
  let q = db.collection(col);
  if (searchTitle) q = q.where("title", "==", searchTitle);
  if (searchGenre) q = q.where("genre", "==", searchGenre);
  return q.get().then(snapshot => ({ col, snapshot }));
});

Promise.all(queries)
  .then(results => {
    let found = false;
    results.forEach(({ col, snapshot }) => {
      if (snapshot.empty) return;

      found = true;
      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.textContent = `📝 [${col}] ${data.title}`;
        li.style.cursor = "pointer";

        li.addEventListener("click", () => {
          document.getElementById("title").value = data.title;
          document.getElementById("intro").value = data.intro || "";
          document.getElementById("logoImage").value = data.logoImage || "";

          categorySelect.value = col;
          updateGenres(col);
          genreSelect.value = data.genre;

          quill.root.innerHTML = data.content;
          articleIdInput.value = doc.id;
          articleIdInput.dataset.originalCategory = col;

          document.getElementById("imagePreviewArea").innerHTML = "";
          if (data.images && data.images.length) {
            data.images.forEach(img => addImagePreview(img.url, img.caption));
          }

          submitBtn.textContent = "💾 שמור שינויים";
        });

        articleList.appendChild(li);
      });
    });

    if (!found) {
      alert("❌ לא נמצאו כתבות תואמות");
    }
  })
  .catch(error => {
    console.error("❌ שגיאה בחיפוש כתבות:", error);
    alert("❌ שגיאה בחיפוש כתבות: " + error.message);
  });
});

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

  document.getElementById("addImageByUrl").addEventListener("click", () => {
    const url = document.getElementById("imageUrlInput").value.trim();
    if (!url) return alert("⚠️ נא להדביק קישור קודם");
    addImagePreview(url);
  });

  function addImagePreview(url, caption = "") {
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
    captionInput.value = caption;
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
