console.log("קובץ index.js נטען בהצלחה!");

document.addEventListener("DOMContentLoaded", () => {
  // הוספת תמונת פרופיל
  const img = document.createElement("img");
  img.src = "../img/prof.webp";
  img.alt = "התמונה שלי";
  document.getElementById("my-photo").appendChild(img);

  // עליי
  document.getElementById("about-me").innerHTML = `
    <p>אני מפתח ווב ואני מתעסק עם בניית אתרים ופיתוח תוכנה. יש לי רקע בלימודי הנדסת תוכנה ואני אוהב ליצור תוכן חדש.</p>
  `;

  // על עמותת משפאחה
  document.getElementById("mishpacha").innerHTML = `
    <p class="mishpacha-text">עמותת משפאחה היא עמותה שהקמתי יחד עם חברי הטוב דללין דסטאו ומטרתה היא לעזור לילדים יתומים. אני מזמין אתכם להתרשם ביחד איתנו מהעשייה המבורכת שלנו ולעזור לנו להגשים את המטרות.</p>
  `;

  // צור קשר – כולל אייקונים וקישורים
  document.getElementById("contact").innerHTML = `
    <ul class="contact-list">
      <li>
        <img src="img/gmail.png" class="icon" alt="Gmail" />
<a href="https://mail.google.com/mail/?view=cm&fs=1&to=shalev6005@gmail.com&su=פנייה מהאתר&body=שלום שלו," target="_blank">
  שלח לי מייל דרך Gmail
</a>
      </li>
      <li>
        <img src="img/linkedin.png" class="icon" alt="LinkedIn" />
        <a href="https://www.linkedin.com/in/shalevshiloshapiro" target="_blank">
          לינקדין
        </a>
      </li>
      <li>
        <img src="../img/twitter.png" class="icon" alt="Twitter" />
        <a href="https://x.com/shalevshapiro" target="_blank">
          טוויטר
        </a>
      </li>
    </ul>
  `;
});

// כפתורי פתיחה/סגירה
function toggleSection(id, btn) {
  const sections = ["about-me", "mishpacha", "contact"];
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    const button = document.querySelector(`button[onclick*='${sectionId}']`);
    if (sectionId === id) {
      const isHidden = section.style.display === "none";
      section.style.display = isHidden ? "block" : "none";
      btn.textContent = isHidden ? "סגור" : getOriginalText(id);
    } else {
      section.style.display = "none";
      if (button) button.textContent = getOriginalText(sectionId);
    }
  });
}

function getOriginalText(id) {
  switch (id) {
    case "about-me": return "קרא עוד עליי";
    case "mishpacha": return "על עמותת משפאחה";
    case "contact": return "צור קשר";
    default: return "הצג";
  }
}

// הוספת תמונות לצדדים
const leftFloating = ["img/fcbj.webp", "img/z.webp", "img/ko.webp"];
const rightFloating = ["img/b.webp", "img/fi.webp", "img/gilboa.webp"];

const addFloatingImages = (images, side) => {
  const container = document.getElementById(`${side}-images`);
  images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "תמונה";
    container.appendChild(img);
  });
};

addFloatingImages(leftFloating, "left");
addFloatingImages(rightFloating, "right");
