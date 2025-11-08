const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => user.username == username);
    if(userswithsamename.length > 0) return true;
    else return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validUsers = users.filter((user) => {
        return (user.username == username && user.password == password);
    });

    // Return true if any valid user is found, otherwise false
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message : "Error logging in."});
  }
  if(authenticatedUser(username, password)){
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60 * 60 });
    req.session.authorization = {
        accessToken, username
    };
    return res.status(200).json({message: "User successfully logged in."})
  }else{
    return res.status(400).json({message: "Invlaid login. Check username and password!"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization["username"];
  let review = req.query.review;
  let exsistingReview = books[req.params.isbn].review[username];
  if( exsistingReview ){
    exsistingReview = review;
  }else{
    books[req.params.isbn].review[username] = review;
  }
  return res.status(300).json({message: "Review updated."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
