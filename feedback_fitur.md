# Rencana Fitur User Feedback pada RAG & Cara Meningkatkan Evaluasinya

Menambahkan fitur *feedback loop* adalah langkah krusial untuk mengubah RAG dari sekadar "mesin pencari pintar" menjadi "sistem pakar yang terus belajar".

Berikut adalah rancangan arsitektur dan strategi untuk mengimplementasikannya, sekaligus cara memanfaatkan data *feedback* tersebut untuk meningkatkan kualitas RAG secara nyata.

---

## 1. Rancangan Fitur Feedback (Architecture Plan)

### A. Struktur Database (Backend)
Sistem tidak hanya butuh menyimpan *rating* (Thumbs Up 👍 / Thumbs Down 👎), tapi yang paling penting adalah **menyimpan konteks dokumen saat AI menjawab**. 

Kita perlu membuat tabel baru, misalnya bernama `rag_feedbacks` di PostgreSQL:
- `id` (UUID, Primary Key)
- `user_id` (FK ke tabel User)
- `user_query` (Pertanyaan asli dari user)
- `ai_response` (Jawaban yang diberikan oleh RAG/AI saat itu)
- `retrieved_contexts` (JSONB) 👉 **SANGAT PENTING:** Simpan ringkasan isi atau ID dari *chunks* (potongan teks/halaman) yang ditarik dari Vector DB dan disuapkan ke prompt AI pada detik itu.
- `rating` (Integer: `1` untuk Upvote, `-1` untuk Downvote)
- `category` (String opsional, misal: "Tidak Relevan", "Informasi Salah", "Palsu/Halusinasi")
- `user_comment` (Komentar atau alasan dari user)
- `created_at` (Timestamp)

### B. Perubahan Alur (Frontend & API)
1. **Frontend UI/UX:** Di setiap pesan balasan AI, tambahkan tombol interaktif 👍 dan 👎 di pojok bawah pesan. Jika user menekan 👎 (Downvote), munculkan kotak input teks kecil bertuliskan *"Bantu kami jadi lebih baik: Apa yang kurang tepat dari jawaban ini?"* beserta pilihan dropdown kategori *error*.
2. **Backend API:**
   - Buat *endpoint* `POST /api/chat/feedback` untuk menerima data rating & komentar dari frontend dan menyimpannya ke tabel `rag_feedbacks`.
   - Buat *endpoint* `GET /api/admin/feedbacks` untuk menyajikan data di Dashboard Admin, sehingga admin/developer bisa melihat daftar pertanyaan yang paling sering mendapat rating buruk.

---

## 2. Strategi Meningkatkan RAG dari Data Feedback

Jika Anda hanya mengumpulkan *feedback* tanpa dianalisa, sistem RAG tidak akan membaik. *Feedback* dengan rating `-1` (Downvote) adalah "harta karun" evaluasi Anda. 

Lakukan evaluasi berkala (misalnya seminggu sekali) menggunakan metode **Root Cause Analysis (Analisis Akar Masalah)**. Buka *dashboard admin* Anda, lihat daftar *Downvote*, dan secara spesifik **periksa kolom `retrieved_contexts`** untuk setiap *error*. 

Pada dasarnya, akan selalu ada 3 kemungkinan penyebab utama kenapa user menekan Downvote:

