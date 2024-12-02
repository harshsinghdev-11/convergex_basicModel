let model;
const articleInput = document.getElementById('articleInput');
const questionInput = document.getElementById('question');
const askButton = document.getElementById('askButton');
const outputDiv = document.getElementById('output');

async function loadModel() {
    model = await qna.load();
    askButton.disabled = false;
}

askButton.addEventListener('click', async () => {
    const articleText = articleInput.value.trim();
    const question = questionInput.value.trim();

    if (!articleText) {
        alert("Please enter a paragraph.");
        return;
    }

    if (!question) {
        alert("Please enter a question.");
        return;
    }

    const answers = await model.findAnswers(question, articleText);

    // Clear previous output
    outputDiv.innerHTML = '';

    if (answers.length > 0) {
        answers.forEach(answer => {
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('answer');
            answerDiv.innerHTML = `<strong>Answer:</strong> ${answer.text} (Confidence: ${Math.round(answer.score * 100)}%)`;
            outputDiv.appendChild(answerDiv);
        });

        // Highlight the best answer in the text
        highlightAnswer(answers[0]);
    } else {
        outputDiv.innerHTML = "No answer found.";
    }
});

function highlightAnswer(answer) {
    const articleText = articleInput.value;
    const start = answer.startIndex;
    const end = answer.endIndex;

    const highlightedText =
        articleText.substring(0, start) +
        "<span class='highlight'>" +
        articleText.substring(start, end + 1) +
        "</span>" +
        articleText.substring(end + 1);

    articleInput.value = highlightedText; // Update textarea with highlighted text
}

// Load the QnA model when the page is ready
loadModel();