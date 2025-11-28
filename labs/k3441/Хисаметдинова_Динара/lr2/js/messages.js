
let currentUser = null;
let currentChat = null;
let conversations = [];
let transactions = [];

const sampleConversations = [
    {
        id: 1,
        name: 'Alex',
        avatar: 'https://ui-avatars.com/api/?name=Alex&background=007bff&color=fff&size=40',
        lastMessage: 'Thank you for your booking! Looking forward to hosting you.',
        timestamp: '2024-01-20T10:30:00Z',
        unread: 2,
        property: 'Belgrade Apartment',
        messages: [
            {
                id: 1,
                sender: 'user',
                text: 'Hi, I have a question about the Belgrade apartment.',
                timestamp: '2024-01-20T09:00:00Z'
            },
            {
                id: 2,
                sender: 'host',
                text: 'Hello! I\'d be happy to help. What would you like to know?',
                timestamp: '2024-01-20T09:15:00Z'
            },
            {
                id: 3,
                sender: 'user',
                text: 'Is parking available near the apartment?',
                timestamp: '2024-01-20T09:20:00Z'
            },
            {
                id: 4,
                sender: 'host',
                text: 'Yes, there\'s free street parking right in front of the building, and a paid garage 2 blocks away.',
                timestamp: '2024-01-20T09:25:00Z'
            },
            {
                id: 5,
                sender: 'user',
                text: 'Perfect! I\'ll book it then.',
                timestamp: '2024-01-20T10:00:00Z'
            },
            {
                id: 6,
                sender: 'host',
                text: 'Thank you for your booking! Looking forward to hosting you.',
                timestamp: '2024-01-20T10:30:00Z'
            }
        ]
    },
    {
        id: 2,
        name: 'Customer Support',
        avatar: 'https://ui-avatars.com/api/?name=Support&background=28a745&color=fff&size=40',
        lastMessage: 'Your refund has been processed successfully.',
        timestamp: '2024-01-19T14:20:00Z',
        unread: 0,
        property: 'General Support',
        messages: [
            {
                id: 1,
                sender: 'user',
                text: 'I need help with canceling my booking.',
                timestamp: '2024-01-19T13:00:00Z'
            },
            {
                id: 2,
                sender: 'support',
                text: 'I can help you with that. Can you please provide your booking reference number?',
                timestamp: '2024-01-19T13:30:00Z'
            },
            {
                id: 3,
                sender: 'user',
                text: 'The reference is #RA2024001.',
                timestamp: '2024-01-19T13:35:00Z'
            },
            {
                id: 4,
                sender: 'support',
                text: 'I\'ve found your booking. I\'ve processed the cancellation and refund according to our policy.',
                timestamp: '2024-01-19T14:00:00Z'
            },
            {
                id: 5,
                sender: 'support',
                text: 'Your refund has been processed successfully.',
                timestamp: '2024-01-19T14:20:00Z'
            }
        ]
    }
];

const sampleTransactions = [
    {
        id: 'RA2024001',
        type: 'booking',
        property: 'Belgrade Apartment',
        amount: 180,
        status: 'completed',
        date: '2024-01-20T10:30:00Z',
        checkIn: '2024-02-15',
        checkOut: '2024-02-21',
        nights: 6,
        guests: 2,
        host: 'Alex'
    },
    {
        id: 'RA2024002',
        type: 'refund',
        property: 'Krakow Loft',
        amount: -450,
        status: 'completed',
        date: '2024-01-19T14:20:00Z',
        reason: 'Cancellation due to travel restrictions'
    },
    {
        id: 'RA2024003',
        type: 'booking',
        property: 'Prague House',
        amount: 360,
        status: 'pending',
        date: '2024-01-18T16:45:00Z',
        checkIn: '2024-03-01',
        checkOut: '2024-03-04',
        nights: 3,
        guests: 4,
        host: 'Petra'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    checkAuthentication();
    setupEventListeners();
    loadData();
});

function initializePage() {
    const userData = localStorage.getItem('user');
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = JSON.parse(userData);
    updateUserDisplay();

    const urlParams = new URLSearchParams(window.location.search);
    const hostParam = urlParams.get('host');
    if (hostParam) {
        setTimeout(() => {
            startConversationWithHost(hostParam);
        }, 1000);
    }
}

