const ctx = document.getElementById('earningsChart').getContext('2d');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Net Profit',
        backgroundColor: '#1e90ff',
        data: [30, 35, 32, 40, 45, 42, 48, 50, 49]
      },
      {
        label: 'Revenue',
        backgroundColor: '#2ed573', 
        data: [60, 62, 64, 70, 75, 73, 78, 82, 85]
      },
      {
        label: 'Free Cash Flow',
        backgroundColor: '#ffa502',
        data: [20, 25, 23, 30, 33, 31, 35, 38, 37]
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'centre',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '$ (Thousands)'
        }
      }
    }
  }
});
// You can add interactivity or load dynamic values here
console.log("Dashboard Cards Loaded");

document.addEventListener('DOMContentLoaded', () => {
    // Example: Handling "Accept" and "Decline" buttons
    const acceptButton = document.querySelector('.btn-accept');
    const declineButton = document.querySelector('.btn-decline');
    const connectionRequestCard = document.querySelector('.connection-request-card');

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            alert('Connection Accepted!');
            // You might remove the card or update its content here
            if (connectionRequestCard) {
                connectionRequestCard.style.opacity = '0';
                setTimeout(() => {
                    connectionRequestCard.style.display = 'none';
                }, 300); // Hide after fade out
            }
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            alert('Connection Declined!');
            // You might remove the card or update its content here
            if (connectionRequestCard) {
                connectionRequestCard.style.opacity = '0';
                setTimeout(() => {
                    connectionRequestCard.style.display = 'none';
                }, 300); // Hide after fade out
            }
        });
    }

    // Add more JavaScript logic here as needed for other dashboard elements
});

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