const messageBar = document.querySelector(".bar-wrapper input");
const sendBtn = document.querySelector(".bar-wrapper button");
const messageBox = document.querySelector(".message-box");
const voiceButton = document.getElementById('voiceButton');

let API_URL = "https://api.openai.com/v1/chat/completions";
let API_KEY = "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"; // Add your API key here

sendBtn.onclick = function() {
  if (messageBar.value.length > 0) {
    const UserTypedMessage = messageBar.value;
    messageBar.value = "";

    let message = `
      <div class="chat message">
        <img src="img/user.jpg">
        <span>${UserTypedMessage}</span>
      </div>`;

    let response = `
      <div class="chat response">
        <img src="img/chatbot.jpg">
        <span class="new">...</span>
      </div>`;

    messageBox.insertAdjacentHTML("beforeend", message);

    setTimeout(() => {
      messageBox.insertAdjacentHTML("beforeend", response);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [{ "role": "user", "content": UserTypedMessage }]
        })
      };

      fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
          const ChatBotResponse = document.querySelector(".response .new");
          ChatBotResponse.innerHTML = data.choices[0].message.content;
          readOutLoud(ChatBotResponse.innerHTML); // Read the response
          ChatBotResponse.classList.remove("new");
        })
        .catch((error) => {
          const ChatBotResponse = document.querySelector(".response .new");
          ChatBotResponse.innerHTML = "Oops! An error occurred. Please try again.";
          readOutLoud(ChatBotResponse.innerHTML); // Read the error response
        });
    }, 100);
  }
};

// Voice recognition setup
const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;

voiceButton.addEventListener('click', () => {
  recognition.start();
});

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  messageBar.value = transcript;

  // Auto-send the message if no response within 2 seconds
  setTimeout(() => {
    if (messageBar.value === transcript) {
      sendBtn.click();
    }
  }, 2000);
};

// Function to read out the chatbot's response
function readOutLoud(message) {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  } else {
    console.error('Speech synthesis is not supported in this browser.');
  }
}