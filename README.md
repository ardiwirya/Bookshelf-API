# Bookshelf API

RESTful API untuk mengelola data buku (CRUD), dibangun sebagai submission kelas [Belajar Membuat Aplikasi Back-End untuk Pemula](https://www.dicoding.com/academies/261) — Dicoding. Submission ini mendapat rating **5/5**.

## Tech Stack

- **Node.js** — runtime JavaScript
- **Hapi** (`@hapi/hapi`) — web framework untuk membangun REST API
- **nanoid** — generator ID unik
- **ESLint** (Airbnb Base config) — code linting
- **Newman + Postman** — automated API testing

## Struktur Proyek

```
bookshelf-api/
├── src/
│   ├── server.js     # Konfigurasi & inisialisasi server Hapi (port 9000)
│   ├── routes.js     # Definisi endpoint
│   ├── handler.js    # Business logic tiap endpoint
│   └── books.js      # Penyimpanan data buku (in-memory)
├── Bookshelf API Test.postman_collection.json
├── Bookshelf API Test.postman_environment.json
├── .eslintrc.json
└── package.json
```

## Instalasi

```bash
npm install
```

## Menjalankan Aplikasi

```bash
npm run start
```

Server berjalan di `http://localhost:9000`.

Untuk mode development dengan auto-reload:

```bash
npm run start-dev
```

## Endpoint API

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/books` | Menambahkan buku baru |
| GET | `/books` | Menampilkan seluruh buku (mendukung query filter) |
| GET | `/books/{id}` | Menampilkan detail satu buku |
| PUT | `/books/{id}` | Memperbarui data buku |
| DELETE | `/books/{id}` | Menghapus buku |

### POST /books

Body request:

```json
{
  "name": "Buku A",
  "year": 2010,
  "author": "John Doe",
  "summary": "Lorem ipsum dolor sit amet",
  "publisher": "Dicoding Indonesia",
  "pageCount": 100,
  "readPage": 25,
  "reading": false
}
```

Validasi:
- `name` wajib diisi → jika kosong, response `400` dengan pesan *"Gagal menambahkan buku. Mohon isi nama buku"*.
- `readPage` tidak boleh lebih besar dari `pageCount` → jika dilanggar, response `400` dengan pesan *"Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"*.
- Buku berhasil ditambahkan → response `201` dengan `data.bookId`.
- Atribut `finished` otomatis diisi `true` jika `readPage === pageCount`.
- Server otomatis menambahkan `id`, `insertedAt`, dan `updatedAt`.

### GET /books

Mendukung filter melalui query parameter, dapat dikombinasikan:

| Query | Contoh | Keterangan |
|---|---|---|
| `name` | `?name=dicoding` | Filter berdasarkan nama buku (case-insensitive, partial match) |
| `reading` | `?reading=1` atau `?reading=0` | Filter buku yang sedang/tidak sedang dibaca |
| `finished` | `?finished=1` atau `?finished=0` | Filter buku yang sudah/belum selesai dibaca |

Response hanya menampilkan `id`, `name`, dan `publisher` untuk tiap buku.

### GET /books/{id}

Mengembalikan detail lengkap satu buku. Response `404` jika `id` tidak ditemukan.

### PUT /books/{id}

Body request sama seperti POST. Validasi sama seperti penambahan buku, ditambah pengecekan `id` — response `404` jika `id` tidak ditemukan.

### DELETE /books/{id}

Menghapus buku berdasarkan `id`. Response `404` jika `id` tidak ditemukan.

## Pengujian

Koleksi dan environment Postman disediakan di root proyek (`Bookshelf API Test.postman_collection.json` & `Bookshelf API Test.postman_environment.json`), dapat dijalankan langsung di Postman atau via Newman:

```bash
npx newman run "Bookshelf API Test.postman_collection.json" -e "Bookshelf API Test.postman_environment.json"
```

## Linting

```bash
npm run lint
```

Menggunakan konfigurasi ESLint Airbnb Base.

## Catatan

Data disimpan secara in-memory (array di `books.js`), sehingga akan ter-reset setiap kali server direstart.
