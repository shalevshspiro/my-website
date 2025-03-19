console.log("אין גדולה כמו ביתר" );

document.addEventListener("DOMContentLoaded", () => {
    const welcomeMessage = document.createElement("h2");
    welcomeMessage.textContent = "תודה על מה שיש ";
    document.body.appendChild(welcomeMessage);
});