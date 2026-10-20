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
npm run preview # Tayyor yig‘ilmani 3000-portda tekshirish
npm test        # Brauzer tekshiruvlari; avval dev serverni ishga tushiring
npm run test:standalone # Mustaqil HTML va sandbox iframe tekshiruvi
```

Playwright tekshiruvlari muhitdagi `/usr/bin/chromium` brauzeridan foydalanadi. Boshqa tizimda `playwright.config.ts` dagi `executablePath` ni moslang yoki Playwright brauzerini o‘rnating.

`standalone/index.html` saytning barcha skriptlari, stillari, shriftlari va rasmlarini o‘z ichiga oladi. Faylni serversiz va internetsiz brauzerda ochish mumkin. Dizayn va funksiyalar asosiy sayt bilan bir xil. `index.html` manba fayli esa Vite serveri orqali ochiladi; uni alohida HTML sifatida ko‘rsatish ishlamaydi.

## Imkoniyatlar

- Mobil menyu, uchta bosh slayd, mahsulotlar filtri va batafsil oynalar.
- Plita/poydevor va silindrsimon ustun uchun beton hajmi, 10% zaxira va noto‘g‘ri qiymatlarni tekshirish.
- Kalkulyator yoki mahsulotdan so‘rov shakliga ma’lumot uzatish.
- Shakl tekshiruvi, matnni nusxalash va so‘rovni `.txt` fayl sifatida yuklab olish.
- Klaviatura navigatsiyasi, dialoglarda fokusni boshqarish va harakatni kamaytirish sozlamasi.

## Haqiqiy ma’lumotlar va nashr qilish

Asl `qarshibetonklaster.uz` sayti ishlab chiqish muhitidan 403 tarmoq cheklovi sabab ochilmadi. Matnlar, mahsulot yo‘nalishlari va arxitektura tasviri yangi dizayn konsepsiyasidir; ular korxonaning tasdiqlangan katalogi yoki amalga oshirgan loyihalari sifatida ko‘rsatilmaydi. Bosh rasm sun’iy intellekt yordamida yaratilgan arxitektura konsepsiyasi, mahsulot rasmlari esa SVG illyustratsiyalar.

Telefon, aniq manzil, narxlar va korxona statistikasi o‘ylab topilmagan. Haqiqiy ma’lumotlar olingach `src/App.tsx` dagi mahsulotlar va aloqa bo‘limini yangilang.

So‘rovlar serverga avtomatik yuborilmaydi. Ular brauzerda tayyorlanadi; foydalanuvchi faylni rasmiy aloqa kanali orqali yuborishi mumkin. Telegram, CRM yoki elektron pochta orqali yuborish uchun alohida server integratsiyasi talab qilinadi. Maxfiy tokenlarni brauzer kodiga kiritmang.

Nashr qilish uchun `npm run build` buyrug‘idan keyin `dist/` katalogini statik hostingga joylashtiring. Ushbu ish jarayonida tashqi hostingga nashr qilinmagan va domen sozlamalari o‘zgartirilmagan.
