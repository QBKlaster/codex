# Qarshi Beton Klaster

O‘zbek tilidagi, telefon va kompyuter ekranlariga mos React + TypeScript sayti. Barcha rasmlar, ikonalar va shriftlar loyiha bilan birga yuklanadi.

## Ishga tushirish

Node.js 22 yoki undan yangi versiya va npm kerak. Muhitda Node.js 24 bilan tekshirilgan.

```sh
cd /workspace/codex
npm ci
npm run dev
```

Vite 3000-portda barcha interfeyslarni tinglaydi. Boshqa joyga o‘rnatilganda loyiha katalogiga kiring.

```sh
npm run build   # TypeScript tekshiruvi va dist/ yig‘ilmasi
npm run build:standalone # Dizaynni o‘zgartirmasdan bitta mustaqil HTML fayl
npm run build:pages # GitHub Pages uchun asosiy index.html faylini yangilash
npm run preview # Tayyor yig‘ilmani 3000-portda tekshirish
npm test        # Brauzer tekshiruvlari; avval dev serverni ishga tushiring
npm run test:standalone # Mustaqil HTML va sandbox iframe tekshiruvi
npm run test:pages # Tayyor saytni /codex/ manzilida oddiy statik server bilan tekshirish
```

Playwright tekshiruvlari muhitdagi `/usr/bin/chromium` brauzeridan foydalanadi. Boshqa tizimda `playwright.config.ts` dagi `executablePath` ni moslang yoki Playwright brauzerini o‘rnating.

`standalone/index.html` saytning barcha skriptlari, stillari, shriftlari va rasmlarini o‘z ichiga oladi. Faylni serversiz va internetsiz brauzerda ochish mumkin. Dizayn va funksiyalar asosiy sayt bilan bir xil.

Ishlab chiqish uchun Vite `src/index.html` faylidan foydalanadi. Repozitoriy asosidagi `index.html` esa `npm run build:pages` orqali yaratilgan, GitHub Pages uchun tayyor mustaqil sahifadir. Uni qo‘lda tahrirlamang; `src/` ichidagi kodni o‘zgartirgach `npm run build:pages` ni bajaring va yangilangan `index.html` ni commit qiling.

GitHub Pages: **Settings → Pages → Deploy from a branch → main → / (root)**. Asosiy sahifa barcha resurslarni o‘z ichiga olgani uchun `https://qbklaster.github.io/codex/` manzilida `/assets` yoki `/src` yo‘llariga bog‘lanmaydi. `.nojekyll` fayli tayyor sahifani o‘zgartirmasdan nashr qilishni ta’minlaydi.

## Imkoniyatlar

- Mobil menyu, uchta bosh slayd, mahsulotlar filtri va batafsil oynalar.
- Plita/poydevor va silindrsimon ustun uchun beton hajmi, 10% zaxira va noto‘g‘ri qiymatlarni tekshirish.
- Kalkulyator yoki mahsulotdan so‘rov shakliga ma’lumot uzatish.
- Shakl tekshiruvi, matnni nusxalash va so‘rovni `.txt` fayl sifatida yuklab olish.
- Klaviatura navigatsiyasi, dialoglarda fokusni boshqarish va harakatni kamaytirish sozlamasi.
- Satrma-satr ochiladigan sarlavha, aylantirishda ketma-ket paydo bo‘ladigan bo‘limlar, kompyuterda kursor bilan yengil 3D harakat va tugma effektlari.
- Kalkulyator natijasining silliq o‘zgarishi; ekran o‘quvchisi va so‘rov shakli doimo aniq yakuniy qiymatni oladi. Qurilmada harakatni kamaytirish yoqilsa, animatsiyalar o‘chadi.

## Haqiqiy ma’lumotlar va nashr qilish

Asl `qarshibetonklaster.uz` sayti ishlab chiqish muhitidan 403 tarmoq cheklovi sabab ochilmadi. Matnlar, mahsulot yo‘nalishlari va arxitektura tasviri yangi dizayn konsepsiyasidir; ular korxonaning tasdiqlangan katalogi yoki amalga oshirgan loyihalari sifatida ko‘rsatilmaydi. Bosh rasm sun’iy intellekt yordamida yaratilgan arxitektura konsepsiyasi, mahsulot rasmlari esa SVG illyustratsiyalar.

Telefon, aniq manzil, narxlar va korxona statistikasi o‘ylab topilmagan. Haqiqiy ma’lumotlar olingach `src/App.tsx` dagi mahsulotlar va aloqa bo‘limini yangilang.

So‘rovlar serverga avtomatik yuborilmaydi. Ular brauzerda tayyorlanadi; foydalanuvchi faylni rasmiy aloqa kanali orqali yuborishi mumkin. Telegram, CRM yoki elektron pochta orqali yuborish uchun alohida server integratsiyasi talab qilinadi. Maxfiy tokenlarni brauzer kodiga kiritmang.

GitHub Pages uchun `npm run build:pages` va `npm run test:pages` buyruqlaridan keyin asosiy `index.html` va `.nojekyll` fayllarini `main` tarmog‘iga yuboring. Mustaqil HTML boshqa statik hostinglarda ham ishlaydi. `npm run build` yaratgan `dist/` esa domenning asosiy yo‘lida xizmat ko‘rsatadigan odatiy statik hosting uchun mo‘ljallangan. Maxsus domen sozlamalari o‘zgartirilmagan.
