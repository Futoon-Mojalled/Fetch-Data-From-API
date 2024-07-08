//Variable Declarations:
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let quizScore = 0;
let questions = []; //Array to hold the quiz questions fetched from API


//we use immediately invoked function expression (IIFE) and async function to handle the fetching of quiz data from an external API 
//Immediately Invoked Function Expression (IIFE): immediately invoked after definition (without calling)

// Function for fetche quiz data from an API:
async function fetchQuizData() {
    try {
        // Use "fetch" to get data from API.
        const response = await fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple');
        
        // Save the data in JSON form in "data" varible.
        const data = await response.json();
        
        //"questions" the array that we will actuly ues, and it hold the quiz questions fetched from API in.
        //results? "data.results" accesses the results property of the JSON object. results is an array containing the quiz questions and answers.
        //"map" method that create a new array by applying a function "questionData" to each element the original array.
        questions = data.results.map((questionData) => {

            //i think "formattedQuestion" is an object.
            const formattedQuestion = {
                question: questionData.question,
                answers: [...questionData.incorrect_answers.map((answer) => ({ text: answer, correct: false })), { text: questionData.correct_answer, correct: true }]
            };

            return formattedQuestion;
        });

        // Start the quiz after fetching and formatting data
        startQuiz();

    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
}


// Function to initializes the quiz state and starts the quiz by displaying the first question:
function startQuiz() {
    currentQuestionIndex = 0; //Reset
    quizScore = 0; // Reset
    nextButton.innerHTML = "<strong>Next</strong>";
    showQuestion(); // Display the first question
}


// Function to display current question and its answer choices:
function showQuestion() {

    // Reset quiz state (clear answer buttons)
    resetState();
    
    // Get current question object
    let currentQuestion = questions[currentQuestionIndex];
    // Calculate question number
    let questionNo = currentQuestionIndex + 1;
    // Display question text
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    // Creates and appends answer buttons for the question
    currentQuestion.answers.forEach((answer) => {
        // Create button elements for each answer
        const button = document.createElement("button");
        // sets the buttons value
        button.innerHTML = answer.text;
        // Add the buttons to "btn" class for styling
        button.classList.add("btn");
        // append the new button
        answerButtonsElement.appendChild(button);
        // set the correct to true for the corect answer
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }

        // Add click event listener for selecting answer
        button.addEventListener("click", selectAnswer);
    });
}


// Function to reset quiz state (clear answer buttons):
function resetState() {
    nextButton.style.display = "none";
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}


// function for Handles user selection of an answer:
function selectAnswer(e) {
    // Get information of the selected button element
    const selectedBtn = e.target;
    // Check if selected answer is correct
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        // Add "correct" class to style correct answer
        selectedBtn.classList.add("correct"); 
        quizScore++;
    } else {
        // Add "incorrect" class to style incorrect answer
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

// Function for moves to the next question in the quiz, or ends the quiz if all questions have been answered.
function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}


// Displays the final score of the quiz and provides an option to try again.
function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${quizScore} out of ${questions.length}!<br>`;
    nextButton.innerHTML = "<strong>Play Again</strong>";
    nextButton.style.display = "block";
}


// Event Listener to Listens to the clicks on nextButton, to proceed to the next question or restart the quiz. 
nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});


// Initiates the quiz
fetchQuizData();