---

# Bloglist Frontend — Part 5 (Fullstack Open)

Aplikasi frontend untuk latihan **Part 5**: autentikasi (login), penggunaan **JWT token** pada request yang dilindungi, **persist sesi** dengan `localStorage`, dan **notifikasi** (sukses/gagal).

## 🎯 Tujuan Pembelajaran

* 5.1: Menambahkan **login form** dan logika dasar autentikasi.
* 5.2: **Persist login** menggunakan `localStorage` + tombol **Logout**.
* 5.3: Mengirim **Authorization: Bearer <token>** saat membuat data baru.
* 5.4: Menampilkan **notifikasi** untuk feedback user (sukses/gagal).

## 🧱 Tech Stack

* **React** (Vite/CRA) + Hooks (`useState`, `useEffect`)
* **Axios** untuk HTTP request
* **Local Storage** untuk persistensi sesi
* (Opsional) **ESLint** untuk linting

## 📁 Struktur Proyek (ringkas)

```
bloglist-frontend/
├─ src/
│  ├─ components/
│  │  ├─ LoginForm.jsx
│  │  └─ Notification.jsx
│  ├─ services/
│  │  ├─ login.js        # POST /api/login
│  │  └─ notes.js|blogs.js
│  ├─ App.jsx
│  └─ main.jsx
├─ public/
├─ .gitignore            # pastikan node_modules, build, dsb di-ignore
└─ package.json
```

## 🔌 Prasyarat Backend

* Backend (Part 4) berjalan dan menyediakan endpoint:

  * `POST /api/login` → mengembalikan `{ token, username, name, ... }`
  * `GET /api/notes` atau `GET /api/blogs`
  * `POST /api/notes` atau `POST /api/blogs` (membutuhkan **Bearer token**)
* Atur `baseUrl` di service (`/api/...`) sesuai proxy/dev server Bos.

## 🚀 Menjalankan Secara Lokal

```bash
# install dependencies
npm install

# jalankan dev server
npm run dev
```

Buka `http://localhost:5173` (atau sesuai port yang tertera di terminal).

## 🔐 Alur Autentikasi (ringkas)

1. User login → frontend memanggil `POST /api/login`.
2. Respons berisi `token` + info user → disimpan ke state & **localStorage**.
3. Frontend memanggil `setToken(token)` di service data.
4. Setiap `create()` (POST) otomatis menyertakan header:

   ```
   Authorization: Bearer <token>
   ```
5. Saat refresh, `useEffect` mem-**restore** `user` dari `localStorage` dan memanggil `setToken` lagi.
6. Logout → hapus item `localStorage` dan reset state `user`.

## ✨ Fitur Utama

* **Login Form** dengan controlled inputs.
* **Conditional Rendering**:

  * Belum login → tampil form login.
  * Sudah login → tampil konten + form tambah data.
* **Persistensi**: `localStorage` (`loggedNoteappUser`) + auto-restore (`useEffect`).
* **Protected Create**: header **Authorization** pada `axios.post`.
* **Notifications**: pesan sukses/gagal yang **auto-hide**.

## ⚙️ Script NPM (contoh umum)

```bash
npm run dev        # jalankan development server
npm run build      # produk build
npm run preview    # pratinjau hasil build
```

## 🧪 Uji Mandiri (checklist)

* 5.1: Submit kredensial benar → UI menampilkan “logged in”; salah → pesan error singkat.
* 5.2: Login → refresh halaman → tetap login; Logout → kembali ke form login.
* 5.3: Setelah login, menambah data → berhasil; request POST menyertakan `Authorization`.
* 5.4: Aksi sukses/gagal → muncul notifikasi → hilang otomatis.

## 🛠️ Troubleshooting

* **401 saat create()**: pastikan `setToken(user.token)` dipanggil setelah login **dan** saat restore dari `localStorage`.
* **Form login tidak muncul**: periksa render kondisional (`!user && ...`) dan helper **mengembalikan JSX** (gunakan `return (...)` atau `(...)`).
* **CRLF/LF warnings (Windows)**: set auto EOL bila perlu:

  ```bash
  git config core.autocrlf true   # atau input
  ```

## 🔒 Catatan Keamanan

Menyimpan token di `localStorage` **mudah** tapi berisiko jika terjadi **XSS**. Alternatif: **httpOnly cookies** (lebih aman terhadap XSS, setup lebih kompleks—perlu mitigasi CSRF). Apa pun modelnya, pertahanan XSS tetap krusial.

## 📦 Submission Notes (Repo Struktur)

Sesuai template instruktur:

```
part5/
  bloglist-frontend/
    (seluruh source, TANPA node_modules)
```

## 📄 Lisensi

Materi berdasarkan Fullstack Open — gunakan untuk keperluan pembelajaran.

--
