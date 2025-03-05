// DOM Elements
let questionElement;
let optionsElement;
let feedbackElement;
let prevBtn;
let nextBtn;
let timerElement;
let currentQuestionSpan;
let totalQuestionsSpan;

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;
let currentQuestions = [];
let usedQuestionIndices = new Set(); // Track used questions

const allQuestions = [
  {
    question: "What is phishing?",
    options: [
      "A type of fishing sport",
      "A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity",
      "A computer virus",
      "A type of encryption",
    ],
    correct: 1,
    explanation:
      "Phishing is a cybercrime where attackers pose as legitimate institutions to trick people into revealing sensitive information like passwords and credit card details.",
  },
  {
    question: "What is the best practice for creating strong passwords?",
    options: [
      "Use the same password for all accounts",
      "Use short, simple passwords that are easy to remember",
      "Use long passwords with a mix of letters, numbers, and special characters",
      "Use your birthday as a password",
    ],
    correct: 2,
    explanation:
      "Strong passwords should be long and complex, including a mixture of uppercase and lowercase letters, numbers, and special characters to make them harder to crack.",
  },
  {
    question: "What is two-factor authentication (2FA)?",
    options: [
      "Using two different passwords",
      "A security process requiring two different forms of identification",
      "Logging in from two different devices",
      "Having two email addresses",
    ],
    correct: 1,
    explanation:
      "2FA adds an extra layer of security by requiring two different forms of verification, typically something you know (password) and something you have (like a phone).",
  },
  {
    question: "What is a DDoS attack?",
    options: [
      "A type of antivirus software",
      "Distributed Denial of Service - overwhelming servers with traffic",
      "A database management system",
      "A type of firewall",
    ],
    correct: 1,
    explanation:
      "A DDoS attack attempts to disrupt normal traffic to a targeted server by overwhelming it with a flood of traffic from multiple sources.",
  },
  {
    question: "What is encryption?",
    options: [
      "A way to compress files",
      "Converting data into a code to prevent unauthorized access",
      "A type of computer virus",
      "A method to speed up internet connection",
    ],
    correct: 1,
    explanation:
      "Encryption is the process of converting information into a code to prevent unauthorized access.",
  },
  {
    question: "What is a brute force attack?",
    options: [
      "A physical attack on computer hardware",
      "Systematically checking all possible passwords until the correct one is found",
      "A type of computer virus",
      "A method of improving computer performance",
    ],
    correct: 1,
    explanation:
      "A brute force attack is a trial-and-error method used to obtain information such as passwords by systematically trying every possible combination.",
  },
  {
    question: "What is a SQL injection attack?",
    options: [
      "A method of optimizing databases",
      "Inserting malicious code into SQL statements to manipulate databases",
      "A type of database backup",
      "A database cleaning process",
    ],
    correct: 1,
    explanation:
      "SQL injection is a code injection technique used to attack data-driven applications by inserting malicious SQL statements into entry fields.",
  },
  {
    question: "What is a man-in-the-middle attack?",
    options: [
      "A physical security breach",
      "An attack where the attacker secretly relays communications between parties",
      "A type of firewall",
      "A network monitoring tool",
    ],
    correct: 1,
    explanation:
      "A man-in-the-middle attack occurs when an attacker secretly intercepts and relays messages between two parties who believe they are communicating directly with each other.",
  },
  {
    question: "What is a zero-trust security model?",
    options: [
      "Having no security measures",
      "Never trusting any user or device by default, even if previously verified",
      "A type of antivirus software",
      "A method of password storage",
    ],
    correct: 1,
    explanation:
      "Zero-trust security is an IT security model that requires strict identity verification for every person and device trying to access resources on a private network.",
  },
  {
    question: "What is a security token?",
    options: [
      "A type of cryptocurrency",
      "A physical or digital device used for authentication",
      "A type of computer virus",
      "A method of encrypting emails",
    ],
    correct: 1,
    explanation:
      "A security token is a physical or digital device used to prove identity electronically, often as a part of two-factor authentication.",
  },
];

