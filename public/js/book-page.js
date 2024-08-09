document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.book-container').forEach(container => {
        container.addEventListener('click', function() {
            const bookId = this.getAttribute('data-book-id');
            window.location.href = `/books/${bookId}`;
        });
    });
});