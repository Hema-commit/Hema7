document.addEventListener('DOMContentLoaded', () => {
    const submenuToggles = document.querySelectorAll('.has-submenu .submenu-toggle');
    const verticalMenuLinks = document.querySelectorAll('.vertical-menu-list a');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNavVertical = document.querySelector('.main-nav-vertical');

    // 1. Submenu Toggling
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const parentLi = toggle.closest('.has-submenu');
            const submenu = parentLi.querySelector('.submenu-list');

            if (submenu) {
                // Toggle the 'open' class on the parent li
                parentLi.classList.toggle('open');
                // Toggle display of the submenu
                if (submenu.style.display === 'block') {
                    submenu.style.display = 'none';
                } else {
                    submenu.style.display = 'block';
                }
            }
        });
    });

    // 2. Active Link Highlighting
    const currentPath = window.location.pathname.split('/').pop(); // Get filename (e.g., dashboard.html)

    verticalMenuLinks.forEach(link => {
        // Handle cases where the link is just '#' for submenus, etc.
        const linkHref = link.getAttribute('href');
        if (linkHref && linkHref !== '#') {
            const linkPath = linkHref.split('/').pop();

            // Check if it's the current page or if it's the root and link is dashboard.html or index.html
            if (currentPath === linkPath || (currentPath === '' && (linkPath === 'dashboard.html' || linkPath === 'index.html'))) {
                link.classList.add('active-link');
                // If it's a submenu item, also open its parent
                const parentSubmenu = link.closest('.submenu-list');
                if (parentSubmenu) {
                    const parentHasSubmenu = parentSubmenu.closest('.has-submenu');
                    if (parentHasSubmenu) {
                        parentHasSubmenu.classList.add('open');
                        parentSubmenu.style.display = 'block'; // Ensure submenu is visible
                    }
                }
            }
        }
    });

    // 3. Mobile Sidebar Toggle (for screens <= 768px)
    if (mobileMenuToggle && mainNavVertical) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNavVertical.classList.toggle('active');
        });
    }

    // Optional: Close mobile menu when a link is clicked (useful if using JS to hide/show)
    mainNavVertical.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) { // Only close on mobile
                mainNavVertical.classList.remove('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const messageList = document.getElementById('messageList');
    const messageViewPlaceholder = document.getElementById('messageViewPlaceholder');
    const messageViewContent = document.getElementById('messageViewContent');
    const messageSubject = document.getElementById('messageSubject');
    const messageFrom = document.getElementById('messageFrom');
    const messageDate = document.getElementById('messageDate');
    const messageBody = document.getElementById('messageBody');
    const navItems = document.querySelectorAll('.mailbox-nav .nav-item');
    const unreadCountBadge = document.querySelector('.unread-count');
    const messageListHeader = document.querySelector('.message-list-header h3');

    // Dummy Data for Emails
    const emails = {
        inbox: [
            {
                id: 1,
                sender: 'Alice Wonderland',
                subject: 'Project Update Meeting',
                date: 'Jul 3, 2025',
                body: 'Hi team, just a quick reminder about our project update meeting tomorrow at 10 AM in the conference room. Please come prepared with your latest progress reports. See you there! Best, Alice',
                read: false
            },
            {
                id: 2,
                sender: 'Bob The Builder',
                subject: 'Regarding the new construction plan',
                date: 'Jul 2, 2025',
                body: 'Hello, I have reviewed the new construction plan and have a few questions regarding the material sourcing. Can we schedule a brief call next week to discuss? Thanks, Bob',
                read: false
            },
            {
                id: 3,
                sender: 'Charlie Chaplin',
                subject: 'Your order #1234 has shipped!',
                date: 'Jul 1, 2025',
                body: 'Great news! Your recent order (Order #1234) has shipped and is on its way. You can track your package using the link: [Tracking Link]. Expected delivery in 3-5 business days. Thank you for your purchase!',
                read: false
            },
            {
                id: 4,
                sender: 'David Copperfield',
                subject: 'Magic Show Tickets Available',
                date: 'Jun 30, 2025',
                body: 'Exciting news! Tickets for my upcoming magic show are now available for purchase. Get ready for an evening of illusion and wonder. Book now before they disappear! Visit [Link] for details.',
                read: true
            }
        ],
        sent: [
            {
                id: 5,
                sender: 'Me',
                subject: 'Re: Project Update Meeting',
                date: 'Jul 3, 2025',
                body: 'Sure, Alice! I\'ll be there with my report ready. Looking forward to it.',
                read: true
            },
            {
                id: 6,
                sender: 'Me',
                subject: 'Following up on inquiry',
                date: 'Jun 28, 2025',
                body: 'Hello team, I\'m following up on my previous inquiry about the new software license. Could you please provide an update? Thanks!',
                read: true
            }
        ],
        drafts: [
            {
                id: 7,
                sender: 'Me',
                subject: 'Meeting notes (draft)',
                date: 'Jul 4, 2025',
                body: 'Here are some preliminary notes from our meeting today...',
                read: true
            }
        ],
        starred: [], // Starred will be populated dynamically
        trash: []
    };

    let currentCategory = 'inbox';
    let selectedMessageId = null;

    // Function to render messages for a given category
    function renderMessages(category) {
        messageList.innerHTML = ''; // Clear existing messages
        const categoryEmails = emails[category];
        messageListHeader.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Set header title

        if (categoryEmails.length === 0) {
            messageList.innerHTML = '<div class="no-messages-placeholder">No messages in this category.</div>';
            hideMessageView();
            return;
        }

        categoryEmails.forEach(email => {
            const messageItem = document.createElement('div');
            messageItem.classList.add('message-item');
            if (!email.read) {
                messageItem.classList.add('unread');
            }
            messageItem.dataset.id = email.id;
            messageItem.dataset.category = category;

            messageItem.innerHTML = `
                <div class="message-item-header">
                    <span class="sender">${email.sender}</span>
                    <span class="date">${email.date}</span>
                </div>
                <div class="message-item-subject">${email.subject}</div>
                <div class="message-item-body-preview">${email.body.substring(0, 70)}...</div>
            `;
            messageList.appendChild(messageItem);

            messageItem.addEventListener('click', () => selectMessage(email.id, category));
        });

        updateUnreadCount();
        // Automatically select the first message if available and on a large screen
        if (categoryEmails.length > 0 && window.innerWidth > 992) {
             selectMessage(categoryEmails[0].id, category);
        } else {
            hideMessageView(); // Hide view on small screens initially
        }
    }

    // Function to select and display a message
    function selectMessage(id, category) {
        const selectedEmail = emails[category].find(email => email.id === id);

        if (!selectedEmail) {
            hideMessageView();
            return;
        }

        // Mark as read and update UI
        if (!selectedEmail.read) {
            selectedEmail.read = true;
            const messageItemElement = document.querySelector(`.message-item[data-id="${id}"][data-category="${category}"]`);
            if (messageItemElement) {
                messageItemElement.classList.remove('unread');
            }
            updateUnreadCount();
        }

        // Remove active class from previously selected item
        const prevActive = document.querySelector('.message-item.active');
        if (prevActive) {
            prevActive.classList.remove('active');
        }

        // Add active class to current item
        const currentActive = document.querySelector(`.message-item[data-id="${id}"][data-category="${category}"]`);
        if (currentActive) {
            currentActive.classList.add('active');
        }


        messageSubject.textContent = selectedEmail.subject;
        messageFrom.textContent = `From: ${selectedEmail.sender}`;
        messageDate.textContent = selectedEmail.date;
        messageBody.textContent = selectedEmail.body;

        messageViewPlaceholder.style.display = 'none';
        messageViewContent.style.display = 'block';
        selectedMessageId = id; // Store currently selected message ID

        // Implement delete functionality for the message view
        const deleteMessageBtn = document.querySelector('.delete-message-btn');
        if (deleteMessageBtn) {
            deleteMessageBtn.onclick = () => handleDeleteMessage(selectedEmail.id, category);
        }
    }

    // Function to hide the message view
    function hideMessageView() {
        messageViewPlaceholder.style.display = 'block';
        messageViewContent.style.display = 'none';
        const prevActive = document.querySelector('.message-item.active');
        if (prevActive) {
            prevActive.classList.remove('active');
        }
        selectedMessageId = null;
    }

    // Function to update the unread count in the sidebar
    function updateUnreadCount() {
        const unreadInboxCount = emails.inbox.filter(email => !email.read).length;
        if (unreadInboxCount > 0) {
            unreadCountBadge.textContent = unreadInboxCount;
            unreadCountBadge.style.display = 'inline-block';
        } else {
            unreadCountBadge.style.display = 'none';
        }
    }

    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            currentCategory = item.dataset.category;
            renderMessages(currentCategory);
        });
    });

    // Handle Delete Message button in message view
    function handleDeleteMessage(messageId, currentCategory) {
        if (!confirm("Are you sure you want to delete this message?")) {
            return;
        }

        let messageIndex = -1;
        // Find the message in the current category
        const messageToDelete = emails[currentCategory].find((msg, index) => {
            if (msg.id === messageId) {
                messageIndex = index;
                return true;
            }
            return false;
        });

        if (messageIndex !== -1) {
            // Remove from current category
            emails[currentCategory].splice(messageIndex, 1);
            // Add to trash category (optional, but typical for email clients)
            if (messageToDelete) {
                emails.trash.push(messageToDelete);
            }
            renderMessages(currentCategory); // Re-render the list
            hideMessageView(); // Hide the view after deletion

            // If the deleted message was from inbox and unread, update count
            if (currentCategory === 'inbox' && !messageToDelete.read) {
                 updateUnreadCount();
            }
        }
    }


    // Initial render for Inbox
    renderMessages(currentCategory);

    // Initial update of unread count
    updateUnreadCount();

    // Example: Compose button (can add more complex modal/form later)
    document.querySelector('.compose-btn').addEventListener('click', () => {
        alert('Compose New Email (Functionality to be added!)');
    });

    // Example: Refresh button (re-renders current category, simulating refresh)
    document.querySelector('.refresh-btn').addEventListener('click', () => {
        renderMessages(currentCategory);
        alert('Messages Refreshed!');
    });
});