# Đối chiếu yêu cầu TH03

Kiểm tra ngày **17/11/2026**, trên bản production (`npm run build` và `npm start`), sau khi thay đổi giao diện. Đối chiếu với đề LTWNC_TH03.pdf gồm 13 trang.

**Kết luận: các yêu cầu bắt buộc đã được triển khai và các kiểm tra dưới đây đều đạt. Không phát hiện lỗi chức năng cần sửa trong lượt rà soát này.**

## Phần 1: Trang công khai và render

| Yêu cầu | Kết quả kiểm tra |
| --- | --- |
| Layout tiếng Việt, metadata mặc định và title template | Đúng; không gọi `auth()` trong layout gốc. |
| Dòng đầu layout là `const BUILD_TAG = "rb-6129";` | Đã kiểm tra chính xác nội dung dòng đầu. |
| Route group `(public)` và `(app)` | Đủ; layout thành viên có “Khu vực thành viên”. |
| Hàm `loadBooksShift`, chờ 800 ms, lọc category và q | Đúng; tìm kiếm không phân biệt hoa thường. |
| Trang chủ SSG, số sách/chuyên mục lấy từ dữ liệu | Build báo Static; hiển thị 24 đầu sách · 4 chuyên mục và link danh mục. |
| Danh mục SSR, form GET có label và giữ bộ lọc | Đã thao tác form; URL có q/category đúng; lựa chọn được giữ lại. |
| Kết quả tìm kiếm theo ví dụ | Toàn bộ 24; Lập trình 6; “mạng” 4; “lập trình” 5, kết hợp Lập trình còn 4; “cơ sở” 3; “zzz” 0. |
| Loading và giờ SSR | Đã thấy “Đang tải danh mục sách...”; giờ “Render lúc” thay đổi khi tải lại. |
| 12 chi tiết sinh sẵn, ISR 60 giây | Build và prerender manifest xác nhận 12 trang, `revalidate=60`. Kiểm tra thực tế: giữ giờ khi tải lại trong hạn cache, cập nhật sau hơn 60 giây. |
| Sách ngoài 12 trang và sách không tồn tại | `/books/20` mở được; `/books/999` trả HTTP 404 và thông báo đúng. |
| Metadata chi tiết và sitemap | Sách 6 có title/description đúng đề; sitemap có 26 URL. |

## Phần 2: Đăng nhập và phân quyền

| Yêu cầu | Kết quả kiểm tra |
| --- | --- |
| Auth.js Credentials, JWT, role trong token/session | Đủ cấu hình và module augmentation User/Session/JWT. |
| Sai mật khẩu, đăng nhập đúng và callback URL | Đúng thông báo lỗi; cả ba tài khoản đăng nhập được; giữ cả `/loans?book=6`. |
| Đã đăng nhập mở `/login` | Chuyển về `/`. |
| Menu theo phiên và đăng xuất | Hiện lời chào, vai trò, Sách đã mượn; riêng admin có Quản trị; đăng xuất về `/`. |
| Cookie phiên | Có cờ HttpOnly. |
| Proxy chỉ bảo vệ loans/admin | Matcher đúng; khách chuyển đăng nhập; sinh viên vào admin chuyển forbidden. |
| Ma trận `can()` | Unit test xác nhận đủ 5 quyền cho guest/student/admin. |
| Trang admin và action tự kiểm tra quyền | Đã đối chiếu mã nguồn; action chỉ thay đổi yêu cầu pending. |
| Duyệt yêu cầu | Ban đầu 13/12/12, duyệt dòng đầu thành 12/13/12; dòng biến mất. |
| SEO trang riêng tư | Đã kiểm tra thẻ robots chứa `noindex` trên `/loans` và `/admin`. |

## Phần 3: Mượn sách