### Kasus A: *Retrieval Failure* (Konteks Gagal Ditarik)
- **Gejala:** User bertanya soal "Syarat Roya", tapi `retrieved_contexts` malah berisi sekumpulan teks tentang "Pendaftaran Tanah Pertama" atau dokumen irrelevan lainnya.
- **Akar Masalah:** Sistem Pencarian (Vector Search) Anda bermasalah alias rabun.
- **Solusi Taktis:**
  - **Ubah Strategi Chunking:** Mungkin teks aslinya terpotong di tengah kalimat sehingga konteks utuhnya hilang. Coba evaluasi ukuran `chunk_size` dan `chunk_overlap` di script upload dokumen.
  - **Ganti Model Embedding:** Model embedding Anda saat ini mungkin kurang akurat menangkap kedekatan makna bahasa spesifik (misal bahasa hukum/agraria). Coba benchmark dengan model embedding lain.
  - **Implementasi Hybrid Search:** Vector Search (*Dense Retrieval*) sering gagal pada pencarian akronim atau kata kunci persis. Gabungkan Vector Search Anda dengan pencarian keyword tradisional (*Keyword Search* seperti BM25 / PostgreSQL Full Text Search), lalu lakukan *Reranking*.

### Kasus B: *Generation Failure* / Halusinasi (Konteks Benar, AI Malah Salah Jawab)
- **Gejala:** Dokumen yang ditarik ke dalam `retrieved_contexts` **sudah benar** berisi syarat Roya, tapi AI malah menjawab ngawur, berhalusinasi menyisipkan syarat fiktif, atau menolak menjawab.
- **Akar Masalah:** LLM Gagal menangkap instruksi atau "Sok Tahu".
- **Solusi Taktis:**
  - **Prompt Engineering:** Perketat *System Prompt* Anda. Tambahkan instruksi sistematis seperti: *"ANDA HANYA BOLEH MENJAWAB BERDASARKAN KONTEKS YANG DIBERIKAN. JIKA TIDAK ADA DI KONTEKS, KATAKAN 'Data belum tersedia di dokumen referensi'. DILARANG KERAS MENGARANG JAWABAN."*
  - **Ganti LLM:** Jika model LLM saat ini (misal versi kecil) sering "ngeyel" atau mengabaikan prompt ketat, evaluasi penggunaan LLM yang punya *instruction-following* lebih baik.

### Kasus C: *Knowledge Gap* (Dokumen Memang Belum Ada di Database)
- **Gejala:** User bertanya masalah sangat spesifik (misal: kasus sengketa langka). RAG mencoba menarik dokumen sebisa mungkin, tapi setelah admin mengecek aslinya, memang **belum ada** SOP, Peraturan, atau dokumen sama sekali di dalam database sistem yang membahas hal tersebut.
- **Solusi Taktis:** Ini adalah *insight* bisnis yang maha penting! Admin sekarang tahu secara presisi apa *Blind Spot* dari sistemnya. Admin/Ahli bisa segera merumuskan SOP/Dokumen baru tentang topik tersebut, lalu meng-uploadnya ke sistem (menjadi Embeddings baru) agar AI ke depannya *"langsung pintar"* bisa menjawab pertanyaan sejenis tanpa merubah code apapun.

---

## 3. Otomatisasi Evaluasi (The "Golden Dataset") 
*(Langkah Mahir / Advanced)*

Ketika *Downvote* sudah terkumpul banyak (misalnya 100+ pertanyaan dan konteks yang gagal dijawab), bekukan database tersebut dan jadikan sebagai **"Dataset Ujian" (Golden Dataset)**.

Ketika tim Anda melakukan *upgrade* sistem (misalnya: mencoba ganti model AI dari Qwen ke GPT-4, atau merombak cara *chunking* PDF):
1. Anda tidak perlu menebak-nebak (feeling) apakah *upgrade* itu sukses atau tidak.
2. Anda tinggal menjalankan *script evaluasi otomatis* (misal pakai framework seperti Ragas atau TrueLens). Script tersebut akan **melemparkan 100 "Pertanyaan Susah" masalalu tersebut secara otomatis** ke sistem RAG versi baru.
3. Gunakan LLM besar (sebagai juri / *LLM-as-a-Judge*) untuk menilai jawaban dari versi RAG baru. Jika *Pass Rate* (Tingkat Kelulusan) naik dari 60% menjadi 85%, maka *upgrade* tersebut terbukti berhasil secara kuantitatif sebelum dibawa ke tahap Production.
