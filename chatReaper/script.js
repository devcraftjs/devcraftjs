const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Send message on button click or Enter key
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage('user', message);          // Show user's message
  userInput.value = '';
  appendMessage('ai', 'ChatReaper is thinking...'); // Temporary thinking message

  try {
    const response = await fetch('https://chatreaper-backend.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    }).then(res => res.json());

    // Replace the temporary "thinking" message
    chatBox.lastChild.textContent = '';
    appendMessage('ai', response.reply);

  } catch (err) {
    console.error(err);
    chatBox.lastChild.textContent = '';
    appendMessage('ai', 'Error contacting AI.');
  }
}

// Function to add a message to the chat box
function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
}
