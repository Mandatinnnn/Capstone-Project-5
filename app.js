const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const axios = require('axios');
const app = express();
const port = 3000;
const pool = require('./db');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: false }));

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE name = $1', [username]);
            const user = result.rows[0];
            if (user && await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, result.rows[0]);
    } catch (error) {
        done(error);
    }
});

app.use(passport.initialize());
app.use(passport.session());


app.get('/register', (req, res) => {
    res.render('user/register');
});

app.post('/register', async (req, res) => {
    const { username, password, photo_url } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await pool.query('INSERT INTO users (name, password, photo_url) VALUES ($1, $2, $3)', [username, hashedPassword, photo_url]);
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.get('/login', (req, res) => {
    res.render('user/login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('user/profile', { user: req.user });
    } else {
        res.redirect('user/login');
    }
});

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomItems(array, numItems) {
    const shuffledArray = shuffleArray(array);
    return shuffledArray.slice(0, numItems);
}


app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://openlibrary.org/search.json?q=the&limit=100'); 
        const books  = response.data.docs;
        
        const randomBooks = getRandomItems(books, 24);
        const newBooksResponse = await axios.get(`https://openlibrary.org/subjects/fantasy.json?published_in=2024`);
        const newBooksData  = newBooksResponse.data.works;

        const randomNewBooksData = getRandomItems(newBooksData, 9);
        
        res.render('index', {books: randomBooks, newBooks: randomNewBooksData});
    } catch (error) {
        console.error('Error fetching data: ', error);
        res.render('index', {books: [], newBooks: []});cd
    }
});

app.get('/list', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/login'); 
        }

        const user = req.user; 
        
        const booksResult = await pool.query('SELECT * FROM books WHERE user_id = $1', [user.id]);
        const myBooks = booksResult.rows;

        res.render('list', { myBooks });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.render('list', { myBooks: [] });
    }
});

app.post('/add-to-my-books', async (req, res) => {
    const { book } = req.body;

    if (!req.isAuthenticated || !req.isAuthenticated()) {
        console.error('User not authenticated');
        return res.status(403).json({ success: false, message: 'User not authenticated' });
    }

    try {
        const user = req.user;

        await pool.query(
            'INSERT INTO books (user_id, title, author, cover_url, rating) VALUES ($1, $2, $3, $4, $5)', 
            [user.id, book.title, book.author_name, book.cover_url, book.rating]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

app.delete('/delete-book/:id', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = req.user;
        const bookId = req.params.id;

        const deleteResult = await pool.query('DELETE FROM books WHERE title = $1 AND user_id = $2', [bookId, user.id]);

        if (deleteResult.rowCount > 0) {
            res.status(200).json({ message: 'Book deleted successfully' });
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/update-book-category/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const newCategory = req.body.category;
        const userId = req.user.id;

        await pool.query('UPDATE books SET category = $1 WHERE title = $2 AND user_id = $3', [newCategory, bookId, userId]);

        res.status(200).json({ message: 'Book category updated successfully.' });
    } catch (error) {
        console.error('Error updating book category:', error);
        res.status(500).json({ error: 'Failed to update book category.' });
    }
});

app.get('/books/:id', async (req, res) => {
    const bookId = req.params.id;
    const userId = req.user ? req.user.id : null;

    try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${bookId}`);
        const book  = response.data.docs[0];

        let isInUserList = false;
        if (userId) {
            const userBooksResult = await pool.query('SELECT * FROM books WHERE user_id = $1 AND title = $2', [userId, bookId]);
            isInUserList = userBooksResult.rowCount > 0;
        }

        const descriptionResponse = await axios.get(`https://openlibrary.org${book.key}.json`);
        let description = discriptionResponse.data.description;

        if (typeof description === 'object' && description !== null && 'value' in description) {
            description = description.value;
        } else {
            description = description;
        }

        const isAuthenticated = req.isAuthenticated();

        res.render('book-detail', { book,  description, isAuthenticated, isInUserList });
    } catch (error) {
        console.error('Error fetching book details:', error);
        res.status(500).render('500', { message: 'Internal server error' }); 
    }
});

app.get('/thriller', async (req, res) => {
    try {
        const response = await axios.get(`https://openlibrary.org/subjects/thriller.json?published_in=2023`); 
        const books  = response.data.works;
        
        res.render('thriller', {books});
    } catch (error) {
        console.error('Error fetching data: ', error);
        res.render('thriller', {books: []});
    }
});

app.get('/adventure', async (req, res) => {
    try {
        const response = await axios.get(`https://openlibrary.org/subjects/adventure.json?published_in=2023`); 
        const books  = response.data.works;
        
        res.render('adventure', {books});
    } catch (error) {
        console.error('Error fetching data: ', error);
        res.render('adventure', {books: []});
    }
});

app.get('/young_adult', async (req, res) => {
    try {
        const response = await axios.get(`https://openlibrary.org/subjects/young_adult.json?published_in=2023`); 
        const books  = response.data.works;
        
        res.render('young_adult', {books});
    } catch (error) {
        console.error('Error fetching data: ', error);
        res.render('young_adult', {books: []});
    }
});

app.get('/horror', async (req, res) => {
    try {
        const response = await axios.get(`https://openlibrary.org/subjects/horror.json?published_in=2023`); 
        const books  = response.data.works;
        
        res.render('horror', {books});
    } catch (error) {
        console.error('Error fetching data: ', error);
        res.render('horror', {books: []});
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
