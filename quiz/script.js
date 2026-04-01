// JavaScript (script.js)

let currentQuestion = 0;
let score = 0;
var userAnswers = [];

var questions = Array.from(document.querySelectorAll('.question')).map(questionElement => {
    var question = questionElement.getAttribute('data-question');
    var answer = parseInt(questionElement.getAttribute('data-answer'), 10);
    var explanation = questionElement.getAttribute('data-explanation');
    var imagesquestion = questionElement.getAttribute('data-imagesquestion');
    var imagesanswer = questionElement.getAttribute('data-imagesanswer');
    var options = Array.from(questionElement.querySelectorAll('.option')).map(optionElement => optionElement.getAttribute('data-option'));

    return {
        question, options, answer, explanation, imagesquestion, imagesanswer
    };
});

// --- TYPEWRITER FUNCTION ---
function typeWriter(element, text, speed = 100, callback) {
    let i = 0;
    element.innerHTML = '';
    let cursor = element.querySelector('.typing-cursor');
    if (!cursor) {
        cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        element.appendChild(cursor);
    }
    function type() {
        if (i < text.length) {
            cursor.insertAdjacentText('beforebegin', text.charAt(i));
            i++;
            setTimeout(type, speed);
        } else {
            if (cursor && cursor.parentNode) {
                // Keep cursor for blinking effect
            }
            if (callback) callback();
        }
    }
    type();
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Kopieret!',
            text: 'Er nu kopieret til udklipsholderen',
            showConfirmButton: false,
            timer: 1500
        });
    }).catch(err => {
        console.error('Fejl ved kopiering:', err);
    });
}

function initializeProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.innerHTML = ''; // Clear existing bullets if any

    questions.forEach(() => {
        const bullet = document.createElement('div');
        bullet.className = 'progress-bullet'; // All bullets start as inactive (grey)
        progressBar.appendChild(bullet);
    });
}

function updateProgressBar() {
    const bullets = document.querySelectorAll('.progress-bullet');
    bullets.forEach((bullet, index) => {
        if (index <= currentQuestion) {
            bullet.classList.add('active');
        } else {
            bullet.classList.remove('active');
        }
    });
}

