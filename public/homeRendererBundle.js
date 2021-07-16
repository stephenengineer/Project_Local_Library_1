(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {
  getTotalBooksCount,
  getTotalAccountsCount,
  getBooksBorrowedCount,
  getMostCommonGenres,
  getMostPopularBooks,
  getMostPopularAuthors,
} = require("../src/home");

function renderTotalBooks() {
  const count = getTotalBooksCount(books);
  if (typeof count !== "number") return;

  const span = document.querySelector("#total-book-count");
  span.innerHTML = count;
}

function renderBooksBorrowed() {
  const count = getBooksBorrowedCount(books);
  if (typeof count !== "number") return;

  const span = document.querySelector("#total-borrow-count");
  span.innerHTML = count;
}

function renderTotalAccounts() {
  const count = getTotalAccountsCount(accounts);
  if (typeof count !== "number") return;

  const span = document.querySelector("#total-accounts-count");
  span.innerHTML = count;
}

function rendergetMostCommonGenres() {
  const result = getMostCommonGenres(books);
  if (typeof result !== "object") return;

  const lis = result
    .map((genre) => {
      return `<li class="list-group-item">${genre.name} <span class="text-primary">(${genre.count})</span></li>`;
    })
    .join("");

  const ul = document.querySelector("#most-common-genres");
  ul.innerHTML = lis;
}

function rendergetMostPopularBooks() {
  const result = getMostPopularBooks(books);
  if (typeof result !== "object") return;

  const lis = result
    .map((book) => {
      return `<li class="list-group-item">${book.name} <span class="text-primary">(${book.count} borrows)</span></li>`;
    })
    .join("");

  const ul = document.querySelector("#most-popular-books");
  ul.innerHTML = lis;
}

function rendergetMostPopularAuthors() {
  const result = getMostPopularAuthors(books, authors);
  if (typeof result !== "object") return;

  const lis = result
    .map((author) => {
      return `<li class="list-group-item">${author.name} <span class="text-primary">(${author.count} borrows)</span></li>`;
    })
    .join("");

  const ul = document.querySelector("#most-popular-authors");
  ul.innerHTML = lis;
}

function render() {
  renderTotalBooks();
  renderBooksBorrowed();
  renderTotalAccounts();
  rendergetMostCommonGenres();
  rendergetMostPopularBooks();
  rendergetMostPopularAuthors();
}

document.addEventListener("DOMContentLoaded", render);

},{"../src/home":3}],2:[function(require,module,exports){
// helper function to find either author or book by ID
function findAuthorOrBookById(objects, id) {
  return objects.find((object) => object.id === id);
}

function findAuthorById(authors, id) {
  let result = {};
  if (!authors || !id) return result;
  result = findAuthorOrBookById(authors, id);
  return result;
}

function findBookById(books, id) {
  let result = {};
  if (!books || !id) return result;
  result = findAuthorOrBookById(books, id);
  return result;
}

function partitionBooksByBorrowedStatus(books) {
  let result = [];
  if (!books) return result;
  let loaned = [];
  let returned = [];
  result = [loaned, returned];
  books.map((book) => {
    if (book.borrows.every((borrow) => borrow.returned)) returned.push(book);
    else loaned.push(book);
  });
  return result;
}

// helper function to shorten results array to desired length
function shortenResults(results, size) {
  if (results.length > size) {
    const shortenedResult = [];
    results.forEach((result, index) => {
      if (index < size) shortenedResult.push(result);
    });
    return shortenedResult;
  }
  return results;
}

function getBorrowersForBook(book, accounts) {
  let results = [];
  if (!book || !accounts) return results;
  results = book.borrows.map((borrow) => {
    const borrower = accounts.find((account) => account.id === borrow.id);
    return { ...borrow, ...borrower };
  });
  return shortenResults(results, 10);
}

module.exports = {
  findAuthorById,
  findBookById,
  partitionBooksByBorrowedStatus,
  getBorrowersForBook,
  shortenResults,
};

},{}],3:[function(require,module,exports){
// helper function to get total number of any items in an array
const getTotal = (objectArray) => objectArray.length;

function getTotalBooksCount(books) {
  if (!books) return null;
  return getTotal(books);
}

function getTotalAccountsCount(accounts) {
  if (!accounts) return null;
  return getTotal(accounts);
}

function getBooksBorrowedCount(books) {
  if (!books) return null;
  // We'll leverage the function we built in books.js that has this info
  const getBorrowedBooks = require("./books");
  return getBorrowedBooks.partitionBooksByBorrowedStatus(books)[0].length;
}

// Made a very applicable helper function for shortening the results lengths in books.js, so I will
// export that into here for the last 3 functions
const shortenResults = require("./books").shortenResults;

// The last 3 functions all involve sorting the results and shortening the list, so I will make that a function.
const sortAndShorten = (resultsArray, size) => {
  resultsArray.sort((result1, result2) =>
    result1.count - result2.count > 0 ? -1 : 1
  );
  return shortenResults(resultsArray, size);
};

function getMostCommonGenres(books) {
  let results = [];
  if (!books) return results;
  // For each book, if the book.genre exists in the results array, find that object in the results array.
  // Then increment the object's count property.
  books.forEach((book) => {
    if (results.some((result) => result.name === book.genre)) {
      results.find((result) => result.name === book.genre).count++;
    } else {
      // If it doesn't exist in the result array, create an object with name and count 1.
      const tempObject = { name: book.genre, count: 1 };
      results.push(tempObject);
    }
  });
  return sortAndShorten(results, 5);
}

function getMostPopularBooks(books) {
  let results = [];
  if (!books) return results;
  // For each book, create an object in the results array.
  // {name: book.title, count: book.borrows.length}
  results = books.map((book) => {
    const tempObject = { name: book.title, count: book.borrows.length };
    return tempObject;
  });
  return sortAndShorten(results, 5);
}

// It returns an array containing five objects or fewer that represents the most popular authors whose books
// have been checked out the most. Popularity is represented by finding all of the books written by the author
// and then adding up the number of times those books have been borrowed.
function getMostPopularAuthors(books, authors) {
  let results = [];
  if (!books || !authors) return results;
  results = authors.map((author) => {
    const tempObject = {
      name: `${author.name.first} ${author.name.last}`,
      count: books
        .filter((book) => book.authorId === author.id)
        .reduce((total, book) => total + book.borrows.length, 0),
    };
    // console.log(tempObject);
    return tempObject;
  });
  return sortAndShorten(results, 5);
}

module.exports = {
  getTotalBooksCount,
  getTotalAccountsCount,
  getBooksBorrowedCount,
  getMostCommonGenres,
  getMostPopularBooks,
  getMostPopularAuthors,
};

},{"./books":2}]},{},[1]);
