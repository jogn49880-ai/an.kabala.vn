# Đạo An (Peaceful Way)

Trang tĩnh song ngữ Việt – Anh cho Đạo An, hệ thống triết lý do Kabala khởi xướng. Chỉ gồm HTML, CSS và JavaScript; mở `index.html` là chạy.

## Các trang

| Tiếng Việt | English | Nội dung |
|---|---|---|
| `index.html` | `en/index.html` | Giới thiệu: hai gốc khổ đau, Con đường để An, Vòng tròn Hiếu Đạo (tương tác), ứng dụng, đối chiếu, hỏi đáp |
| `thien-an-peaceful-meditation.html` | `en/peaceful-meditation.html` | Thiền An: bốn bước, đồng hồ đếm 1–6, sổ Biết Đủ, kiểm tra Cân Bằng, lộ trình 21 ngày |
| `sach-trang.html` | `en/whitepaper.html` | Sách trắng (có mục lục, in ra PDF bằng nút In) |

`gioi-thieu.html` và `en/peaceful-way.html` chuyển hướng về trang chủ để giữ địa chỉ cũ.

## Sửa nội dung

Nội dung nằm trong `src/`; các tệp HTML được sinh ra từ đó, nên hãy sửa ở `src/` rồi dựng lại:

- `src/content.vi.mjs`, `src/content.en.mjs`: chữ của trang chủ và trang thực hành
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

Trang không cần thư viện nào lúc chạy. Sổ Biết Đủ và số buổi thiền chỉ lưu trong trình duyệt của người dùng.

## Nguồn nội dung

Sách trắng tách hai lớp: *Nguyên bản* (các mệnh đề Kabala đã công bố về Đạo An) và *Chú giải* (diễn giải, mở rộng, đề xuất của ấn bản này, cần người khởi xướng thẩm định).
