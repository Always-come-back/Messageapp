// Kullanıcıları ve mesajları saklamak için
let users = JSON.parse(localStorage.getItem('users')) || [];
let messages = JSON.parse(localStorage.getItem('messages')) || [];
let currentUser = null;
let selectedUser = null;

// Kullanıcı kaydı
function registerUser() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!username || !email) {
        alert('Lütfen tüm alanları doldurun!');
        return;
    }

    if (!email.includes('@')) {
        alert('Geçerli bir e-posta adresi girin!');
        return;
    }

    // Kullanıcı adı veya e-posta zaten kullanılıyor mu kontrol et
    if (users.some(user => user.username === username || user.email === email)) {
        alert('Bu kullanıcı adı veya e-posta zaten kullanılıyor!');
        return;
    }

    // Yeni kullanıcıyı kaydet
    const newUser = { username, email };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    showUserSelectScreen();
}

// Kullanıcı seçim ekranını göster
function showUserSelectScreen() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('userSelectScreen').classList.remove('hidden');
    
    // Kullanıcı listesini güncelle
    const userList = document.getElementById('userList');
    userList.innerHTML = '<option value="">Kullanıcı Seçin</option>';
    
    users.forEach(user => {
        if (user.username !== currentUser.username) {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            userList.appendChild(option);
        }
    });
}

// Sohbeti başlat
function startChat() {
    const selectedUsername = document.getElementById('userList').value;
    if (!selectedUsername) {
        alert('Lütfen bir kullanıcı seçin!');
        return;
    }

    selectedUser = users.find(user => user.username === selectedUsername);
    document.getElementById('userSelectScreen').classList.add('hidden');
    document.getElementById('chatScreen').classList.remove('hidden');
    document.getElementById('chatWith').textContent = selectedUser.username;
    
    loadMessages();
}

// Kullanıcı seçimine geri dön
function backToUserSelect() {
    document.getElementById('chatScreen').classList.add('hidden');
    document.getElementById('userSelectScreen').classList.remove('hidden');
    document.getElementById('messageArea').innerHTML = '';
    selectedUser = null;
}

// Mesaj gönder
function sendMessage() {
    const input = document.getElementById('messageInput');
    const messageText = input.value.trim();
    
    if (!messageText) return;
    
    const message = {
        from: currentUser.username,
        to: selectedUser.username,
        text: messageText,
        timestamp: new Date().toISOString()
    };
    
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
    
    displayMessage(message);
    input.value = '';
}

// Mesajları yükle
function loadMessages() {
    const messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = '';
    
    const chatMessages = messages.filter(msg => 
        (msg.from === currentUser.username && msg.to === selectedUser.username) ||
        (msg.from === selectedUser.username && msg.to === currentUser.username)
    );
    
    chatMessages.forEach(displayMessage);
}

// Mesajı görüntüle
function displayMessage(message) {
    const messageArea = document.getElementById('messageArea');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(message.from === currentUser.username ? 'sent' : 'received');
    messageDiv.textContent = message.text;
    messageArea.appendChild(messageDiv);
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Enter tuşu ile mesaj gönderme
document.getElementById('messageInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});