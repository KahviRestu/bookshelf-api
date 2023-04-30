const { nanoid } = require('nanoid');
const books = require('./book');

const addBookHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  }

  const addBook = {
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

  books.push(addBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    res.code(201);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  res.code(500);
  return res;
};

const getAllBooksHandler = (req, h) => {
  const { name, reading, finished } = req.query;

  if (name) {
    const queryBookName = books.filter((book) => book.name.toLowerCase()
      .includes(name.toLowerCase()))
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    const res = h.response(
      {
        status: 'success',
        data:
        {
          books: queryBookName,
        },
      },
    );
    res.code(200);
    return res;
  }

  if (reading) {
    const queryBookReading = books.filter((book) => Number(book.reading) === Number(reading))
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    const res = h.response(
      {
        status: 'success',
        data:
        {
          books: queryBookReading,
        },
      },
    );
    res.code(200);
    return res;
  }

  if (finished) {
    const queryBookFinished = books.filter((book) => Number(book.finished) === Number(finished))
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    const res = h.response(
      {
        status: 'success',
        data:
        {
          books: queryBookFinished,
        },
      },
    );
    res.code(200);
    return res;
  }

  const res = h.response(
    {
      status: 'success',
      data:
      {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    },
  );
  res.code(200);
  return res;
};

const getBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const res = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  res.code(404);
  return res;
};

const editBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const index = books.findIndex((note) => note.id === bookId);

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

const deleteBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const index = books.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    res.code(200);
    return res;
  }
  const res = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
