console.log("קובץ index.js נטען בהצלחה!");

document.addEventListener("DOMContentLoaded", () => {
  const img = document.createElement("img");
  img.src = "../img/prof.webp";
  img.alt = "התמונה שלי";
  document.getElementById("my-photo").appendChild(img);

  document.getElementById("about-me").innerHTML = `
    <p>אני מפתח ווב ואני מתעסק עם בניית אתרים ופיתוח תוכנה. יש לי רקע בלימודי הנדסת תוכנה ואני אוהב ליצור תוכן חדש.</p>
  `;

  document.getElementById("mishpacha").innerHTML = `
    <p class="mishpacha-text">עמותת משפאחה היא עמותה שהקמתי יחד עם חברי הטוב דללין דסטאו ומטרתה היא לעזור לילדים יתומים. אני מזמין אתכם להתרשם ביחד איתנו מהעשייה המבורכת שלנו ולעזור לנו להגשים את המטרות.</p>
  `;

  document.getElementById("contact").innerHTML = `
    <ul>
      <li><p>האימייל שלי : shalev6005@gmail.com</p></li>
      <li><a href="https://www.linkedin.com/in/shalevshiloshapiro">לינקדין</a></li>
      <li><a href="https://x.com/shalevshapiro">טוויטר</a></li>
    </ul>
  `;
});

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

// הוספת התמונות לצדדים ברקע האפור
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
