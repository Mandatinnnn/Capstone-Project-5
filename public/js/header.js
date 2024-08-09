document.addEventListener("DOMContentLoaded", function() {
    let currentPath = window.location.pathname;
    let navLinks = document.querySelectorAll("header nav ul li div a");

    navLinks.forEach(function(link) {
        let href = link.getAttribute("href");
        if (href === currentPath) {
            link.parentElement.classList.add("active");
        }
    });

    const userBtn = document.getElementById("user-btn");

    userBtn.addEventListener("click", function() {
        let menu = document.getElementById("dropdown-menu");
        let menuUl = menu.querySelector("ul");
        const svgElement = userBtn.querySelector('svg');

        if (menu.style.height === '50px') {
            menu.style.height = '0';
            menu.style.padding = '0';
            menuUl.style.display = 'none';
        } else {
            menu.style.height = '50px';
            menu.style.padding = '10px';
            setTimeout(() => {
                menuUl.style.display = 'flex';
            }, 150);
        }
        svgElement.classList.toggle('rotated');
    });
    
    document.addEventListener('click', function(event) {
        let menu = document.getElementById('dropdown-menu');
        let menuUl = menu.querySelector("ul");
        let button = document.getElementById('user-btn');
        const svgElement = button.querySelector('svg');
        if (!menu.contains(event.target) && !button.contains(event.target)) {
            menu.style.height = '0';
            menu.style.padding = '0';
            menuUl.style.display = 'none';
            svgElement.classList.remove('rotated');
        }
    });

    document.querySelectorAll('.drop-menu ul').forEach(ul => {
        const fullHeight = ul.scrollHeight + 'px';
        ul.style.height = fullHeight;
    });

    function toggleMenu(menu) {
        const ulElement = menu.querySelector("ul");
        if (ulElement) {
            if (ulElement.classList.contains("collapsed")) {
                ulElement.classList.remove("collapsed");
                const fullHeight = ulElement.scrollHeight + 'px';
                ulElement.style.height = fullHeight;
            } else {
                ulElement.style.height = '0px';
                ulElement.classList.add("collapsed");
            }
        }
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ulElement = btn.closest('.nav-drop-menu-container').querySelector('.drop-menu');
            const svgElement = btn.querySelector('svg');

            toggleMenu(ulElement);
            svgElement.classList.toggle('rotated');
        }); 
    });
});