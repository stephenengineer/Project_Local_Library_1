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
  // const getBorrowedBooks = require("./books"); <= No longer needed because I imported books.js into index.html.
  return partitionBooksByBorrowedStatus(books)[0].length;
}

// Made a very applicable helper function for shortening the results lengths in books.js, so I will
// export that into here for the last 3 functions
// const shortenResults = require("./books").shortenResults; <= No longer needed because I imported books.js into index.html.

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
