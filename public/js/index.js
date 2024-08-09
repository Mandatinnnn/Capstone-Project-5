document.addEventListener('DOMContentLoaded', function() {
    const newBooksDots = document.querySelectorAll('.new-books .control-panel .navigation .counter svg');
    const newBooksPrevBtn = document.querySelector('.new-books .control-panel .navigation .prev-btn');
    const newBooksNextBtn = document.querySelector('.new-books .control-panel .navigation .next-btn');
    const newBooksContainer = document.querySelector('.new-books-container');

    const forYouDots = document.querySelectorAll('.for-you .control-panel .navigation .counter svg');
    const forYouPrevBtn = document.querySelector('.for-you .control-panel .navigation .prev-btn');
    const forYouNextBtn = document.querySelector('.for-you .control-panel .navigation .next-btn');
    const forYouContainer = document.querySelector('.for-you-container');

    let forYouCurrentIndex = 0;   
    const forYouContainerWidth = forYouContainer.offsetWidth + 95 - 10;

    let newBooksCurrentIndex = 0;
    const newBooksContainerWidth = newBooksContainer.offsetWidth + 110 - 10;

    function updateView() {
        const scrollAmount = forYouContainerWidth * forYouCurrentIndex;
        forYouContainer.style.transform = `translateX(-${scrollAmount}px)`;
        forYouDots.forEach((dot, index) => {
            if (index === forYouCurrentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        if (forYouCurrentIndex === 0) {
            forYouPrevBtn.disabled = true;
            forYouPrevBtn.children[0].classList.remove('active');
        } else {
            forYouPrevBtn.disabled = false;
            forYouPrevBtn.children[0].classList.add('active');
        }

        if (forYouCurrentIndex === forYouDots.length - 1) {
            forYouNextBtn.disabled = true;
            forYouNextBtn.children[0].classList.remove('active');
        } else {
            forYouNextBtn.disabled = false;
            forYouNextBtn.children[0].classList.add('active');
        }
    }

    function updateNewBooksView() {
        const scrollAmount = newBooksContainerWidth * newBooksCurrentIndex;
        newBooksContainer.style.transform = `translateX(-${scrollAmount}px)`;
        newBooksDots.forEach((dot, index) => {
            if (index === newBooksCurrentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        if (newBooksCurrentIndex === 0) {
            newBooksPrevBtn.disabled = true;
            newBooksPrevBtn.children[0].classList.remove('active');
        } else {
            newBooksPrevBtn.disabled = false;
            newBooksPrevBtn.children[0].classList.add('active');
        }

        if (newBooksCurrentIndex === newBooksDots.length - 1) {
            newBooksNextBtn.disabled = true;
            newBooksNextBtn.children[0].classList.remove('active');
        } else {
            newBooksNextBtn.disabled = false;
            newBooksNextBtn.children[0].classList.add('active');
        }
    }

    forYouNextBtn.addEventListener('click', () => {
        if (forYouCurrentIndex < forYouDots.length - 1) {
            forYouCurrentIndex++;
            updateView();
        }
    });

    forYouPrevBtn.addEventListener('click', () => {
        if (forYouCurrentIndex > 0) {
            forYouCurrentIndex--;
            updateView();
        }
    });

    newBooksNextBtn.addEventListener('click', () => {
        if (newBooksCurrentIndex < newBooksDots.length - 1) {
            newBooksCurrentIndex++;
            updateNewBooksView();
        }
    });

    newBooksPrevBtn.addEventListener('click', () => {
        if (newBooksCurrentIndex > 0) {
            newBooksCurrentIndex--;
            updateNewBooksView();
        }
    });

    updateView();
    updateNewBooksView();
});
