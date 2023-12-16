const handlers = require('./handler');

const bookRoutes = [
  {
    method: 'POST',
    path: '/books',
    handler: handlers.addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: handlers.getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: handlers.getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: handlers.editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: handlers.deleteBookByIdHandler,
  },
];

module.exports = bookRoutes;
