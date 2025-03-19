console.log("ולא תהיה כמו ביתר");

document.addEventListener("DOMContentLoaded", () => {
    const welcomeMessage = document.createElement("h2");
    welcomeMessage.textContent = "פרוגרסיבם קיצוני=נאו קומוניזם";
    document.body.appendChild(welcomeMessage);

	
	
	// טוען את הנתונים מה-JSON
fetch("../Data/articles.json")
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("articles-container");

        data.forEach(article => {
            // יצירת אלמנט כתבה
            const articleDiv = document.createElement("div");

            // כותרת
            const titleElement = document.createElement("h2");
            titleElement.textContent = article.title;

            // כפתור להצגת הכתבה
            const button = document.createElement("button");
            button.textContent = "קרא עוד";
            button.classList.add("read-more-btn");

            // תוכן הכתבה (מוסתר בהתחלה)
            const contentElement = document.createElement("p");
            contentElement.textContent = article.content;
            contentElement.classList.add("article-content");

            // פונקציה להצגת התוכן בלחיצה
            button.addEventListener("click", () => {
                contentElement.style.display = 
                    contentElement.style.display === "none" ? "block" : "none";
            });

            // הוספת האלמנטים לדף
            articleDiv.appendChild(titleElement);
            articleDiv.appendChild(button);
            articleDiv.appendChild(contentElement);
            container.appendChild(articleDiv);
        });
    })
    .catch(error => console.error("שגיאה בטעינת JSON:", error));

	
		});

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

