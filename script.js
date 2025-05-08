// Elementy DOM
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startButton = document.getElementById('start-btn');
const continueButton = document.getElementById('continue-btn');
const nextButton = document.getElementById('next-btn');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const questionNumberElement = document.getElementById('question-number');
const scoreElement = document.getElementById('score');
const progressBarElement = document.getElementById('progress-bar');
const finalScoreElement = document.getElementById('final-score');
const resultsDetailsElement = document.getElementById('results-details');
const restartButton = document.getElementById('restart-btn');
const questionsCountSelect = document.getElementById('questions-count');
const questionModeSelect = document.getElementById('question-mode');
const progressStatsElement = document.getElementById('progress-stats');
const reviewCountElement = document.getElementById('review-count');

// Zmienne stanu
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let shuffledQuestions = [];
let questionsToReview = [];
let questionMastery = {}; // Śledzi liczbę poprawnych odpowiedzi na dane pytanie
let lastSessionState = null;
let currentQuizLength = 10; // Domyślnie 10 pytań

// Inicjalizacja danych z localStorage
function initializeLocalStorageData() {
    // Inicjalizacja pytań do powtórki
    if (localStorage.getItem('questionsToReview')) {
        questionsToReview = JSON.parse(localStorage.getItem('questionsToReview'));
    }
    
    // Inicjalizacja danych o opanowaniu pytań
    if (localStorage.getItem('questionMastery')) {
        questionMastery = JSON.parse(localStorage.getItem('questionMastery'));
    }
    
    // Inicjalizacja ostatniego stanu sesji
    if (localStorage.getItem('lastSessionState')) {
        lastSessionState = JSON.parse(localStorage.getItem('lastSessionState'));
        continueButton.disabled = false;
    }
    
    // Aktualizacja statystyk na ekranie startowym
    updateStartScreenStats();
}

// Aktualizacja statystyk na ekranie startowym
function updateStartScreenStats() {
    const completedQuestions = Object.keys(questionMastery).filter(key => questionMastery[key] >= 3).length;
    const totalQuestions = questions.length;
    progressStatsElement.textContent = `${completedQuestions}/${totalQuestions} pytań ukończonych`;
    reviewCountElement.textContent = questionsToReview.length;
}

// Nasłuchiwacze zdarzeń
startButton.addEventListener('click', startNewQuiz);
continueButton.addEventListener('click', continueLastSession);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
restartButton.addEventListener('click', goToStartScreen);

// Funkcja rozpoczynająca nowy quiz
function startNewQuiz() {
    const selectedQuestionsCount = questionsCountSelect.value;
    const selectedMode = questionModeSelect.value;
    
    startScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    
    // Zresetuj zmienne stanu
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    // Przygotuj pytania w zależności od wybranego trybu
    prepareQuestionsForQuiz(selectedQuestionsCount, selectedMode);
    
    // Zapisz stan początkowy sesji
    saveSessionState();
    
    setNextQuestion();
    updateScoreDisplay();
}

// Funkcja kontynuująca ostatnią sesję
function continueLastSession() {
    if (lastSessionState) {
        startScreen.classList.add('hidden');
        resultsScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        
        // Przywróć stan z ostatniej sesji
        currentQuestionIndex = lastSessionState.currentQuestionIndex;
        score = lastSessionState.score;
        userAnswers = lastSessionState.userAnswers;
        shuffledQuestions = lastSessionState.shuffledQuestions;
        
        setNextQuestion();
        updateScoreDisplay();
    }
}

// Funkcja przygotowująca pytania dla quizu
function prepareQuestionsForQuiz(selectedCount, selectedMode) {
    let selectedQuestions = [];
    let availableQuestions = [...questions];
    
    // Filtruj pytania w zależności od wybranego trybu
    switch (selectedMode) {
        case 'review':
            // Tylko pytania do powtórki
            if (questionsToReview.length > 0) {
                availableQuestions = availableQuestions.filter(q => 
                    questionsToReview.includes(questions.indexOf(q))
                );
            } else {
                // Jeśli nie ma pytań do powtórki, użyj wszystkich
                availableQuestions = [...questions];
            }
            break;
            
        case 'mixed':
            // Priorytetyzuj pytania do powtórki, ale dodaj też nowe
            let reviewQuestions = [];
            let otherQuestions = [];
            
            availableQuestions.forEach((q, index) => {
                if (questionsToReview.includes(index)) {
                    reviewQuestions.push(q);
                } else {
                    otherQuestions.push(q);
                }
            });
            
            // Wymieszaj pytania do powtórki
            reviewQuestions = reviewQuestions.sort(() => Math.random() - 0.5);
            
            // Wymieszaj pozostałe pytania
            otherQuestions = otherQuestions.sort(() => Math.random() - 0.5);
            
            // Połącz obie listy, priorytetyzując pytania do powtórki
            availableQuestions = [...reviewQuestions, ...otherQuestions];
            break;
            
        default:
            // Wszystkie pytania, wymieszane
            availableQuestions = availableQuestions.sort(() => Math.random() - 0.5);
            break;
    }
    
    // Ustal liczbę pytań
    let questionCount;
    if (selectedCount === 'all') {
        questionCount = availableQuestions.length;
    } else {
        questionCount = Math.min(parseInt(selectedCount), availableQuestions.length);
    }
    
    currentQuizLength = questionCount;
    
    // Wybierz określoną liczbę pytań
    selectedQuestions = availableQuestions.slice(0, questionCount);
    
    shuffledQuestions = selectedQuestions;
}

