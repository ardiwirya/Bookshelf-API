const { nanoid } = require('nanoid');
const books = require('./books');

// Helper function to create an error response
function createErrorResponse(h, message, statusCode) {
  const response = {
    status: 'fail',
    message,
  };
  return h.response(response).code(statusCode);
}

// Helper function to create a success response
function createSuccessResponse(h, message, data, statusCode) {
  const response = {
    status: 'success',
    message,
    data,
  };
  return h.response(response).code(statusCode);
}

function addBookHandler(request, h) {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    return createErrorResponse(h, 'Gagal menambahkan buku. Mohon isi nama buku', 400);
  }

  if (pageCount < readPage) {
    return createErrorResponse(h, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', 400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  if (books.some((book) => book.id === id)) {
    return createSuccessResponse(h, 'Buku berhasil ditambahkan', { bookId: id }, 201);
  }

  return createErrorResponse(h, 'Buku gagal ditambahkan', 500);
}

function getAllBooksHandler(request, h) {
  const { name, reading, finished } = request.query;
  let filteredBooks = books;

  if (name) {
    const queryName = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(queryName));
  }

  if (reading) {
    const isReading = Number(reading) === 1;
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished) {
    const isFinished = Number(finished) === 1;
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  const responseData = filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher }));

  return createSuccessResponse(h, 'Success', { books: responseData }, 200);
}

function getBookByIdHandler(request, h) {
  const { id } = request.params;
  const book = books.find((book) => book.id === id);

  if (!book) {
    return createErrorResponse(h, 'Buku tidak ditemukan', 404);
  }

  return createSuccessResponse(h, 'Success', { book }, 200);
}

function editBookByIdHandler(request, h) {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return createErrorResponse(h, 'Gagal memperbarui buku. Id tidak ditemukan', 404);
  }

  if (name === undefined) {
    return createErrorResponse(h, 'Gagal memperbarui buku. Mohon isi nama buku', 400);
  }

  if (readPage > pageCount) {
    return createErrorResponse(h, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', 400);
  }

  const book = books[bookIndex];
  const updatedBook = {
    ...book,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
    finished: pageCount === readPage,
  };

  books[bookIndex] = updatedBook;

  return createSuccessResponse(h, 'Buku berhasil diperbarui', { bookId: updatedBook.id }, 200);
}

function deleteBookByIdHandler(request, h) {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    return createSuccessResponse(h, 'Buku berhasil dihapus', null, 200);
  }

  return createErrorResponse(h, 'Buku gagal dihapus. Id tidak ditemukan', 404);
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
