console.log("קובץ index.js נטען בהצלחה!");

document.addEventListener("DOMContentLoaded", () => {
  // הוספת תמונת פרופיל
  const img = document.createElement("img");
  img.src = "../img/prof.webp";
  img.alt = "התמונה שלי";
  document.getElementById("my-photo").appendChild(img);

  // עליי
  document.getElementById("about-me").innerHTML = `
    <p>היי, אני שלו שפירו, בן 24, מהמושב כפר יחזקאל.<br>
אני חייל משוחרר פעמיים – השתחררתי פעם אחת מגבעתי, ואז שוב אחרי 150 ימים של מילואים בעוטף עזה.<br>
אחר כך היה סבב שני בשבי שומרון, ולא מזמן גם סבב שלישי בנחל עוז.<br>
בין לבין הספקתי לטוס לבד לארה"ב, לטייל עם חברים בתאילנד, ולהתחיל ללמוד QA.<br>
אני אוהב לטייל (בעיקר בעמק), לכתוב בשביל עצמי, להתאמן קצת,
ואני אוהב את בית"ר ירושלים. שזה הרבה יותר מספורט, ולפעמים גם קצת עונש.<br>

זה אני. פשוט.<br>
אם בא לכם לקרוא מה אני כותב – אתם לגמרי מוזמנים.
</p>
  `;

  // על עמותת משפאחה
  document.getElementById("mishpacha").innerHTML = `
    <p class="mishpacha-text">עמותת "משפאחה" היא עמותה שהקמנו אני וחברי הטוב, דללין דסטאו, במטרה לעזור לילדים יתומים.<br>
אנחנו פועלים מתוך הבנה עמוקה שאין תחליף להורה – אבל כן אפשר ללוות, לחבק, ולתת כלים אמיתיים להתמודדות.<br>
המטרה שלנו היא לצמצם את הפערים שילדים יתומים חווים מול ילדים אחרים, דרך תמיכה רגשית, חינוכית וחברתית – והכול בהתאמה לצרכים האמיתיים שבשטח.<br>
אם זה נוגע בכם ורוצים לשמוע עוד, לעזור או פשוט לדבר – אנחנו תמיד פתוחים.
</p>
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
        <img src="../img/x.png" class="icon" alt="Twitter" />
        <a href="https://x.com/shalevshapiro" target="_blank">
          טוויטר
        </a>
      </li>
    </ul>
  `;
});

// כפתורי פתיחה/סגירה + גלילה
function toggleSection(id, btn) {
  const sections = ["about-me", "mishpacha", "contact"];
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    const button = document.querySelector(`button[onclick*='${sectionId}']`);
    if (sectionId === id) {
      const isHidden = section.style.display === "none";
      section.style.display = isHidden ? "block" : "none";
      btn.textContent = isHidden ? "הסתר" : getOriginalText(id);

      if (isHidden) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    } else {
      section.style.display = "none";
      if (button) button.textContent = getOriginalText(sectionId);
    }
  });
}

function scrollToButtons() {
  const target = document.getElementById("buttons-section");
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
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
