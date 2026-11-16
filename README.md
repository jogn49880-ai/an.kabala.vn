# Đạo An (Peaceful Way)

Trang tĩnh song ngữ Việt – Anh cho Đạo An, hệ thống triết lý do Kabala khởi xướng. Chỉ gồm HTML, CSS và JavaScript; mở `index.html` là chạy.

## Các trang

| Tiếng Việt | English | Nội dung |
|---|---|---|
| `index.html` | `en/index.html` | Giới thiệu: "Tôi Muốn Hạnh Phúc", ba mục đích một đích đến, hai gốc khổ đau, Vòng tròn Hiếu Đạo (tương tác), ứng dụng, đối chiếu, hỏi đáp |
| `thien-an-peaceful-meditation.html` | `en/peaceful-meditation.html` | Thiền An theo nguyên bản: ba bước, cách thực hành, đồng hồ đếm 1–6 |
| `thau-hieu-ban-than.html` | `en/know-yourself.html` | Công cụ: soi gương "Tôi" và "Muốn", điều tôi thật sự muốn, sổ Biết Đủ, điều tôi buông, vòng tròn của tôi, Cân Bằng |
| `sach-trang.html` | `en/whitepaper.html` | Sách trắng (có mục lục, in ra PDF bằng nút In) |
| `lo-trinh.html` | `en/roadmap.html` | Bắt đầu hôm nay, 21 ngày thực hành, tiến trình và dữ liệu của người dùng, hướng phát triển của trang |

`gioi-thieu.html` và `en/peaceful-way.html` chuyển hướng về trang chủ để giữ địa chỉ cũ.

## Sửa nội dung

Nội dung nằm trong `src/`; các tệp HTML được sinh ra từ đó, nên hãy sửa ở `src/` rồi dựng lại:

- `src/content.vi.mjs`, `src/content.en.mjs`: chữ của mọi trang trừ sách trắng
- `src/whitepaper.vi.md`, `src/whitepaper.en.md`: sách trắng (Markdown)
- `build.mjs`: khuôn mẫu trang
- `assets/css/style.css`, `assets/js/app.js`: giao diện và tương tác (sửa trực tiếp, không cần dựng lại)

```bash
npm install
npm run build
```

## Thư viện miễn phí

- [marked](https://marked.js.org/) (MIT): chuyển Markdown của sách trắng thành HTML lúc dựng
- Google Fonts: Be Vietnam Pro, Noto Serif (OFL)

Trang không cần thư viện nào lúc chạy. Mọi ghi chép của người dùng chỉ lưu trong trình duyệt của họ (localStorage, khóa bắt đầu bằng `an-`); trang Lộ trình cho tải về, nạp lại và xóa.

## Nguồn nội dung

Nguyên bản gồm hai bài của Mr.33 (Đạo An, Việt Trì 10/04/2025; Thiền An, Hà Nội 1/11/2024) và đính chính của tác giả tháng 11/2026 (ba mục đích, một đích đến; "Tôi Muốn Hạnh Phúc"). Sách trắng tách hai lớp: *Nguyên bản* và *Chú giải* (diễn giải, mở rộng, đề xuất của ấn bản này, cần người khởi xướng thẩm định).
