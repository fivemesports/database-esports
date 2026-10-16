# fivemesports.id

Dashboard independen untuk analitik server FiveM, dengan desain premium hitam/putih/merah. Logo yang diberikan berada di `public/logo.png`; ikon antarmuka menggunakan SVG dari Lucide.

## Fitur
- Menemukan server publik secara otomatis melalui integrasi paket `cfx-api` dengan daftar publik Cfx.re; tidak perlu memasukkan ID server secara manual.
- Ranking global, Top 3 per negara, pencarian server, dan perbandingan jumlah pemain dua server.
- Refresh antarmuka setiap 60 detik dengan cache API.
- Integrasi Supabase untuk menyimpan snapshot dan membaca riwayat.
- View SQL `monthly_country_top10` untuk Top 10 server per negara per bulan, diurutkan berdasarkan rata-rata pemain yang tercatat.
- Tidak membuat angka live atau riwayat palsu. Data historis mulai terkumpul setelah snapshot pertama dijalankan.

## Setup Supabase

1. Buat project di [Supabase](https://supabase.com/).
2. Buka **SQL Editor**, lalu jalankan seluruh isi `supabase/schema.sql`. Ini membuat tabel `server_snapshots`, indeks, RLS, dan view `monthly_country_top10`.
3. Di Supabase **Project Settings → API**, salin Project URL dan `service_role` key. Key ini rahasia dan hanya boleh dipasang di environment server.
4. Di Vercel → project → **Settings → Environment Variables**, tambahkan:
   - `SUPABASE_URL` = Project URL Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY` = service-role key Supabase. Jangan beri awalan `NEXT_PUBLIC_`.
   - `CRON_SECRET` = string acak panjang yang kamu buat sendiri.
5. Deploy ulang setelah mengatur environment variables.
6. File `vercel.json` menjadwalkan `/api/snapshot` setiap hari pukul 00:00 UTC. Pastikan paket/plan Vercel yang digunakan mendukung Cron sesuai jadwal tersebut. Vercel Cron mengirim header `Authorization: Bearer <CRON_SECRET>` ketika environment variable `CRON_SECRET` tersedia.
7. Setelah deployment, cek `/api/servers`, `/api/history?days=30`, dan `/api/monthly-rankings`. Untuk menguji snapshot, tunggu jadwal Cron atau panggil `/api/snapshot` dari alat tepercaya dengan header `Authorization: Bearer <CRON_SECRET>`.

Jangan pernah memasukkan service-role key ke browser, repo publik, atau variabel `NEXT_PUBLIC_*`. Jika key sempat terekspos, segera rotasi di Supabase.

## Riwayat dan ranking bulanan

- Riwayat tidak dapat dibuat mundur; data hanya ada sejak snapshot pertama berhasil disimpan.
- Cron bawaan pada proyek ini mengambil snapshot harian agar konservatif untuk batas layanan gratis. Grafik yang rapat membutuhkan frekuensi lebih tinggi dan scheduler yang sesuai dengan batas plan serta batas upstream.
- Top 10 bulanan memakai **rata-rata jumlah pemain dari snapshot yang tercatat**, dengan jumlah puncak sebagai tie-breaker. Hasil bulan berjalan bersifat sementara sampai bulan berakhir.
- Negara diturunkan dari metadata locale publik jika tersedia; ini bukan bukti lokasi fisik server. Server yang tidak terklasifikasi tidak dipaksakan masuk negara tertentu.

## Jalankan lokal

Gunakan Node.js 20+:

```bash
npm install
npm run dev
```

## Deploy lewat GitHub dan Vercel

1. Unggah file proyek ini ke repository GitHub.
2. Import repository itu di Vercel sebagai aplikasi Next.js.
3. Atur environment variables Supabase dan `CRON_SECRET` seperti langkah di atas.
4. Deploy, lalu cek endpoint API yang disebutkan di atas.

## Catatan batasan

Daftar publik Cfx.re dapat berubah atau terkena rate limit. Integrasi bukan SLA 24/7. Jika sumber upstream gagal, API mengembalikan error dan bukan angka rekaan. Periksa juga batas kuota Supabase/Vercel sebelum meningkatkan frekuensi snapshot.

Proyek komunitas independen; tidak berafiliasi dengan Cfx.re atau Rockstar Games.
