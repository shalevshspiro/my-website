console.log("קובץ index.js נטען בהצלחה!");

document.addEventListener("DOMContentLoaded", () => {
    // טעינת תמונת פרופיל
    const img = document.createElement("img");
    img.src = "img/processed_0T8A7900-Edit.webp";
    img.alt = "התמונה שלי";
    document.getElementById("my-photo").appendChild(img);

    // טעינת תמונות צד
    const leftImages = [
        "img/processed_20221029_140751.webp",
        "img/processed_317E94CC-3E71-4948-8236-F98B8E927A0C.webp",
        "img/processed_22BAC913-DEA4-45C3-A97B-1028D1350B53.webp"
    ];
    const rightImages = [
        "img/processed_me.webp",
        "img/processed_4F91A34E-3F27-4CE7-8966-252F90A8BE33.webp",
        "img/processed_6203C457-2898-4A1F-AC80-B252E9A671EE.webp"
    ];

    const leftContainer = document.querySelector(".side-images.left");
    const rightContainer = document.querySelector(".side-images.right");

    leftImages.forEach(src => {
        const image = document.createElement("img");
        image.src = src;
        image.alt = "צד שמאל";
        leftContainer.appendChild(image);
    });

    rightImages.forEach(src => {
        const image = document.createElement("img");
        image.src = src;
        image.alt = "צד ימין";
        rightContainer.appendChild(image);
    });

    // טקסט \"עליי\"
    document.getElementById("about-me").innerHTML = `
        <p>אני מפתח ווב ואני מתעסק עם בניית אתרים ופיתוח תוכנה. יש לי רקע בלימודי הנדסת תוכנה ואני אוהב ליצור תוכן חדש.</p>
    `;

    // טקסט עמותת משפאחה
    document.getElementById("mishpacha").innerHTML = `
        <p class="mishpacha-text">עמותת משפאחה היא עמותה שהקמתי יחד עם חברי הטוב דללין דסטאו ומטרתה היא לעזור לילדים יתומים. אני מזמין אתכם להתרשם ביחד איתנו מהעשייה המבורכת שלנו ולעזור לנו להגשים את המטרות.</p>
    `;

    // טקסט צור קשר
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
