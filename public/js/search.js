document.querySelector('.search-bar').addEventListener('submit', function(event) {
    event.preventDefault();
    var bookId = document.querySelector('.search-bar-container .book-id').value;
    if (bookId) {
        window.location.href = `/books/${bookId}`; 
    }
});