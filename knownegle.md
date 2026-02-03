```nestjs```
1.context: ExecutionContext lại là gì?

2.reflector: Reflector lại là gì?

------------------------------------------------------------------------------------------

* Validate dữ liệu trong NestJs: 
      - Hiện tại đang học thì validate bằng Pipes kết hợp với thư viện class-validator

* `Guard` có nhiệm vụ gì?
      - Thằng Guard(Khiên bảo vệ) này nhiệm vụ của nó là bảo vệ route
      - Hiểu đơn giản nó kiểm soát xem ai là người được phép truy cập cái route này

* Xác thực, phân quyền trong NestJs:
      - Hiện tại đang học thì xác thực, phân quyền bằng Guard
      - Kết hợp với token tạo bằng jwt
      - Có sử dụng passwort để hỗ trợ xác thực xác thực
          + Kích hoạt cái passport thông qua cái AuthGuard() của nest/passport
          + Vẫn phải đặt cái AuthGuard() bên trên trong @UserGuard()
          + Tạo cái passport là thông qua file `namefile.strategy.ts`
            --> ví dụ file `namefile.strategy.ts` dùng để xác thực jwt thì bên dưới AuthGuard('jwt')
                                                  dùng để xác thực dữ liệu như email/password thì AuthGuard('local')
          + Ví dụ: @UseGuards(AuthGuard('jwt'), RolesGuard
          (`Lưu ý`: dùng passport cho cái nào thì phải cài đúng thư viện của cái đó(jwt,local))
          --> Nên đọc thêm tài liệu về passport trong docs củ nestJS
------------------------------------------------------------------------------------------

* Request đi vào thì pipes sẽ validate các dữ liệu mà request gửi lên --> đang dùng các 
decorator của class-validator

* Response trả ra thì interceptor sẽ là để có thể biến đổi dữ liệu, ẩn trường sữ liệu --> đang dùng các decorator của class-trasformer

------------------------------------------------------------------------------------------

Nên tạo 1 cái Chuẩn form để trả ra response theo khuôn mẫu của mình --> đã tạo ở bases/api-response.ts

nên tạo thêm 1 chỗ ở bắt toàn bộ lỗi từ đó để trả ra form lỗi như của mình --> hiện tại chưa tạo(3/2/2026)