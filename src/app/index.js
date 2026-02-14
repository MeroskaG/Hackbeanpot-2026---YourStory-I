// ./src/public/app/index.js

const chatArea = document.getElementById('chat-area');
const messageInput = document.getElementById('message');
const profileElement = document.getElementById('profile');
const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');

messageInput.addEventListener('keyup', async (event) => {
  if (event.code !== 'Enter') return;
  firebaseClient.addMessage(messageInput.value);
  messageInput.value = '';
});

signInButton.addEventListener('click', async () => {
  auth0Client.signIn();
});

signOutButton.addEventListener('click', async () => {
  auth0Client.signOut();
  firebaseClient.signOut();
  // clear stored uid
  sessionStorage.removeItem('uid');
  deactivateChat();
});

async function setFirebaseCustomToken() {
  const response = await fetch('http://localhost:3001/firebase', {
    headers: {
      'Authorization': `Bearer ${auth0Client.getIdToken()}`,
    },
  });

  const data = await response.json();
  await firebaseClient.setToken(data.firebaseToken);
  await firebaseClient.updateProfile(auth0Client.getProfile());
  // Save user record in Firestore and store uid locally for uploads
  const currentUser = firebaseClient.getCurrentUser();
  if (currentUser && currentUser.uid) {
    // persist uid for use in upload paths
    sessionStorage.setItem('uid', currentUser.uid);
    await firebaseClient.saveUserRecord(auth0Client.getProfile()).catch(err => console.error(err));
  }
  activateChat();
}

function activateChat() {
  const {displayName} = firebase.auth().currentUser;
  profileElement.innerText = `Hello, ${displayName}.`;
  signInButton.style.display = 'none';
  signOutButton.style.display = 'inline-block';
  messageInput.disabled = false;
  firebaseClient.setMessagesListener((querySnapshot) => {
    chatArea.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const messageContainer = document.createElement('div');
      const timestampElement = document.createElement('small');
      const messageElement = document.createElement('p');

      const messageDate = new Date(doc.data().createdAt.seconds * 1000);
      timestampElement.innerText = doc.data().author + ' - ' + messageDate.toISOString().replace('T', ' ').substring(0, 19);
      messageElement.innerText = doc.data().message;
      messageContainer.appendChild(timestampElement);
      messageContainer.appendChild(messageElement);
      messageContainer.className = 'alert alert-secondary';
      chatArea.appendChild(messageContainer);
    });
  });
}

function deactivateChat() {
  profileElement.innerText = '';
  signInButton.style.display = 'inline-block';
  signOutButton.style.display = 'none';
  messageInput.disabled = true;
}

(async () => {
  deactivateChat();

  const loggedInThroughCallback = await auth0Client.handleCallback();
  if (loggedInThroughCallback) await setFirebaseCustomToken();
})();