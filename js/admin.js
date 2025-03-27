// admin.js - משופר כולל תמיכה בקובצי כתבה

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

  // כפתור טעינת תוכן מקובץ (TXT או DOCX) אל Quill
  const loadFromFileBtn = document.getElementById("loadFromFileBtn");
  if (loadFromFileBtn) {
    loadFromFileBtn.addEventListener("click", () => {
      const fileInput = document.getElementById("articleFileInput");
      const file = fileInput.files[0];
      if (!file) return alert("יש לבחור קובץ קודם");

      const reader = new FileReader();

      if (file.name.endsWith(".txt")) {
        reader.onload = () => {
          quill.root.innerHTML = reader.result
            .split(/\n\n+/)
            .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
            .join('');
        };
        reader.readAsText(file);
      } else if (file.name.endsWith(".docx")) {
        reader.onload = () => {
          mammoth.convertToHtml({ arrayBuffer: reader.result })
            .then(result => {
              quill.root.innerHTML = result.value;
            })
            .catch(err => alert("שגיאה בקריאת קובץ Word"));
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert("פורמט קובץ לא נתמך. נא להעלות קובץ .txt או .docx בלבד.");
      }
    });
  }

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

  // (שאר הקוד – נשאר זהה כמו לפני)
});
