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
public_users.get('/', (req, res) => {
    new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("No data found.");
      }
    })
    .then((bookList) => {
      res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
  });
  

// Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn',async (req, res) => {
    try{
        let isbn = req.params.isbn
        const getData = (isbn) => {
            return new Promise((resolve, reject)=>{
                let data = books[isbn]
                if(data) resolve(data);
                else reject("No data found")
            })
        }
        const bookData = await getData(isbn)
        res.status(200).json(bookData)
    }catch(err){
        res.status(404).json({error: err})
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
      const reqAuthor = req.params.author;
  
      const getAuthor = (authorName) => {
        return new Promise((resolve, reject) => {
          const result = Object.values(books).filter(
            (book) => book.author.toLowerCase() === authorName.toLowerCase()
          );
          if (result.length > 0) {
            resolve(result);
          } else {
            reject("No data found.");
          }
        });
      };
  
      const booksByAuthor = await getAuthor(reqAuthor);
      res.status(200).json(booksByAuthor);
  
    } catch (err) {
      res.status(404).json({ error: err });
    }
  });
  
// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try{
        let reqTitle = req.params.title;
        let getTitle = (bookTitle) => {
            return new Promise((resolve, reject) => {
                let title = Object.values(books).filter((book) => {
                    return book.title.toLowerCase() == reqTitle.toLowerCase();
                })
                if(title.length > 0) resolve(title);
                else reject({message: "No data found"});
            })
        }
        let booksWithTitle = await getTitle(reqTitle);
        res.status(200).json(booksWithTitle);
    }
    catch(err){
        res.status(404).json({error: err})
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let review = books[req.params.isbn].reviews;
    if(review) return res.status(200).json(review);
  return res.status(400).json({message: "No data found"});
});

module.exports.general = public_users;
