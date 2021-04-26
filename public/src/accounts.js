function findAccountById(accounts, id) {
  let result = {};
  if (!accounts || !id) return result;
  result = accounts.find((account) => account.id === id);
  return result;
}

function sortAccountsByLastName(accounts) {
  let result = [];
  if (!accounts) return result;
  // Not sure if they would like me to sort the original array
  result = accounts;
  result.sort((account1, account2) =>
    account1.name.last.toLowerCase() > account2.name.last.toLowerCase() ? 1 : -1
  );
  return result;
}

function getTotalNumberOfBorrows(account, books) {
  let result = 0;
  if (!account || !books) return result;
  result = books.reduce(
    (total, book) =>
      total + book.borrows.filter((borrow) => borrow.id === account.id).length,
    result
  );
  return result;
}

// Helper function to get list of books checked out under an account id
function getBooksUnderId(accountId, books) {
  return books.filter((book) =>
    book.borrows.some((borrow) => borrow.id === accountId && !borrow.returned)
  );
}

function getBooksPossessedByAccount(account, books, authors) {
  let result = [];
  if (!account || !books || !authors) return result;
  const { id } = account;
  const listOfBooks = getBooksUnderId(id, books);
  result = listOfBooks.map((book) => {
    const author = authors.find((author) => author.id === book.authorId);
    return { ...book, author };
  });
  return result;
}

module.exports = {
  findAccountById,
  sortAccountsByLastName,
  getTotalNumberOfBorrows,
  getBooksPossessedByAccount,
};
