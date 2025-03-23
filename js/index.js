console.log("קובץ index.js נטען בהצלחה!");

document.addEventListener("DOMContentLoaded", () => {
    const welcomeMessage = document.createElement("h1");
    document.body.appendChild(welcomeMessage);

    // טעינת תמונת פרופיל
    const img = document.createElement("img");
    img.src = "../img/prof.webp";
    img.alt = "התמונה שלי";
    img.style.width = "200px";
    img.style.borderRadius = "50%";
    img.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.2)";
    document.getElementById("my-photo").appendChild(img);

    // טקסט "עליי"
    const about = document.getElementById("about-me");
    about.innerHTML = `<p>אני מפתח ווב ואני מתעסק עם בניית אתרים ופיתוח תוכנה. יש לי רקע בלימודי הנדסת תוכנה ואני אוהב ליצור תוכן חדש.</p>`;

    // טקסט עמותת משפאחה
    const mishpacha = document.getElementById("mishpacha");
    mishpacha.innerHTML = `<p class="mishpacha-text">עמותת משפאחה היא עמותה שהקמתי יחד עם חברי הטוב דללין דסטאו ומטרתה היא לעזור לילדים יתומים. אני מזמין אתכם להתרשם ביחד איתנו מהעשייה המבורכת שלנו ולעזור לנו להגשים את המטרות.</p>`;

    // טקסט צור קשר
    const contact = document.getElementById("contact");
    contact.innerHTML = `
        <ul>
            <li><p>האימייל שלי : shalev6005@gmail.com</p></li>
            <li><a href="https://www.linkedin.com/in/shalevshiloshapiro">לינקדין</a></li>
            <li><a href="https://x.com/shalevshapiro">טוויטר</a></li>
        </ul>
    `;
});

function toggleSection(id) {
    const section = document.getElementById(id);
    if (section.style.display === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
} 



