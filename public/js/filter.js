document.addEventListener("DOMContentLoaded", function() {
    const filterDropdownMenu = document.getElementById('filter-dropdown-menu');

    filterDropdownMenu.addEventListener('click', function (event) {
        event.preventDefault();

        const target = event.target;

        if (target.tagName.toLowerCase() === 'a') {
            const selectedCategory = target.dataset.category;
            filterBooksByCategory(selectedCategory);
        }
    });

    function filterBooksByCategory(category) {
        const books = document.querySelectorAll('.book-container');

        books.forEach(book => {
            const bookCategory = book.dataset.category;

            if (category === 'all' || bookCategory === category) {
                book.classList.remove('hidden');
            } else {
                book.classList.add('hidden');
            }
        });
    }

    const filterBtn = document.getElementById("filter-btn");

    filterBtn.addEventListener("click", function() {
        let menu = document.getElementById("filter-dropdown-menu");
        let menuUl = menu.querySelector("ul");
        const svgElement = filterBtn.querySelector('svg');


        if (menu.style.height === '100px') {
            menu.style.height = '0';
            menu.style.padding = '0';
            menuUl.style.display = 'none';
        } else {
            menu.style.height = '100px';
            menu.style.padding = '10px';
            setTimeout(() => {
                menuUl.style.display = 'flex';
            }, 150);
        }

        svgElement.classList.toggle('rotated');
    });
    
    document.addEventListener('click', function(event) {
        let menu = document.getElementById('filter-dropdown-menu');
        let menuUl = menu.querySelector("ul");
        let button = document.getElementById('filter-btn');
        const svgElement = button.querySelector('svg');

        if (!menu.contains(event.target) && !button.contains(event.target)) {
            menu.style.height = '0';
            menu.style.padding = '0';
            menuUl.style.display = 'none';
            svgElement.classList.remove('rotated');
        }
    });
});