function showStartCard() {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');

    // Show the title section on start card by removing the quiz-active class
    const postProgressContent = document.getElementById('postProgressContent');
    if (postProgressContent) {
        postProgressContent.classList.remove('quiz-active');
    }

    // Clear previous options
    optionsContainer.innerHTML = '';

    // Create the main question content with typing animation for important words
    questionElement.innerHTML = `<h2>Der er ${questions.length} <span class="highlight-text" data-type-text="spørgsmål" data-type-once data-type-speed="50"></span> i denne <span class="highlight-text" data-type-text="quiz." data-type-once data-type-speed="50"></span>
                                   </h2><br>`;

    // --- Create and insert the info table ---
    const body = document.body;
    const formaal = body.getAttribute('data-formål') || 'Ikke specificeret';
    const forudsUrl = body.getAttribute('data-forudsætning-url');
    const forudsText = body.getAttribute('data-forudsætning-text');
    const forudsaetningRaw = body.getAttribute('data-forudsætning');
    const kapitelUrl = body.getAttribute('data-kapitel-url');
    let forudsaetning;

    let forudsParts = [];
    if (forudsaetningRaw && forudsaetningRaw.trim().length > 0) {
        forudsParts.push(forudsaetningRaw);
    }

    if (forudsUrl && forudsText) {
        const linkHtml = `<a href='${forudsUrl}' class='ref-link' target='_blank' rel='noopener noreferrer'>`
            + `<svg class='link-icon' viewBox='0 0 24 24' fill='none' aria-hidden='true'>`
            + `<path d='M13.828 10.172a4 4 0 0 0-5.656 0l-2.828 2.828a4 4 0 1 0 5.656 5.656l1.414-1.414' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
               <path d='M10.172 13.828a4 4 0 0 0 5.656 0l2.828-2.828a4 4 0 1 0-5.656-5.656L11.586 6.586' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>`
            + `</svg> ${forudsText}</a>`;
        forudsParts.push(linkHtml);
    }

    if (kapitelUrl) {
        const linkLabelOverride = body.getAttribute('data-kapitel-link-text');
        let linkLabel;
        if (linkLabelOverride && linkLabelOverride.trim().length > 0) {
            linkLabel = linkLabelOverride.trim();
        } else {
            const h1 = document.querySelector('#postProgressContent h1');
            let chapterName = '';
            if (h1) {
                chapterName = h1.innerText.replace('Makroøkonomi:', '').trim().replace(/\n/g, ' ');
            }
            linkLabel = chapterName ? `Online-bog Makroøkonomi - ${chapterName}` : 'Online-bog: Læs kapitel her';
        }

        const kapitelLinkHtml = `<a href='${kapitelUrl}' class='ref-link' target='_blank' rel='noopener noreferrer'>`
            + `<svg class='link-icon' viewBox='0 0 24 24' fill='none' aria-hidden='true'>`
            + `<path d='M13.828 10.172a4 4 0 0 0-5.656 0l-2.828 2.828a4 4 0 1 0 5.656 5.656l1.414-1.414' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
               <path d='M10.172 13.828a4 4 0 0 0 5.656 0l2.828-2.828a4 4 0 1 0-5.656-5.656L11.586 6.586' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>`
            + `</svg> ${linkLabel}</a>`;
        forudsParts.push(kapitelLinkHtml);
    }

    forudsaetning = forudsParts.length > 0 ? forudsParts.join('<br>') : 'Ikke specificeret';

    const tidsforbrug = questions.length > 12 ? 'Estimeret til 2 timer' : 'Estimeret til 1 time';

    const tableHTML = `
        <table class="info-table">
            <tbody>
                <tr>
                    <td>Formål</td>
                    <td>${formaal}</td>
                </tr>
                <tr>
                    <td>Anslået tidsforbrug</td>
                    <td>${tidsforbrug}</td>
                </tr>
                <tr>
                    <td>Forudsætning</td>
                    <td>${forudsaetning}</td>
                </tr>
                <tr>
                    <td>Opgave</td>
                    <td>Besvar quizzen, du kan tage quizzen igen og igen</td>
                </tr>
                <tr>
                    <td>Feedback</td>
                    <td>Til hvert spørgsmål kan du se det korrekte svar efterfølgende</td>
                </tr>
            </tbody>
        </table>
    `;
    questionElement.innerHTML += tableHTML;

    // Create bouncing arrow button with text
    const arrowButton = document.createElement('div');
    arrowButton.className = 'start-quiz-arrow';
    arrowButton.innerHTML = `
        <span class="start-quiz-text">START QUIZ <br><br></span>
        <svg class="arrow-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 11L3 13L18 13L15 16L16.5 17.5L22 12L16.5 6.5L15 8L18 11L3 11Z"/>
        </svg>
    `;

    arrowButton.addEventListener('click', function () {
        currentQuestion = 0;
        showQuestion();
    });

    optionsContainer.appendChild(arrowButton);

    // Initialize typing animations
    setTimeout(() => {
        const typeableElements = questionElement.querySelectorAll('[data-type-text][data-type-once]:not([data-typed="true"])');
        typeableElements.forEach((element, index) => {
            element.dataset.typed = "true";
            const text = element.dataset.typeText;
            const speed = parseInt(element.dataset.typeSpeed) || 100;
            const delay = 500 + (index * 800); // Stagger the animations
            setTimeout(() => {
                typeWriter(element, text, speed, () => {
                    // After typing, if this is the last element, remove all but the last cursor
                    if (index === typeableElements.length - 1) {
                        const cursors = questionElement.querySelectorAll('.typing-cursor');
                        cursors.forEach((cursor, i) => {
                            if (i !== cursors.length - 1) cursor.remove();
                        });
                    }
                });
            }, delay);
        });
    }, 300);

    // Attach the event listeners for tooltips
    const infoIcons = document.querySelectorAll('.info-icon');

    infoIcons.forEach(function (icon) {
        const tooltip = icon.querySelector('.tooltip');

        icon.addEventListener('mouseenter', function (e) {
            e.stopPropagation();
            tooltip.style.display = 'block';
            tooltip.style.zIndex = '9999';
        });

        icon.addEventListener('mouseleave', function (e) {
            e.stopPropagation();
            tooltip.style.display = 'none';
        });
    });

    initializeProgressBar();
}