// Funkcja zapisująca stan sesji
function saveSessionState() {
    const sessionState = {
        currentQuestionIndex,
        score,
        userAnswers,
        shuffledQuestions
    };
    
    localStorage.setItem('lastSessionState', JSON.stringify(sessionState));
    lastSessionState = sessionState;
}

// Funkcja ustawiająca następne pytanie
function setNextQuestion() {
    resetState();
    
    // Jeśli doszliśmy do końca pytań, pokaż wyniki
    if (currentQuestionIndex >= shuffledQuestions.length) {
        showResults();
        return;
    }
    
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    updateQuestionNumber();
    updateProgressBar();
    
    // Zapisz stan sesji po każdym pytaniu
    saveSessionState();
}

// Funkcja wyświetlająca pytanie i odpowiedzi
function showQuestion(question) {
    questionElement.innerText = question.question;
    
    // Wymieszaj odpowiedzi
    const shuffledAnswers = [...question.answers].sort(() => Math.random() - 0.5);
    
    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

// Funkcja resetująca stan przycisku odpowiedzi
function resetState() {
    nextButton.disabled = true;
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    
    // Usuń informację zwrotną o poprzednim pytaniu, jeśli istnieje
    const questionContainer = document.getElementById('question-container');
    const feedbackElement = questionContainer.querySelector('.feedback');
    if (feedbackElement) {
        questionContainer.removeChild(feedbackElement);
    }
}

// Funkcja obsługująca wybór odpowiedzi
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    
    // Wyłącz możliwość klikania na inne odpowiedzi
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
    });
    
    // Pokaż, które odpowiedzi są poprawne i niepoprawne
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct) {
            button.classList.add('correct');
        }
        if (button === selectedButton && !button.dataset.correct) {
            button.classList.add('wrong');
        }
    });
    
    // Dodaj informację o poprawności odpowiedzi
    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('feedback');
    
    // Pobierz indeks aktualnego pytania w oryginalnej tablicy pytań
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const originalQuestionIndex = questions.findIndex(q => q.question === currentQuestion.question);
    
    if (correct) {
        feedbackElement.innerHTML = "<strong class='correct-text'>Dobrze!</strong> To poprawna odpowiedź.";
        feedbackElement.classList.add('correct-feedback');
        
        // Aktualizuj licznik poprawnych odpowiedzi dla tego pytania
        if (!questionMastery[originalQuestionIndex]) {
            questionMastery[originalQuestionIndex] = 1;
        } else {
            questionMastery[originalQuestionIndex]++;
        }
        
        // Jeśli odpowiedziano poprawnie 3 razy, usuń z listy do powtórki
        if (questionMastery[originalQuestionIndex] >= 3) {
            const indexToRemove = questionsToReview.indexOf(originalQuestionIndex);
            if (indexToRemove !== -1) {
                questionsToReview.splice(indexToRemove, 1);
            }
        }
    } else {
        feedbackElement.innerHTML = "<strong class='wrong-text'>Błąd!</strong> To niepoprawna odpowiedź.";
        feedbackElement.classList.add('wrong-feedback');
        
        // Dodaj pytanie do listy powtórek jeśli jeszcze go tam nie ma
        if (!questionsToReview.includes(originalQuestionIndex)) {
            questionsToReview.push(originalQuestionIndex);
        }
        
        // Zresetuj licznik poprawnych odpowiedzi dla tego pytania
        questionMastery[originalQuestionIndex] = 0;
    }
    
    // Zapisz dane do localStorage
    localStorage.setItem('questionsToReview', JSON.stringify(questionsToReview));
    localStorage.setItem('questionMastery', JSON.stringify(questionMastery));
    
    // Dodaj informację o ilości poprawnych odpowiedzi na to pytanie
    const masteryCount = questionMastery[originalQuestionIndex] || 0;
    feedbackElement.innerHTML += `<p>Poprawne odpowiedzi na to pytanie: ${masteryCount}/3</p>`;
    
    // Dodaj element z informacją zwrotną
    const questionContainer = document.getElementById('question-container');
    // Usuń poprzedni element z informacją zwrotną, jeśli istnieje
    const oldFeedback = questionContainer.querySelector('.feedback');
    if (oldFeedback) {
        questionContainer.removeChild(oldFeedback);
    }
    questionContainer.appendChild(feedbackElement);
    
    // Zapisz odpowiedź użytkownika
    const question = shuffledQuestions[currentQuestionIndex];
    const answerIndex = Array.from(answerButtonsElement.children).indexOf(selectedButton);
    const userAnswer = {
        questionIndex: currentQuestionIndex,
        question: question.question,
        selectedAnswer: question.answers.find(a => a.text === selectedButton.innerText).text,
        correct: Boolean(correct),
        originalQuestionIndex: originalQuestionIndex
    };
    
    // Aktualizuj istniejącą odpowiedź lub dodaj nową
    const existingAnswerIndex = userAnswers.findIndex(a => a.questionIndex === currentQuestionIndex);
    if (existingAnswerIndex !== -1) {
        userAnswers[existingAnswerIndex] = userAnswer;
    } else {
        userAnswers.push(userAnswer);
    }
    
    // Zaktualizuj wynik
    updateScore();
    
    // Włącz przycisk następnego pytania
    nextButton.disabled = false;
    
    // Jeśli to ostatnie pytanie, zmień tekst przycisku
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
        nextButton.innerText = 'Zakończ quiz';
    }
    
    // Zapisz stan sesji po każdej odpowiedzi
    saveSessionState();
}

