const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username && password){
    if(!isValid(username)){
        users.push({
        "username": username,
        "password": password,
        })
        return res.status(200).json({message: "User registered successfully. Now you can login."});
    }else{
        return res.status(400).json({message: "User already exist."})
    }
  }else{
    return res.status(400).json({message: "Username or password is not entered."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 3))
  return res.status(200).send(JSON.stringify(books, null, 3));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let data = books[isbn];
  if(data){
    return res.status(200).json(data);
  }
  return res.status(400).json({message: "No data found."});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = Object.values(books).filter((book) => {
    return book.author == req.params.author;
  })
  if(author.length > 0) return res.status(200).json(author);
  return res.status(400).json({message: "No data found."});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = Object.values(books).filter((book) => {
    return book.title == req.params.title;
  })
  if(title.length > 0) return res.status(200).json(title);
  return res.status(400).json({message: "No data found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let review = books[req.params.isbn].reviews;
    if(review) return res.status(200).json(review);
  return res.status(400).json({message: "No data found"});
});

module.exports.general = public_users;
