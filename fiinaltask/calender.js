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
    // --- Calendar Functionality ---
    const currentMonthYearEl = document.getElementById('currentMonthYear');
    const calendarDatesEl = document.getElementById('calendarDates');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentDate = new Date(); // Start with today's date

    function renderCalendar() {
        calendarDatesEl.innerHTML = ''; // Clear previous days

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-indexed

        currentMonthYearEl.textContent = new Date(year, month).toLocaleString('en-US', {
            month: 'long',
            year: 'numeric'
        });

        // Get the first day of the month (0 = Sunday, 6 = Saturday)
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // Get the number of days in the current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // Get the number of days in the previous month for padding
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Fill in leading empty cells (days from previous month)
        for (let i = 0; i < firstDayOfMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('empty', 'other-month'); // Add 'other-month' class for styling
            // Optionally display the last few days of the previous month
            // dayEl.textContent = daysInPrevMonth - firstDayOfMonth + 1 + i;
            calendarDatesEl.appendChild(dayEl);
        }

        // Fill in days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.textContent = day;

            // Highlight current day
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('current-day');
            }

            calendarDatesEl.appendChild(dayEl);
        }

        // Fill in trailing empty cells (days from next month) - ensure 6 rows
        const totalCells = firstDayOfMonth + daysInMonth;
        const remainingCells = 42 - totalCells; // 6 weeks * 7 days = 42 cells total

        for (let i = 1; i <= remainingCells; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('empty', 'other-month');
            // Optionally display the first few days of the next month
            // dayEl.textContent = i;
            calendarDatesEl.appendChild(dayEl);
        }
    }

    // Event listeners for month navigation
    if (prevMonthBtn) { // Check if elements exist before adding listeners
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    // Initial render of the calendar
    // Ensure this runs only if the calendar elements are present on the page
    if (calendarDatesEl && currentMonthYearEl) {
        renderCalendar();
    }


    // --- Existing JavaScript from previous discussions (Sidebar, Top Navbar, etc.) ---
    // Make sure to integrate this with your existing script.js file.

    const submenuToggles = document.querySelectorAll('.has-submenu .submenu-toggle');
    const verticalMenuLinks = document.querySelectorAll('.vertical-menu-list a');
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const mainNavVertical = document.querySelector('.main-nav-vertical');

    const userDropdownToggle = document.querySelector('.dropdown-user .user-avatar-link');
    const languageDropdownToggle = document.querySelector('.dropdown-language .language-link');

    function setupDropdown(toggleElement) {
        if (toggleElement) {
            const dropdownContent = toggleElement.nextElementSibling;
            toggleElement.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    if (content !== dropdownContent && content.style.display === 'block') {
                        content.style.display = 'none';
                    }
                });
                dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
            });
        }
    }

    setupDropdown(userDropdownToggle);
    setupDropdown(languageDropdownToggle);

    window.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown-user') && !event.target.closest('.dropdown-language')) {
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.style.display = 'none';
            });
        }
    });

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            const parentLi = toggle.closest('.has-submenu');
            const submenu = parentLi.querySelector('.submenu-list');
            if (submenu) {
                parentLi.classList.toggle('open');
                if (submenu.style.display === 'block') {
                    submenu.style.display = 'none';
                } else {
                    submenu.style.display = 'block';
                }
            }
        });
    });

    const currentPath = window.location.pathname.split('/').pop();
    verticalMenuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref && linkHref !== '#') {
            const linkPath = linkHref.split('/').pop();
            if (currentPath === linkPath || (currentPath === '' && (linkPath === 'dashboard.html' || linkPath === 'index.html'))) {
                link.classList.add('active-link');
                const parentSubmenu = link.closest('.submenu-list');
                if (parentSubmenu) {
                    const parentHasSubmenu = parentSubmenu.closest('.has-submenu');
                    if (parentHasSubmenu) {
                        parentHasSubmenu.classList.add('open');
                        parentSubmenu.style.display = 'block';
                    }
                }
            }
        }
    });

    if (sidebarToggleBtn && sidebarMenu) {
        sidebarToggleBtn.addEventListener('click', () => {
            if (window.innerWidth > 768) {
                sidebarMenu.classList.toggle('collapsed');
                document.body.classList.toggle('sidebar-is-collapsed');
            } else {
                if (mainNavVertical) {
                    mainNavVertical.classList.toggle('active');
                } else {
                    sidebarMenu.classList.toggle('active-mobile-sidebar');
                }
            }
        });
    }

    if (mainNavVertical) {
        mainNavVertical.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    mainNavVertical.classList.remove('active');
                }
            });
        });
    }
});