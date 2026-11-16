# Đạo An (Peaceful Way)

Trang tĩnh song ngữ Việt – Anh cho Đạo An, hệ thống triết lý do Kabala khởi xướng. Chỉ gồm HTML, CSS và JavaScript; mở `index.html` là chạy.

## Các trang

| Tiếng Việt | English | Nội dung |
|---|---|---|
| `index.html` | `en/index.html` | Trang chủ: "Tôi Muốn Hạnh Phúc", ba mục đích một đích đến, hai gốc khổ đau, Vòng tròn Hiếu Đạo |
| `bai-giang.html` + `bai-giang-NN-*.html` | `en/teachings.html` + `en/lesson-NN-*.html` | Mười hai bài giảng |
| `thien-an-peaceful-meditation.html` | `en/peaceful-meditation.html` | Thiền An (phương pháp bổ trợ) và đồng hồ đếm 1–6 |
| `thau-hieu-ban-than.html` | `en/know-yourself.html` | Công cụ: soi gương "Tôi" và "Muốn", điều tôi muốn, sổ Biết Đủ, điều tôi buông, vòng tròn của tôi, Cân Bằng |
| `doi-song.html` | `en/daily-life.html` | Mười tình huống đời sống |
| `vong-an.html` | `en/circles.html` | Nhịp một ngày, Lời An, cách mở Vòng An, chín cam kết |
| `sach-trang.html` | `en/whitepaper.html` | Sách trắng (in ra PDF bằng nút In) |
| `hoi-dap.html` | `en/questions.html` | Hỏi đáp và thuật ngữ |
| `lo-trinh.html` | `en/roadmap.html` | 21 ngày thực hành, tiến trình và dữ liệu của người dùng, hướng phát triển |

`gioi-thieu.html` và `en/peaceful-way.html` chuyển hướng về trang chủ để giữ địa chỉ cũ.

## Sửa nội dung

Nội dung nằm trong `src/`; các tệp HTML được sinh ra từ đó, nên hãy sửa ở `src/` rồi dựng lại:

- `src/content.*.mjs`, `src/more.*.mjs`: chữ của các trang (tệp `more` được trộn đè lên tệp `content`)
- `src/lessons.*.md`: bài giảng, mỗi bài bắt đầu bằng dòng `# Tên bài`, dòng `>` đầu tiên là lời gốc
- `src/whitepaper.*.md`: sách trắng
- `build.mjs`: khuôn mẫu trang, hình vẽ, và các tệp sinh tự động (`sw.js`, `sitemap.xml`, `robots.txt`, `llms.txt`, `manifest.webmanifest`, `404.html`)
- `assets/css/style.css`, `assets/js/app.js`: giao diện và tương tác

Sau mỗi lần sửa, kể cả CSS và JS, hãy dựng lại để bản lưu ngoại tuyến được cập nhật:

```bash
npm install
npm run build
```

## Thêm một ngôn ngữ

Sao chép bốn tệp `content`, `more`, `lessons`, `whitepaper` của tiếng Anh sang mã ngôn ngữ mới, dịch, rồi thêm ngôn ngữ đó vào `FILES`, `SLUGS` và vòng lặp cuối `build.mjs`.

## Độ bền

- Trang không gọi tới dịch vụ bên ngoài nào: phông chữ nằm trong `assets/fonts` (giấy phép SIL OFL), không có thư viện lúc chạy.
- Sau lần mở đầu tiên, toàn bộ trang dùng được khi không có mạng và cài được như ứng dụng.
- Mọi ghi chép của người dùng chỉ lưu trong trình duyệt của họ (khóa bắt đầu bằng `an-`); trang Lộ trình cho tải về, nạp lại và xóa.
- Thư viện duy nhất, [marked](https://marked.js.org/) (MIT), chỉ dùng lúc dựng.

## Nguồn

Đạo An của Mr.33: bài Thiền An (Hà Nội, 1/11/2024), bài Đạo An (Việt Trì, 10/04/2025), và các lời giải thích của tác giả tháng 11/2026 ("Tôi Muốn Hạnh Phúc"; ba mục đích, một đích đến; Thiền An là phương pháp bổ trợ). Bài giảng, công cụ và sách trắng được soạn theo các nguồn đó.
