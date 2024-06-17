const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   //Write your code here

//   let bookList = JSON.stringify(books, null, 2);

//   return res.status(200).json({ books: bookList });
// });

// Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 2));
  })
  .then(bookList => {
    return res.status(200).json({ books: bookList });
  })
  .catch(error => {
    return res.status(500).json({ message: "Error retrieving book list" });
  });
});

// Get the book list available in the shop using async-await with Axios
public_users.get('/axios', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:3000'); // Adjust the URL to match your server's URL
    const bookList = JSON.stringify(response.data.books, null, 2);
    return res.status(200).json({ books: bookList });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;

//   if (books[isbn]) {
//     return res.status(200).json(books[isbn]);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ message: "Book not found" });
    }
  })
  .then(book => {
    return res.status(200).json(book);
  })
  .catch(error => {
    return res.status(404).json(error);
  });
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:3000/book/${isbn}`); // Adjust the URL to match your server's URL
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      return res.status(500).json({ message: "Error retrieving book details" });
    }
  }
});

// public_users.get('/author/:author', function (req, res) {
//   //Write your code here
//   const author = req.params.author;

//   const booksByAuthor = Object.values(books).filter(book => book.author === author);

//   if (booksByAuthor.length > 0) {
//     return res.status(200).json({ books: booksByAuthor });
//   } else {
//     return res.status(404).json({ message: "Books by the specified author not found" });
//   }
// });

// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject({ message: "Books by the specified author not found" });
    }
  })
  .then(booksByAuthor => {
    return res.status(200).json({ books: booksByAuthor });
  })
  .catch(error => {
    return res.status(404).json(error);
  });
});

// Get book details based on author using async-await with Axios
public_users.get('/author/axios/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get('http://localhost:3000'); // Adjust the URL to match your server's URL
    const booksByAuthor = Object.values(response.data.books).filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
      return res.status(200).json({ books: booksByAuthor });
    } else {
      return res.status(404).json({ message: "Books by the specified author not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});


// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   //Write your code here
//   const title = req.params.title;

//   const booksByTitle = Object.values(books).filter(book => book.title === title);

//   if (booksByTitle.length > 0) {
//     return res.status(200).json({ books: booksByTitle });
//   } else {
//     return res.status(404).json({ message: "Books with the specified title not found" });
//   }
// });

// Get book details based on title using async-await with Axios
public_users.get('/title/axios/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get('http://localhost:3000'); // Adjust the URL to match your server's URL
    const booksByTitle = Object.values(response.data.books).filter(book => book.title === title);

    if (booksByTitle.length > 0) {
      return res.status(200).json({ books: booksByTitle });
    } else {
      return res.status(404).json({ message: "Books with the specified title not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json({ reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
