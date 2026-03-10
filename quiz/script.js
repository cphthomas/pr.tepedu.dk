/**
 * Quiz script for question/option structure
 * Works with: .question (data-question, data-answer, data-explanation), .option (data-option)
 */
document.addEventListener("DOMContentLoaded", function () {
    const questions = Array.from(document.querySelectorAll(".question"));
    const questionEl = document.getElementById("question");
    const optionsEl = document.getElementById("options");
    const progressBarEl = document.getElementById("progress-bar");
    const postProgressContent = document.getElementById("postProgressContent");

    if (!questions.length || !questionEl || !optionsEl) return;

    let currentIndex = 0;
    let score = 0;
    let answered = false;
    let started = false;

    // Initially hide question/options, show start button
    questionEl.style.display = "none";
    optionsEl.style.display = "none";
    if (progressBarEl) progressBarEl.style.display = "none";

    if (postProgressContent) {
        const startBtn = document.createElement("button");
        startBtn.className = "btn btn-primary btn-lg mt-4";
        startBtn.textContent = "Start quiz";
        startBtn.addEventListener("click", function () {
            started = true;
            startBtn.style.display = "none";
            questionEl.style.display = "";
            optionsEl.style.display = "";
            if (progressBarEl) progressBarEl.style.display = "";
            showQuestion();
        });
        postProgressContent.appendChild(startBtn);
    } else {
        started = true;
        questionEl.style.display = "";
        optionsEl.style.display = "";
        if (progressBarEl) progressBarEl.style.display = "";
        showQuestion();
    }

    function renderProgress() {
        if (!progressBarEl) return;
        const pct = questions.length > 0 ? Math.round(((currentIndex) / questions.length) * 100) : 0;
        progressBarEl.innerHTML = `<div class="progress" style="height:8px;"><div class="progress-bar" role="progressbar" style="width:${pct}%"></div></div>`;
    }

    function showQuestion() {
        if (currentIndex >= questions.length) {
            showResults();
            return;
        }

        answered = false;
        const q = questions[currentIndex];
        const opts = Array.from(q.querySelectorAll(".option"));
        const correctIdx = parseInt(q.dataset.answer || "0", 10);

        questionEl.textContent = q.dataset.question || "";
        optionsEl.innerHTML = "";

        opts.forEach((opt, idx) => {
            const div = document.createElement("div");
            div.className = "option mt-2 p-3 border rounded cursor-pointer";
            div.style.cursor = "pointer";
            div.textContent = opt.dataset.option || "";
            div.dataset.index = idx;
            div.addEventListener("click", () => {
                if (answered) return;
                answered = true;
                const isCorrect = idx === correctIdx;
                if (isCorrect) score++;
                const expl = q.dataset.explanation || "";
                if (typeof Swal !== "undefined") {
                    Swal.fire({
                        title: isCorrect ? "Korrekt!" : "Forkert",
                        icon: isCorrect ? "success" : "error",
                        html: expl,
                        confirmButtonText: "Næste"
                    }).then(() => {
                        currentIndex++;
                        renderProgress();
                        showQuestion();
                    });
                } else {
                    currentIndex++;
                    renderProgress();
                    showQuestion();
                }
            });
            optionsEl.appendChild(div);
        });

        renderProgress();
    }

    function showResults() {
        questionEl.style.display = "none";
        optionsEl.style.display = "none";
        if (progressBarEl) progressBarEl.style.display = "none";
        if (postProgressContent) {
            postProgressContent.style.display = "block";
            const scoreHtml = `<p class="mt-3">Du fik ${score} ud af ${questions.length} rigtige.</p>`;
            postProgressContent.insertAdjacentHTML("beforeend", scoreHtml);
        }
    }
});
