document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-to-my-books');

    if (addButton) {
        addButton.addEventListener('click', () => {
            const bookString = addButton.getAttribute('data-book');

            if (!bookString) {
                console.error('No book data found');
                alert('Failed to add book. No book data available.');
                return;
            }

            try {
                const book = JSON.parse(bookString);

                if (!book || !book.title) {
                    console.error('Book data is missing or invalid');
                    alert('Failed to add book. Book data is missing or invalid.');
                    return;
                }

                fetch('/add-to-my-books', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ book })
                })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            console.error('Error response text:', text);
                            throw new Error(`Network response was not ok: ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        alert('Book added to your collection!');
                    } else {
                        console.error('Failed response data:', data);
                        alert('Failed to add book. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                });
            } catch (error) {
                console.error('Error parsing book data:', error);
                alert('Failed to parse book data. Please try again.');
            }
        });
    } else {
        console.error('Add to My Books button not found');
    }
});
