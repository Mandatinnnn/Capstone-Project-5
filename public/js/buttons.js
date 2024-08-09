document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('#book-delete');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); 
            const bookContainer = this.closest('.book-container');
            const bookId = bookContainer.dataset.bookId;
            console.log(bookId);
            deleteBook(bookId, bookContainer);
        });
    });

    const categoryButtons = document.querySelectorAll('#book-category');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();

            const dropdown = this.nextElementSibling; 

            dropdown.classList.toggle('show');
        });
    });

    document.addEventListener('click', function(event) {
        const openDropdowns = document.querySelectorAll('.category-dropdown.show');
        openDropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target) && !dropdown.previousElementSibling.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    });

    const categoryDropdowns = document.querySelectorAll('.category-dropdown ul li a');

    categoryDropdowns.forEach(link => {
        link.addEventListener('click', function(event) {
            event.stopPropagation();

            const selectedCategory = this.dataset.category;
            const bookContainer = this.closest('.book-container');
            const bookId = bookContainer.dataset.bookId;

            updateBookCategory(bookId, selectedCategory, bookContainer);
            bookContainer.querySelector('.category-dropdown').classList.remove('show');
        });
    });
});

async function deleteBook(bookId, bookContainer) {
    try {
        const response = await fetch(`/delete-book/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            bookContainer.remove();
            alert('Book successfully deleted.');
        } else {
            alert('Failed to delete the book.');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting the book.');
    }
}

async function updateBookCategory(bookId, category, bookContainer) {
    try {
        const response = await fetch(`/update-book-category/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category })
        });

        if (response.ok) {
            bookContainer.dataset.category = category;
            alert('Book category updated successfully.');
        } else {
            alert('Failed to update book category.');
        }
    } catch (error) {
        console.error('Error updating book category:', error);
        alert('Error updating the book category.');
    }
}