| Yêu cầu | Kết quả kiểm tra |
| --- | --- |
| Một nơi giữ quy tắc validation TypeScript | `loan-validate.ts` có đủ kiểu, `today`, `toLoanInput`, `validateLoan`, `toLoanData`. |
| Các lỗi đầu vào | Test đạt cho form trống, ngày quá khứ/không tồn tại, thời hạn sai, số lượng không nguyên dương/vượt số bản, lý do ngắn/toàn khoảng trắng. |
| Logic tách khỏi Next.js | Lọc, phân trang, tồn kho và hủy nằm trong `lib/loans.ts`. |
| Phân trang và quyền xem dữ liệu | sv01: 27 yêu cầu, 10/10/7; lọc pending: 9. sv02: 10. Admin: 37, 4 trang; pending: 2 trang. |
| Link Trước/Sau và đổi bộ lọc | Trang cuối không còn link Sau; đổi trạng thái quay lại trang 1. |
| Form chỉ dành cho student | Admin không có form mượn và nút Hủy. |
| Giữ dữ liệu khi lỗi | Đã thử lỗi vượt số bản, gửi lại cùng lỗi hai lần và lỗi hết bản; lựa chọn/số lượng/lý do vẫn giữ đúng. |
| Tồn kho theo sách và ngày lấy | Sách 6 ngày 02/12/2026 báo hết bản; sách 11 ngày 03/12/2026 tạo được vì yêu cầu mẫu đã bị từ chối. |
| Thành công và hủy | Thông báo đúng; form được reset; yêu cầu mới nằm đầu bảng; bấm Hủy xóa yêu cầu. |
| Chọn sẵn sách từ URL | `/loans?book=6` chọn đúng sách 6 sau đăng nhập. |
| Bảo vệ Server Actions | Có auth + can ở create/cancel/review. Test bổ sung xác nhận khách/admin không được gọi create/cancel. |

## Phần 4 và điều kiện nộp

- `npm test`: **47/47 test đạt**, thuộc 6 file, tên test tiếng Việt, nằm cạnh mã nguồn.
- `npm run coverage`: **Lines 100% cho từng file** `permissions.ts`, `loan-validate.ts`, `format.ts`, `LoanForm.tsx`; ngưỡng cấu hình là 70% mỗi file.
- `npm run lint`: thành công, không lỗi/cảnh báo ESLint.
- `npm run build`: thành công; chiến lược render vẫn đúng sau khi đổi giao diện.
- `coverage.png` ở gốc repo được chụp lại từ báo cáo coverage của lượt kiểm tra này.
- `.env.example` chỉ có dòng `AUTH_SECRET=`. `.env.local` được ignore và không nằm trong danh sách file Git theo dõi.
- Không có `any`, Redux Toolkit, Zustand hoặc thư viện form/query bên ngoài trong mã nguồn.
- Repo GitHub công khai; lịch sử có đủ `Phan 1`, `Phan 2`, `Phan 3`, `Phan 4`. Commit cải thiện giao diện được giữ riêng sau bốn phần.

## Các điểm cần hiểu đúng khi nộp

1. Đề ghi `loan-schema.ts` trong cấu hình mẫu nhưng yêu cầu thực hiện và chấm coverage cho `loan-validate.ts`; dự án dùng `loan-validate.ts`.
2. Các ví dụ ngày 02–03/12/2026 chỉ gửi được trước hoặc trong ngày đó. Sau thời gian này, validation phải báo ngày quá khứ; đây là hành vi đúng yêu cầu. Unit test đã cố định thời gian để không bị ảnh hưởng.
3. Dữ liệu trong bộ nhớ sẽ được đặt lại khi khởi động lại server, đúng đề; không phải cơ sở dữ liệu lâu dài.
4. Giao diện mới vẫn giữ các trường, nhãn, bảng và nội dung bắt buộc. Phông chữ và bìa minh họa không thay đổi nghiệp vụ.
5. `useOptimistic`, ảnh Open Graph/JSON-LD và tìm kiếm live là thử thách không bắt buộc, chưa triển khai. Đã làm phần test Server Action bổ sung.