// Funkcja aktualizująca wynik
function updateScore() {
    // Oblicz wynik na podstawie prawidłowych odpowiedzi
    score = userAnswers.filter(answer => answer.correct).length;
    updateScoreDisplay();
}

// Funkcja aktualizująca wyświetlanie wyniku
function updateScoreDisplay() {
    scoreElement.innerText = `Punkty: ${score}`;
}

// Funkcja aktualizująca numer pytania
function updateQuestionNumber() {
    questionNumberElement.innerText = `Pytanie ${currentQuestionIndex + 1}/${currentQuizLength}`;
}

// Funkcja aktualizująca pasek postępu
function updateProgressBar() {
    const progressPercentage = ((currentQuestionIndex + 1) / currentQuizLength) * 100;
    progressBarElement.style.width = `${progressPercentage}%`;
}

// Funkcja wyświetlająca wyniki
function showResults() {
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    finalScoreElement.innerText = `${score}/${userAnswers.length}`;
    
    // Wyczyść poprzednie wyniki
    resultsDetailsElement.innerHTML = '';
    
    // Dodaj nagłówek szczegółów
    const headerDiv = document.createElement('div');
    headerDiv.innerHTML = '<strong>Szczegóły odpowiedzi:</strong>';
    resultsDetailsElement.appendChild(headerDiv);
    
    // Analizuj odpowiedzi i twórz sekcje
    const correctAnswers = userAnswers.filter(answer => answer.correct);
    const incorrectAnswers = userAnswers.filter(answer => !answer.correct);
    
    // Sekcja podsumowania
    const summaryDiv = document.createElement('div');
    summaryDiv.classList.add('results-summary');
    summaryDiv.innerHTML = `
        <p>Poprawne odpowiedzi: <strong>${correctAnswers.length}</strong></p>
        <p>Niepoprawne odpowiedzi: <strong>${incorrectAnswers.length}</strong></p>
        <p>Pytania dodane do powtórki: <strong>${incorrectAnswers.length}</strong></p>
    `;
    resultsDetailsElement.appendChild(summaryDiv);
    
    // Pokaż tylko pierwsze 10 niepoprawnych odpowiedzi
    if (incorrectAnswers.length > 0) {
        const incorrectHeader = document.createElement('div');
        incorrectHeader.innerHTML = '<h3>Pytania do powtórki:</h3>';
        resultsDetailsElement.appendChild(incorrectHeader);
        
        const displayLimit = Math.min(10, incorrectAnswers.length);
        
        for (let i = 0; i < displayLimit; i++) {
            const answer = incorrectAnswers[i];
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('answer-detail');
            
            // Znajdź poprawną odpowiedź
            const question = shuffledQuestions[answer.questionIndex];
            const correctAnswerText = question.answers.find(a => a.correct).text;
            
            answerDiv.innerHTML = `
                <p><strong>Pytanie ${i + 1}:</strong> ${answer.question}</p>
                <p class="wrong">Twoja odpowiedź: ${answer.selectedAnswer} ✗</p>
                <p class="correct">Poprawna odpowiedź: ${correctAnswerText} ✓</p>
                <hr>
            `;
            
            resultsDetailsElement.appendChild(answerDiv);
        }
        
        if (incorrectAnswers.length > displayLimit) {
            const moreDiv = document.createElement('div');
            moreDiv.innerText = `... i ${incorrectAnswers.length - displayLimit} więcej pytań do powtórki`;
            resultsDetailsElement.appendChild(moreDiv);
        }
    }
    
    // Wyczyść stan ostatniej sesji po zakończeniu quizu
    localStorage.removeItem('lastSessionState');
    lastSessionState = null;
    
    // Zaktualizuj statystyki na ekranie startowym
    updateStartScreenStats();
}

// Funkcja powrotu do ekranu startowego
function goToStartScreen() {
    resultsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    
    // Aktualizuj statystyki na ekranie startowym
    updateStartScreenStats();
    
    // Zresetuj przycisk kontynuacji
    continueButton.disabled = !lastSessionState;
}

// Inicjalizacja danych przy załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    initializeLocalStorageData();
});