function checkAuthentication() {
    if (currentUser) {
        document.getElementById('userDisplayName').textContent =
            currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.email;

        const avatar = document.getElementById('userAvatar');
        if (currentUser.firstName && currentUser.lastName) {
            const name = `${currentUser.firstName}+${currentUser.lastName}`;
            avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=007bff&color=fff&size=32`;
        }
    }
}

function setupEventListeners() {
    document.getElementById('messagesView').addEventListener('change', function() {
        if (this.checked) showMessagesView();
    });

    document.getElementById('transactionsView').addEventListener('change', function() {
        if (this.checked) showTransactionsView();
    });

    document.getElementById('messageForm').addEventListener('submit', sendMessage);

    document.getElementById('dateFilter').addEventListener('change', applyTransactionFilters);
    document.getElementById('typeFilter').addEventListener('change', applyTransactionFilters);
    document.getElementById('statusFilter').addEventListener('change', applyTransactionFilters);

    document.getElementById('recipientType').addEventListener('change', function() {
        const hostDiv = document.getElementById('hostSelectDiv');
        hostDiv.style.display = this.value === 'host' ? 'block' : 'none';
    });
}

function updateUserDisplay() {
    if (currentUser) {
        const elements = document.querySelectorAll('[data-user-field]');
        elements.forEach(element => {
            const field = element.getAttribute('data-user-field');
            if (currentUser[field]) {
                element.textContent = currentUser[field];
            }
        });
    }
}

async function loadData() {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const user = JSON.parse(userData);

    try {
        const conversationsResult = await ApiService.getConversations(user.id);
        const bookingsResult = await ApiService.getUserBookings(user.id);

        if (conversationsResult.success) {
            conversations = conversationsResult.data;
        } else {
            conversations = [...sampleConversations];
        }

        if (bookingsResult.success) {
            transactions = bookingsResult.data;
        } else {
            transactions = [...sampleTransactions];
        }
    } catch (error) {
        console.error('Error loading data:', error);
        conversations = [...sampleConversations];
        transactions = [...sampleTransactions];
    }

    loadConversations();
    loadTransactionSummary();
    loadTransactionsList();
}

function showMessagesView() {
    document.getElementById('messagesSection').style.display = 'block';
    document.getElementById('transactionsSection').style.display = 'none';
}

function showTransactionsView() {
    document.getElementById('messagesSection').style.display = 'none';
    document.getElementById('transactionsSection').style.display = 'block';
}

function loadConversations() {
    const chatList = document.getElementById('chatList');

    if (conversations.length === 0) {
        chatList.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-comments fa-3x text-muted mb-3"></i>
                <p class="text-muted">No conversations yet</p>
                <button class="btn btn-primary btn-sm" onclick="startNewConversation()">
                    Start a conversation
                </button>
            </div>
        `;
        return;
    }

    const conversationsHTML = conversations.map(conv => `
        <div class="chat-item p-3 border-bottom ${conv.id === currentChat?.id ? 'active' : ''}"
             onclick="selectConversation(${conv.id})">
            <div class="d-flex align-items-start">
                <img src="${conv.avatar}" alt="${conv.name}" class="rounded-circle me-3" width="40" height="40">
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${conv.name}</h6>
                        <small class="text-muted">${formatTimestamp(conv.timestamp)}</small>
                    </div>
                    <p class="text-muted small mb-1">${conv.property}</p>
                    <p class="mb-0 small">${conv.lastMessage}</p>
                    ${conv.unread > 0 ? `<span class="badge bg-primary rounded-pill mt-1">${conv.unread}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    chatList.innerHTML = conversationsHTML;
}

function selectConversation(conversationId) {
    currentChat = conversations.find(c => c.id === conversationId);

    if (!currentChat) return;

    currentChat.unread = 0;

    const chatHeader = document.getElementById('chatHeader');
    chatHeader.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="${currentChat.avatar}" alt="${currentChat.name}" class="rounded-circle me-3" width="40" height="40">
            <div>
                <h6 class="mb-0">${currentChat.name}</h6>
                <small class="text-muted">${currentChat.property}</small>
            </div>
        </div>
    `;

    loadMessages();

    document.getElementById('chatInput').style.display = 'block';

    loadConversations();
}

function loadMessages() {
    if (!currentChat) return;

    const messagesContainer = document.getElementById('messagesContainer');

    if (currentChat.messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="text-center py-4">
                <p class="text-muted">No messages yet. Start the conversation!</p>
            </div>
        `;
        return;
    }

    const messagesHTML = currentChat.messages.map(msg => {
        const isUser = msg.sender === 'user';
        return `
            <div class="d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}">
                <div class="message-bubble ${isUser ? 'message-sent' : 'message-received'}">
                    <p class="mb-1">${msg.text}</p>
                    <small class="opacity-75">${formatTimestamp(msg.timestamp)}</small>
                </div>
            </div>
        `;
    }).join('');

    messagesContainer.innerHTML = messagesHTML;

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage(e) {
    e.preventDefault();

    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    if (!messageText || !currentChat) return;

    const userData = localStorage.getItem('user');
    if (!userData) return;

    const user = JSON.parse(userData);

    const messageData = {
        senderId: user.id,
        sender: 'user',
        text: messageText
    };

    try {
        const result = await ApiService.sendMessage(currentChat.id, messageData);

        if (result.success) {
            currentChat = result.data;
            messageInput.value = '';
            loadMessages();
            loadConversations();

            setTimeout(() => {
                simulateResponse();
            }, 2000);
        } else {
            showAlert('Failed to send message', 'danger');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showAlert('Failed to send message', 'danger');
    }
}

function simulateResponse() {
    if (!currentChat) return;

    const responses = [
        "Thank you for your message. I'll get back to you shortly.",
        "That's a great question! Let me check and respond.",
        "I appreciate you reaching out. I'll help you with that.",
        "Thank you for the information. I'll take care of it."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const responseMessage = {
        id: currentChat.messages.length + 1,
        sender: currentChat.id === 2 ? 'support' : 'host',
        text: randomResponse,
        timestamp: new Date().toISOString()
    };

    currentChat.messages.push(responseMessage);
    currentChat.lastMessage = randomResponse;
    currentChat.timestamp = new Date().toISOString();
    currentChat.unread = 0; // Since we're viewing it

    loadMessages();
    loadConversations();
}

function startNewConversation() {
    const modal = new bootstrap.Modal(document.getElementById('newConversationModal'));
    modal.show();
}

function startConversationWithHost(hostName) {
    document.getElementById('recipientType').value = 'host';
    document.getElementById('hostSelect').value = hostName.toLowerCase();
    document.getElementById('messageSubject').value = 'Question about property';
    startNewConversation();
}

async function sendNewConversation() {
    const form = document.getElementById('newConversationForm');
    const recipientType = document.getElementById('recipientType').value;
    const hostSelect = document.getElementById('hostSelect').value;
    const subject = document.getElementById('messageSubject').value;
    const message = document.getElementById('initialMessage').value;

    if (!subject.trim() || !message.trim()) {
        showAlert('Please fill in all fields', 'warning');
        return;
    }

    if (recipientType === 'host' && !hostSelect) {
        showAlert('Please select a host', 'warning');
        return;
    }

    const userData = localStorage.getItem('user');
    if (!userData) return;

    const user = JSON.parse(userData);

    const conversationData = {
        userId: user.id,
        hostId: recipientType === 'host' ? 3 : 1,
        name: recipientType === 'host' ? hostSelect.charAt(0).toUpperCase() + hostSelect.slice(1) : 'Customer Support',
        avatar: `https://ui-avatars.com/api/?name=${recipientType === 'host' ? hostSelect : 'Support'}&background=${recipientType === 'host' ? '007bff' : '28a745'}&color=fff&size=40`,
        lastMessage: message,
        property: recipientType === 'host' ? 'Property Inquiry' : 'Support Request',
        messages: [
            {
                id: 1,
                senderId: user.id,
                sender: 'user',
                text: message,
                timestamp: new Date().toISOString()
            }
        ]
    };

    try {
        const result = await ApiService.createConversation(conversationData);

        if (result.success) {
            conversations.unshift(result.data);
            bootstrap.Modal.getInstance(document.getElementById('newConversationModal')).hide();
            form.reset();
            loadConversations();
            selectConversation(result.data.id);
            showAlert('Conversation started successfully!', 'success');
        } else {
            showAlert('Failed to start conversation', 'danger');
        }
    } catch (error) {
        console.error('Error creating conversation:', error);
        showAlert('Failed to start conversation', 'danger');
    }
}

function loadTransactionSummary() {
    const totalTransactions = transactions.length;
    const totalSpent = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
    const completedTransactions = transactions.filter(t => t.status === 'completed').length;

    document.getElementById('totalTransactions').textContent = totalTransactions;
    document.getElementById('totalSpent').textContent = `$${totalSpent}`;
    document.getElementById('pendingTransactions').textContent = pendingTransactions;
    document.getElementById('completedTransactions').textContent = completedTransactions;
}

function loadTransactionsList() {
    const transactionsList = document.getElementById('transactionsList');

    if (transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-receipt fa-3x text-muted mb-3"></i>
                <p class="text-muted">No transactions yet</p>
            </div>
        `;
        return;
    }

    const transactionsHTML = transactions.map(transaction => {
        const statusClass = transaction.status === 'completed' ? 'success' :
                          transaction.status === 'pending' ? 'warning' : 'danger';

        const typeIcon = transaction.type === 'booking' ? 'calendar-check' :
                        transaction.type === 'refund' ? 'undo' : 'credit-card';

        return `
            <div class="transaction-card border-bottom p-4" onclick="showTransactionDetails('${transaction.id}')">
                <div class="row align-items-center">
                    <div class="col-md-1">
                        <div class="text-center">
                            <i class="fas fa-${typeIcon} fa-lg text-primary"></i>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <h6 class="mb-1">${transaction.property}</h6>
                        <p class="text-muted small mb-0">${transaction.id}</p>
                        ${transaction.checkIn ? `<p class="text-muted small mb-0">${formatDate(transaction.checkIn)} - ${formatDate(transaction.checkOut)}</p>` : ''}
                    </div>
                    <div class="col-md-2">
                        <span class="badge bg-${statusClass}">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
                    </div>
                    <div class="col-md-2">
                        <p class="mb-0 text-muted small">${formatDate(transaction.date)}</p>
                    </div>
                    <div class="col-md-2 text-end">
                        <h6 class="mb-0 ${transaction.amount > 0 ? 'text-success' : 'text-danger'}">
                            ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount)}
                        </h6>
                        <small class="text-muted">${transaction.type}</small>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    transactionsList.innerHTML = transactionsHTML;
}

function applyTransactionFilters() {
    showAlert('Filters applied successfully', 'info');
}

function showTransactionDetails(transactionId) {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
    const detailsContainer = document.getElementById('transactionDetails');

    const detailsHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Transaction Information</h6>
                <table class="table table-borderless">
                    <tr>
                        <td><strong>ID:</strong></td>
                        <td>${transaction.id}</td>
                    </tr>
                    <tr>
                        <td><strong>Type:</strong></td>
                        <td>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
                    </tr>
                    <tr>
                        <td><strong>Status:</strong></td>
                        <td><span class="badge bg-${transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : 'danger'}">${transaction.status}</span></td>
                    </tr>
                    <tr>
                        <td><strong>Amount:</strong></td>
                        <td class="${transaction.amount > 0 ? 'text-success' : 'text-danger'}">${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount)}</td>
                    </tr>
                    <tr>
                        <td><strong>Date:</strong></td>
                        <td>${formatDate(transaction.date)}</td>
                    </tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6>Booking Details</h6>
                <table class="table table-borderless">
                    <tr>
                        <td><strong>Property:</strong></td>
                        <td>${transaction.property}</td>
                    </tr>
                    ${transaction.host ? `
                    <tr>
                        <td><strong>Host:</strong></td>
                        <td>${transaction.host}</td>
                    </tr>
                    ` : ''}
                    ${transaction.checkIn ? `
                    <tr>
                        <td><strong>Check-in:</strong></td>
                        <td>${formatDate(transaction.checkIn)}</td>
                    </tr>
                    <tr>
                        <td><strong>Check-out:</strong></td>
                        <td>${formatDate(transaction.checkOut)}</td>
                    </tr>
                    <tr>
                        <td><strong>Nights:</strong></td>
                        <td>${transaction.nights}</td>
                    </tr>
                    <tr>
                        <td><strong>Guests:</strong></td>
                        <td>${transaction.guests}</td>
                    </tr>
                    ` : ''}
                    ${transaction.reason ? `
                    <tr>
                        <td><strong>Reason:</strong></td>
                        <td>${transaction.reason}</td>
                    </tr>
                    ` : ''}
                </table>
            </div>
        </div>
    `;

    detailsContainer.innerHTML = detailsHTML;
    modal.show();
}

function downloadReceipt() {
    showAlert('Receipt download would be implemented here', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} custom-alert position-fixed`;
    alert.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 250px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;

    alert.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getAlertIcon(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

    document.body.appendChild(alert);

    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function getAlertIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'danger': return 'exclamation-circle';
        case 'info':
        default: return 'info-circle';
    }
}

window.selectConversation = selectConversation;
window.startNewConversation = startNewConversation;
window.sendNewConversation = sendNewConversation;
window.applyTransactionFilters = applyTransactionFilters;
window.showTransactionDetails = showTransactionDetails;
window.downloadReceipt = downloadReceipt;
window.logout = logout;