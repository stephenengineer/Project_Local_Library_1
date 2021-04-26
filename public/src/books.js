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