function initializeQuiz() {
  // Initialize DOM elements
  questionElement = document.getElementById("question");
  optionsElement = document.getElementById("options");
  feedbackElement = document.getElementById("feedback");
  prevBtn = document.getElementById("prevBtn");
  nextBtn = document.getElementById("nextBtn");
  timerElement = document.getElementById("timer");
  currentQuestionSpan = document.getElementById("currentQuestion");
  totalQuestionsSpan = document.getElementById("totalQuestions");

  // Set up event listeners
  prevBtn.onclick = previousQuestion;
  nextBtn.onclick = nextQuestion;

  // Start the quiz
  startQuiz();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function selectRandomQuestions() {
  let availableIndices = [];

  // Get all unused question indices
  for (let i = 0; i < allQuestions.length; i++) {
    if (!usedQuestionIndices.has(i)) {
      availableIndices.push(i);
    }
  }

  // If we've used all questions, reset the used questions tracking
  if (availableIndices.length < 5) {
    usedQuestionIndices.clear();
    availableIndices = Array.from({ length: allQuestions.length }, (_, i) => i);
  }

  // Shuffle available indices and select 5
  availableIndices = shuffleArray(availableIndices);
  const selectedIndices = availableIndices.slice(0, 5);

  // Mark selected indices as used
  selectedIndices.forEach((index) => usedQuestionIndices.add(index));

  // Return the selected questions
  return selectedIndices.map((index) => allQuestions[index]);
}

function startQuiz() {
  currentQuestions = selectRandomQuestions();
  currentQuestionIndex = 0;
  score = 0;
  displayQuestion();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 30;
  updateTimer();
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft === 0) {
      clearInterval(timer);
      handleTimeout();
    }
  }, 1000);
}

function updateTimer() {
  timerElement.textContent = `Time: ${timeLeft}s`;
}

function handleTimeout() {
  feedbackElement.textContent = "Time's up! Moving to the next question.";
  feedbackElement.className = "feedback wrong";
  setTimeout(nextQuestion, 2000);
}

function displayQuestion() {
  const question = currentQuestions[currentQuestionIndex];
  questionElement.textContent = question.question;
  optionsElement.innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.onclick = () => selectOption(index);
    optionsElement.appendChild(button);
  });

  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  totalQuestionsSpan.textContent = currentQuestions.length;
  feedbackElement.className = "feedback";
  startTimer();
}

function selectOption(index) {
  clearInterval(timer);
  const question = currentQuestions[currentQuestionIndex];
  const options = document.querySelectorAll(".option");

  options.forEach((option) =>
    option.classList.remove("selected", "correct", "wrong")
  );
  options[index].classList.add("selected");

  if (index === question.correct) {
    options[index].classList.add("correct");
    feedbackElement.textContent = `Correct! ${question.explanation}`;
    feedbackElement.className = "feedback correct";
    score++;
  } else {
    options[index].classList.add("wrong");
    options[question.correct].classList.add("correct");
    feedbackElement.textContent = `Incorrect. ${question.explanation}`;
    feedbackElement.className = "feedback wrong";
  }
}

function nextQuestion() {
  if (currentQuestionIndex < currentQuestions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    finishQuiz();
  }
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

function finishQuiz() {
  clearInterval(timer);
  const percentage = (score / currentQuestions.length) * 100;
  questionElement.textContent = `Quiz Complete! Your Score: ${percentage}%`;
  optionsElement.innerHTML = "";
  feedbackElement.textContent = `You answered ${score} out of ${currentQuestions.length} questions correctly.`;
  feedbackElement.className = "feedback correct";

  const restartButton = document.createElement("button");
  restartButton.className = "btn btn-primary";
  restartButton.textContent = "Take Another Quiz";
  restartButton.onclick = startQuiz;
  optionsElement.appendChild(restartButton);
}

// Initialize the quiz when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeQuiz);