function showQuestion() {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');

    // Hide the title section when quiz starts by adding the quiz-active class
    const postProgressContent = document.getElementById('postProgressContent');
    if (postProgressContent) {
        postProgressContent.classList.add('quiz-active');
    }

    // Clear previous options
    optionsContainer.innerHTML = '';

    let questionText = questions[currentQuestion].question;

    questionElement.innerHTML = `Spørgsmål ${currentQuestion + 1} af ${questions.length}<div class='custom-separator'></div>${questionText}<div class='custom-separator'></div>`;

    for (let i = 0; i < questions[currentQuestion].options.length; i++) {
        const button = document.createElement('button');
        button.innerHTML = questions[currentQuestion].options[i];
        button.classList.add('btn', 'btn-primary', 'd-block', 'my-3');

        button.addEventListener('click', function () {
            checkAnswer(i);
        });
        optionsContainer.appendChild(button);
    }
    updateProgressBar();
    MathJax.typesetPromise().then(() => {
        console.log('MathJax has finished typesetting new question.');
    });
}

function checkAnswer(answer) {
    userAnswers[currentQuestion] = questions[currentQuestion].options[answer];
    let message;

    if (answer === questions[currentQuestion].answer) {
        score++;
        message = `<div class="custom-separator2"></div>Spørgsmålet var: ${questions[currentQuestion].question} <div class="custom-separator2"></div>Du har helt korrekt svaret:<br>${questions[currentQuestion].options[questions[currentQuestion].answer]}. <br><br>${questions[currentQuestion].explanation}<br>`;
    } else {
        message = `Spørgsmålet var: ${questions[currentQuestion].question}
        <div class="custom-separator2"></div>Du skulle have svaret:<br>${questions[currentQuestion].options[questions[currentQuestion].answer]}
        . <br><br>${questions[currentQuestion].explanation}
        <br>`;
    }

    let swalIcon = answer === questions[currentQuestion].answer ? 'success' : 'error';

    Swal.fire({
        icon: swalIcon,
        html: `<div style="font-size: 16px;"><br><div class="custom-separator2"></div><h5> Spørgsmål ${currentQuestion + 1} af ${questions.length}</h5> ${message}</div>`,
        confirmButtonText: 'Videre',
        allowOutsideClick: false,
        showClass: {
            popup: 'swal2-show',
            backdrop: 'swal2-backdrop-show',
            icon: 'swal2-icon-show'
        },
        customClass: {
            container: 'final-results-container',
            popup: 'final-results-popup',
            htmlContainer: 'custom-swal-html-container'
        },
        didOpen: () => {
            // Add small delay to ensure animations trigger properly
            setTimeout(() => {
                const icon = document.querySelector('.swal2-icon');
                if (icon) {
                    // Force animation restart
                    icon.style.animation = 'none';
                    icon.offsetHeight; // Trigger reflow
                    icon.style.animation = null;
                }
            }, 100);
        }
    }).then((result) => {
        if (result.isConfirmed) {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                showQuestion();
            } else {
                var questionsAndAnswers = questions.map((question, index) => {
                    const isCorrect = userAnswers[index] === question.options[question.answer];
                    // Inline style for div and p to force white text
                    const answerBoxStyle = isCorrect
                        ? 'background-color: rgb(52, 199, 89); color: #fff !important; font-weight: 600; font-size: 1.25em; font-family: \'IBM Plex Mono\', \'Roboto\', \'Arial\', sans-serif;'
                        : 'background-color: rgb(255, 59, 48); color: #fff !important; font-weight: 600; font-size: 1.25em; font-family: \'IBM Plex Mono\', \'Roboto\', \'Arial\', sans-serif;';
                    return `
                        <div class="question-summary">
                            <p class="question-text"><font size="+1">Spørgsmål ${index + 1}</font><br><br>${question.question}</p>
                            <div class="custom-separator2"></div>
                            <div class="answer-container">
                                <div class="correct-answer" style="background-color: rgb(52, 199, 89); color: #fff !important; font-weight: 600; font-size: 1.25em; font-family: 'IBM Plex Mono', 'Roboto', 'Arial', sans-serif;">
                                    <p class="answer-heading" style="color: #fff !important; font-weight: 600;">Korrekt svar:</p>
                                    <p style="color: #fff !important; font-weight: 600;">${question.options[question.answer]}</p>
                                </div>
                                <br>
                                <div class="user-answer" style="${answerBoxStyle}">
                                    <p class="answer-heading" style="color: #fff !important; font-weight: 600;">Dit svar:</p>
                                    <p style="color: #fff !important; font-weight: 600;">${userAnswers[index]}</p>
                                </div>
                                <br>
                                <br>
                                <div class="explanation">
                                    ${question.explanation.replace(/<br\s*\/>/gi, '<br>')}
                                </div>
                            </div>
                            <div class="custom-separator"></div>
                        </div>`;
                });

                let title;
                const percentage = score / questions.length;

                if (percentage < 0.25) {
                    title = "<h2>Uha uha, det var ikke så godt</h2>";
                } else if (percentage >= 0.25 && percentage < 0.4) {
                    title = "<h2>Æv altså, prøv igen!</h2>";
                } else if (percentage >= 0.4 && percentage < 0.5) {
                    title = "<h2>Joooeeeee, måske skulle man forsøge en gang mere?</h2>";
                } else if (percentage >= 0.5 && percentage < 0.6) {
                    title = "<h2>Jooooee, kan det mon blive endnu bedre?</h2>";
                } else if (percentage >= 0.6 && percentage < 0.7) {
                    title = "<h2>Det var vel nogenlunde!</h2>";
                } else if (percentage >= 0.7 && percentage < 0.8) {
                    title = "<h2>Det var da meget godt!</h2>";
                } else if (percentage >= 0.8 && percentage < 0.9) {
                    title = "<h2>Meget overbevisende!</h2>";
                } else if (percentage >= 0.9 && percentage < 0.98) {
                    title = "<h2>Fantastisk</h2>";
                } else {
                    title = "<h2>Superduper !!! du er hjernen, det er worldclass !!!</h2>";
                }

                Swal.fire({
                    title: title,
                    html: `
                        <div class="final-results">
                            <p class="score-summary">
                                <font size="+1">Du havde ${score} korrekte svar ud af ${questions.length} spørgsmål.<br>
                                ${(100 * score / questions.length).toFixed(2)} % af dine svar var korrekte.</font>
                            </p>
                            <div class="custom-separator"></div>
                            ${questionsAndAnswers.join('')}
                           
                        </div>
                    `,
                    confirmButtonText: 'Prøv igen',
                    allowOutsideClick: false,
                    customClass: {
                        container: 'final-results-container',
                        popup: 'final-results-popup',
                        content: 'final-results-content'
                    },
                    didOpen: () => {
                        MathJax.typesetPromise().then(() => {
                            console.log('MathJax has finished typesetting answer explanation.');
                        });
                    }

                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            }
        }
    });

    MathJax.typesetPromise().then(() => {
        console.log('MathJax has finished typesetting answer explanation.');
    });
}

// Add event listeners for tooltips and handle preStartContent
document.addEventListener('DOMContentLoaded', function () {
    // Existing tooltip code
    const infoIcons = document.querySelectorAll('.info-icon');

    infoIcons.forEach(function (icon) {
        const tooltip = icon.querySelector('.tooltip');

        icon.addEventListener('mouseenter', function (e) {
            e.stopPropagation();
            tooltip.style.display = 'block';
            tooltip.style.zIndex = '9999';
        });

        icon.addEventListener('mouseleave', function (e) {
            e.stopPropagation();
            tooltip.style.display = 'none';
        });
    });

    // Handle both preStartContent and postProgressContent
    const preStartContent = document.getElementById('preStartContent');
    const postProgressContent = document.getElementById('postProgressContent');

    if (preStartContent || postProgressContent) {
        document.querySelector('.btn.btn-primary').addEventListener('click', function () {
            if (preStartContent) preStartContent.style.display = 'none';
            if (postProgressContent) postProgressContent.style.display = 'none';
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- TYPEWRITER FUNCTION ---
    function typeWriter(element, text, speed = 100, callback) {
        let i = 0;
        element.innerHTML = '';
        let cursor = element.querySelector('.typing-cursor');
        if (!cursor) {
            cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            element.appendChild(cursor);
        }
        function type() {
            if (i < text.length) {
                cursor.insertAdjacentText('beforebegin', text.charAt(i));
                i++;
                setTimeout(type, speed);
            } else {
                if (cursor && cursor.parentNode) {
                    // Keep cursor for blinking effect
                }
                if (callback) callback();
            }
        }
        type();
    }

    // --- INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ---
    const observerCallback = (entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetElement = entry.target;
                const animationDelay = parseInt(targetElement.dataset.animationDelay) || 0;

                setTimeout(() => {
                    targetElement.classList.add('is-visible');

                    // Handle typing text
                    const typeableChildren = targetElement.querySelectorAll('[data-type-text][data-type-once]:not([data-typed="true"])');
                    typeableChildren.forEach((typeableChild, index) => {
                        typeableChild.dataset.typed = "true";
                        const text = typeableChild.dataset.typeText;
                        const speed = parseInt(typeableChild.dataset.typeSpeed) || 100;
                        const typeDelay = 150 + (index * (speed * text.length * 0.2));
                        setTimeout(() => {
                            typeWriter(typeableChild, text, speed);
                        }, typeDelay);
                    });

                }, animationDelay);

                observerInstance.unobserve(targetElement);
            }
        });
    };

    const observerOptions = { threshold: 0.05 };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const scrollIndicator = document.getElementById('scroll-indicator');
    const quizSections = document.getElementById('quiz-sections');

    function showQuizzes() {
        if (quizSections && quizSections.style.display === 'none') {
            quizSections.style.display = 'block';
            if (scrollIndicator) scrollIndicator.style.display = 'none';
        }
    }

    function hideQuizzes() {
        if (quizSections && quizSections.style.display !== 'none') {
            quizSections.style.display = 'none';
            if (scrollIndicator) scrollIndicator.style.display = 'flex';
        }
    }

    // Use the 'wheel' event to detect scroll intent
    window.addEventListener('wheel', (event) => {
        if (event.deltaY > 0) { // On downward scroll
            showQuizzes();
        }
    });

    // Add touch support for mobile devices
    let lastTouchY = 0;
    window.addEventListener('touchstart', (event) => {
        lastTouchY = event.touches[0].clientY;
    });
    window.addEventListener('touchmove', (event) => {
        const touchY = event.touches[0].clientY;
        if (touchY < lastTouchY) { // Swiping up (scrolling down)
            showQuizzes();
        }
    });

    // Use the 'scroll' event to hide content when back at the top
    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            hideQuizzes();
        }
    });
});

if (document.querySelectorAll('.question').length > 0) {
    showStartCard();
}