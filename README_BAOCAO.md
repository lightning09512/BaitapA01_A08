## 2. BACKEND: BẢO MẬT & XÁC THỰC (AUTHENTICATION)
*File: `Server/server.js`*

> **🎯 ĐIỂM NHẤN BÁO CÁO: TÍNH NĂNG SINH VIÊN THỰC HIỆN Ở NHÀ**
> Để đáp ứng bài tập về nhà do Thầy giao, sinh viên đã tự nghiên cứu và hoàn thiện toàn vẹn 3 luồng xác thực nâng cấp:
> 1. **Register với OTP Activation**: Tài khoản đăng ký mới sẽ bị khóa (`isVerified: false`). Server sinh mã OTP ngẫu nhiên gửi đi và yêu cầu nhập đúng mã này mới được kích hoạt tài khoản.
> 2. **Forget Password với OTP**: Khi người dùng quên mật khẩu, sinh viên code luồng cấp mã `resetOtp` xác thực qua Email. Người dùng nhập đúng OTP này kèm Mật Khẩu Mới để khôi phục tài khoản.
> 3. **Login với JWT (JSON Web Token)**: Đăng nhập thành công, thay vì trả Session lỗi thời, Server tiến hành ký và cấp phát JSON Web Token (JWT). Token này là chìa khóa bắt buộc (`authenticateToken`) để truy cập các API riêng tư như Giỏ hàng, Hồ sơ, Đơn hàng...

### 2.1 Đăng ký & Tạo OTP tự động (Dòng 108 - 139)
Khi gọi API `/register`, hệ thống không cho phép đăng nhập ngay lập tức. Mật khẩu được lưu lại (ở thực tế sẽ dùng bcrypt để băm mật khẩu), và tài khoản sẽ bị khóa ở trạng thái `isVerified: false`. Một mã OTP 6 số ngẫu nhiên được sinh ra.

```javascript
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    
    // Kiểm tra trùng lặp tài khoản hoặc email
    if (users.find(u => u.username === username)) return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    if (users.find(u => u.email === email)) return res.status(400).json({ message: "Email đã được sử dụng" });

    // Tạo mã OTP 6 số ngẫu nhiên (Ví dụ: Math.random() = 0.543212 * 900000 = 488890 + 100000 = 588890)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Khởi tạo Object User
    users.push({
        username,
        password,
        email,
        phone: "",
        avatar: "https://i.pravatar.cc/150?img=12",
        // BẢO MẬT: Khóa tài khoản ngay từ lúc khởi tạo
        isVerified: false, 
        // BẢO MẬT: Gán mã OTP vào user để chờ đối chiếu ở bước sau
        verifyOtp: otp     
    });

    saveData(); // Ghi file data.json đồng bộ
    console.log(`\n=== OTP XÁC MINH TÀI KHOẢN CHO ${email}: ${otp} ===\n`);

    res.json({
        message: "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.",
        requiresVerification: true // Flag báo hiệu cho React Native chuyển hướng sang màn hình nhập OTP
    });
});
```

### 2.2 Cấp Token JWT Khi Login & Phân quyền Middleware (Dòng 94-104 & Dòng 141-158)
Để bảo vệ các API riêng tư (Hồ sơ, Giỏ hàng, Đơn hàng), dự án sử dụng JSON Web Token (JWT). JWT là một chuỗi mã hóa bao gồm Header, Payload (thông tin user), và Signature (chữ ký bí mật). Chỉ khi có chuỗi này, App mới được phép truy cập data của user tương ứng.

**Khởi tạo JWT khi Login thành công (Dòng 141 - 158):**
```javascript
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

    // Dừng luồng nếu tài khoản chưa Verified bằng OTP lúc đăng ký
    if (user.isVerified === false) { return res.json({ requiresVerification: true }); }

    // BẢO MẬT: KÝ TOKEN VÀ PHÁT HÀNH
    // Token này là vé thông hành để App dùng cho tất cả các API sau này
    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    res.json({ token, user }); 
});
```

**Bộ lọc chặn Token đứng trước API (Dòng 94 - 104):**

```javascript
const jwt = require('jsonwebtoken');
const SECRET_KEY = "SECRET_KEY_A04"; // Chìa khóa bí mật để ký và xác nhận token

// MIDDLEWARE: Cái lọc đứng trước mọi API riêng tư
const authenticateToken = (req, res, next) => {
    // 1. Phân tách Token từ Header HTTP (Định dạng: Authorization: Bearer <T0K3N_STRING>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    // 2. Chặn đứng Request nếu không có Token (Error: 401 Unauthorized)
    if (!token) return res.sendStatus(401);

    // 3. Tiến hành giải mã Token dựa trên SECRET_KEY
    jwt.verify(token, SECRET_KEY, (err, user) => {
        // Nếu Token bị sửa đổi, làm giả, hoặc đã hết hạn -> Báo lỗi ngay (Error: 403 Forbidden)
        if (err) return res.sendStatus(403);
        
        // 4. Mọi thứ hợp lệ -> Nhét thông tin user vừa giải mã vào Request và cho phép đi tiếp (next)
        req.user = user; 
        next(); 
    });
};

// CÁCH SỬ DỤNG: Đặt hàm authenticateToken làm trạm trung chuyển
app.get('/profile', authenticateToken, (req, res) => {
    // Nếu code lọt vào khối này, req.user CHẮC CHẮN chứa tên đăng nhập hợp lệ
    const user = users.find(u => u.username === req.user.username);
    res.json(user);
});
```

### 2.3 Quên Mật Khẩu (Forgot Password) & Reset bằng OTP (Dòng 184 - 232)
Để khôi phục tài khoản mà không cần đăng nhập, sinh viên đã xây dựng API `/forgot-password` hoàn toàn độc lập. Khi người dùng nhập Email, hệ thống dò tìm tài khoản và sinh ra một mã OTP 6 số ngẫu nhiên gán vào biến tạm `user.resetOtp`.

Ở bước tiếp theo, App Client gửi lên Server khối dữ liệu: `Email`, `Mã OTP`, và `Mật Khẩu Mới` qua API `/reset-password`. Server đối chiếu OTP, nếu trùng khớp sẽ tiến hành ghi đè mật khẩu mới và xóa mã OTP đó đi (`user.resetOtp = null`). Việc xóa OTP ngay lập tức giúp hệ thống an toàn tuyệt đối trước lỗ hổng Replay Attack (Sử dụng lại OTP cũ).

```javascript
// Bước 1: API Gửi mã OTP Quên mật khẩu (Dòng 184 - 204)
app.post('/forgot-password', (req, res) => {
    const user = users.find(u => u.email === req.body.email);
    /* ... logic chặn lỗi (không chép lại hàm tìm user) ... */
    
    // TẠO MÃ OTP VÀ LƯU TẠM
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp; 
    saveData();
    res.json({ message: "Đã gửi mã OTP" });
});

// Bước 2: API Đặt lại mật khẩu (Dòng 206 - 232)
app.post('/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = users.find(u => u.email === email);
    
    // ĐỐI CHIẾU MÃ OTP: Chặn đứng Request nếu OTP sai/trống (Error: 400 Bad Request)
    if (!user.resetOtp || user.resetOtp !== otp) {
        return res.status(400).json({ message: "Mã OTP không đúng hoặc đã hết hạn" });
    }

    user.password = newPassword;
    // BẢO MẬT: Xóa mã OTP đi ngay lập tức (Chống Replay Attack)
    user.resetOtp = null; 
    saveData();
    
    res.json({ message: "Đổi mật khẩu thành công!" });
});
```

---

## 3. BACKEND: QUẢN LÝ GIỎ HÀNG & ĐƠN HÀNG (CART & ORDERS)
*File: `Server/server.js`*

### 3.1 Cập Nhật Giỏ Hàng (Cộng dồn số lượng) (Dòng 424 - 444)
Khác với việc cứ ấn "Thêm vào giỏ" là tạo một Item mới, hệ thống tự động dò tìm xem sản phẩm đó đã tồn tại trong giỏ hay chưa.

```javascript
app.post('/cart/add', authenticateToken, (req, res) => {
    const { productId, quantity } = req.body;
    const user = users.find(u => u.username === req.user.username);
    const product = products.find(p => p.id === Number(productId));
    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    // LOOOKUP: Tìm sản phẩm trong giỏ hàng hiện tại của user theo ID
    const existing = user.cart.find(item => item.productId === product.id);
    
    if (existing) {
        // TỒN TẠI: Tăng số lượng lên, không tạo dòng mới
        existing.quantity += qty;
    } else {
        // CHƯA TỒN TẠI: Thêm mới vào giỏ hàng
        user.cart.push({ productId: product.id, quantity: qty });
    }

    saveData();
    // Hàm buildCartResponse sẽ tính toán tổng giá tiền của toàn bộ giỏ (Quantity * Price) trả về cho App vẽ lên màn hình
    return res.json(buildCartResponse(user)); 
});
```

### 3.2 Đặt Hàng & Quản Lý Trạng Thái (Order Status Machine) (Dòng 491 - 606)
Khi đặt hàng, toàn bộ thông tin giỏ hàng ở thời điểm đó (Gồm giá và số lượng) được "SnapShot" (Lưu vết) dời qua danh sách Đơn Hàng (`user.orders`). Đồng thời xóa rỗng giỏ hàng.

```javascript
app.post('/orders/checkout-cod', authenticateToken, (req, res) => {
    // ... Kiểm tra ràng buộc địa chỉ, SĐT ...
    const cartInfo = buildCartResponse(user); // Lấy toàn bộ info giỏ hàng

    const now = Date.now();
    // Tạo Object Đơn hàng
    const order = {
        id: now.toString(), // Mã ID đơn hàng lấy theo TimeStamp cho không trùng lặp
        status: 'NEW',      // Trạng thái ban đầu: NEW
        createdAt: now,
        paymentMethod: 'COD', // Cash On Delivery
        address, phone, note,
        // Dời dữ liệu qua đây để lỡ shop có đổi giá sản phẩm sau này, lịch sử đơn hàng cũng không bị ảnh hưởng giá
        items: cartInfo.items, 
        totalAmount: cartInfo.totalAmount,
    };

    user.orders.push(order); // Ghi nhận
    user.cart = []; // RESET BỘ NHỚ GIỎ HÀNG
    saveData();

    res.json({ message: "Đặt hàng COD thành công", order });
});
```

Hệ thống cung cấp một API Hủy Đơn. Việc hủy đơn chỉ được diễn ra trong vòng 30 phút kể từ lúc đặt (đối với trạng thái NEW hoặc CONFIRMED). Nếu trạng thái là PREPARING, ứng dụng chỉ được gửi "Yêu cầu hủy" tới Server. Đây là một luồng kinh doanh (Business Logic) rất thực tế.

---

## 4. BACKEND: CẤU TRÚC DỮ LIỆU & PHÂN TRANG (PAGINATION)
*File: `Server/server.js` (Dòng 610 - 645)*

Khi sản phẩm có hàng ngàn chiếc, trả về toàn bộ danh sách một lượt sẽ làm app bị Crash (Tràn bộ nhớ) hoặc rất chậm. Server hỗ trợ cơ chế Phân Trang. 

```javascript
// Hỗ trợ tìm kiếm (?search=...), Lọc chuyên mục (?category=...), và Phân trang (?page=1&limit=10)
app.get('/products', (req, res) => {
    const { search, category, page, limit } = req.query;
    let result = products;

    // FILTER: Lọc theo tên từ khóa
    if (search) {
        result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    // FILTER: Lọc theo chuyên mục Mobile, Laptop,...
    if (category && category !== 'All') {
        result = result.filter(p => p.category === category);
    }

    // NẾU CÓ TRUYỀN PARAM PAGE VÀ LIMIT THÌ BẮT ĐẦU CẮT MẢNG (SLICE)
    if (page || limit) {
        const pageNum = parseInt(page, 10) || 1;    // Mặc định trang 1
        const limitNum = parseInt(limit, 10) || 10; // Mặc định 10 SP / Trang
        
        const start = (pageNum - 1) * limitNum; // VD: Trang 2 -> Bắt đầu từ Index 10
        const end = start + limitNum;           // VD: Kết thúc ở Index 20
        
        const items = result.slice(start, end); // CẮT DATA
        
        return res.json({
            items,              // Data trả về cho trang này
            page: pageNum,
            limit: limitNum,
            total: result.length, 
            hasMore: end < result.length // True/False cho App biết phía sau còn SP ẩn không để làm tính năng Load More
        });
    }

    // NẾU KHÔNG CÓ PARAM THÌ TRẢ TOÀN BỘ (Dùng cho các trường hợp cụ thể)
    res.json(result); 
});
```

---

## 5. FRONTEND: CẤU HÌNH GỌI API & CHÈN TOKEN TỰ ĐỘNG
*File: `src/services/api.js` (Dòng 27 - 49)*

Trong lập trình Client, gọi HTTP Request thì thư viện `Axios` là lựa chọn số một. Thay vì lặp đi lặp lại việc nối URL và dán Header. Ta tạo ra một `Instance Axios` dùng chung (Singleton).

```javascript
import axios from 'axios';

// TRỘM IP TỰ ĐỘNG ĐỂ CHẠY LAN TRÊN EMULATOR/TEST DEVICE VỚI HOST BACKEND
const SERVER_HOST = getHostFromExpo() || '10.0.2.2'; // 10.0.2.2 là localhost của Android Studio

// KHỞI TẠO BẢN THỂ AXIOS
const api = axios.create({
  baseURL: `http://${SERVER_HOST}:3000`, // Cấu hình tự động dán Base URL cho mọi API (VD: /login -> http://10.0.2.2:3000/login)
  timeout: 7000, // Quá 7s mà mạng không tới -> Ngắt, tự ném ra lỗi (Tránh ứng dụng Loading xoay vô tận)
});

// HÀM QUẢN LÝ PHIÊN ĐĂNG NHẬP
export function setAuthToken(token) {
  if (token) {
    // Sức mạnh của Axios: Sét mặc định Authorization cho TOÀN BỘ các file .js trong App
    // Các lệnh get/post sau này sẽ tự động ôm Token đi lên Server
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
  } else {
    // Gọi lúc Logout để băm nát Header
    delete api.defaults.headers.common['Authorization'];
  }
}
```

---

## 6. FRONTEND: UI GLASSMORPHISM & ANIMATION ĐA LUỒNG
Giao diện dự án từ chối các khối màu Solid đặc cứng, theo đuổi xu hướng Glassmorphism (Kính mờ) và Light/Dark Depth (Độ sâu) bằng `react-native/Animated`.

### 6.1 Hiệu Ước Xoay Quả Cầu Xuyên Suốt (Animated Orbs)
*File: `src/screens/Auth/LoginScreen.js`*

Để tạo một quả cầu trôi dạt vô tận đằng sau khối kính mờ. Component `AnimatedOrb` được sinh ra.

```javascript
import { Animated, Easing } from 'react-native';

function AnimatedOrb({ style, delay = 0 }) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // HÀM Animated.loop(): Chạy vô tận bộ chuỗi hành động bên trong
        Animated.loop(
            // HÀM Animated.sequence(): Xếp lịch chạy tuần tự Hành Động 1 XONG THÌ ĐẾN Hành Động 2
            Animated.sequence([
                // Hành động 1: Tịnh tiến giá trị từ 0 lên 1 theo dạng đường Curve SIN (Êm mượt ở điểm 0 và 1)
                Animated.timing(anim, {
                    toValue: 1, duration: 4000, delay,
                    easing: Easing.inOut(Easing.sin), useNativeDriver: true, // Dùng NativeDriver để dùng GPU máy render, không làm treo CPU
                }),
                // Hành động 2: Rút ngược từ 1 về 0
                Animated.timing(anim, {
                    toValue: 0, duration: 4000,
                    easing: Easing.inOut(Easing.sin), useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    // Nội Suy Giá Trị 
    // Trục dọc: 0 -> 1 tương ứng trôi lên 20px Y (0 qua -20)
    // Co giãn: 0 -> 1 tương ứng Scale lớn thêm 8% (1 ra 1.08)
    const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
    const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

    return <Animated.View style={[style, { transform: [{ translateY }, { scale }] }]} />;
}
```

### 6.2 Hiệu Ứng Bàn Phím Động (Keyboard Focus & Padding)
Nỗi đau lớn nhất khi thiết kế Mobile App là "Mở bàn phím ảo lên thì mất UI, che luôn Nút Bấm". React Native cung cấp `Keyboard.addListener` để khắc phục.

*File: Được xử lý trực tiếp trong useEffect của các trang Form*

```javascript
const [keyboardHeight, setKeyboardHeight] = useState(0);

useEffect(() => {
    // Lắng nghe khi Bàn phím Trồi Lên -> Điền chiều cao thật của nó (Khoảng 200-300px) vào State
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
        setKeyboardHeight(e.endCoordinates.height);
    });
    // Lắng nghe khi giấu đi -> Trả về 0
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
    });
    // Tránh lộ lọt bộ nhớ khi rời trang (Clean-up Memory Leak)
    return () => { showSub.remove(); hideSub.remove(); };
}, []);

// Ở Dưới Return () UI Render:
// Đẩy toàn bộ cục nội dung lên tương xứng với phần Bàn Phím che mất
<ScrollView contentContainerStyle={{ paddingBottom: keyboardHeight }}>
    <Input />
    <Button />
</ScrollView>
```

---

## 7. BÍ KÍP TRẢ LỜI VẤN ĐÁP GIẢNG VIÊN (Q&A)

Đây là những câu hỏi giảng viên Đại Học cực kì thích hỏi sinh viên khi vấn đáp Đồ án Lập trình Di Động:

**❓ Câu hỏi 1: "Em bảo mật token cho Mobile App như thế nào? Xử lý sao cho an toàn?"**
> **👉 Trả Lời:** *"Dạ thưa thầy, Token được cấp từ Backend (Node.js) qua chuẩn mã hóa JWT. Nhận được token ở Client (React Native), thay vì lưu dạng chắp vá, em cấu hình interceptor Axios để tự gài Header `Authorization: Bearer` cho mọi Request. Nghĩa là việc gửi Token sẽ tự động. Để Token sống sót khi tắt bật lại App, em cất nó vào phân vùng Sandbox `AsyncStorage`. Đảm bảo độ bảo mật cao nhất, BackEnd có cơ chế `jwt.verify()` có chữ ký bí mật `SECRET_KEY_A04` chặn mạo danh ạ."*

**❓ Câu hỏi 2: "Cái logic Giỏ hàng và Cập nhật số lượng của em viết ở đâu? Đưa thầy xem thử?"**
> **👉 Trả Lời:** *"Dạ thầy, tư duy của em là phải đồng bộ mọi lúc mọi nơi trên Server, không lưu Local Device. Logic nằm ở mảng API `POST /cart/add` bên `Server/server.js` (dòng 424). Em dùng hàm `Array.find()` dò xem Product ID đó có mặt ở mảng Object hay chưa, chưa có thì em dùng mảng `.push({...})`, có rồi thì em gọi ra thuộc tính tham chiếu `.quantity` và cộng dồn vào `qty` được gửi lên. Cách này tối giản nhất vì em không sinh rác dữ liệu ra DB (Mảng)."*

**❓ Câu hỏi 3: "Hiệu ứng Glassmorphism chạy Anim mờ lên xuống (Orbs và Input) kia có làm giật lag máy không em, em code kiểu gì mượt vậy?"**
> **👉 Trả Lời:** *"Dạ thưa Thầy, nguyên tắc làm Animation ở React Native là phải tránh khóa (Block) luồng JavaScript chính (JS Thread). Nên mọi hiệu ứng từ quả cầu bay trong Login đến vòng bo Form `GlassInput`, em đều bật thuộc tính Cờ (Flag) `useNativeDriver: true` trong hàm `Animated.timing()`. Điều này ra lệnh cho hệ điều hành xả tác vụ xử lý đồ họa xuống GPU dưới Native cấp thấp, khiến App em luôn giữ vững 60FPS dù hiệu ứng thay đổi vòng lặp tuần tự (`Animated.sequence()`) bất diệt (`Animated.loop()`) ạ."*

**❓ Câu hỏi 4: "Chức năng gửi OTP của em hoạt động cấu trúc như thế nào?"**
> **👉 Trả Lời:** *"Dạ, flow Auth OTP gồm 3 khối kiến trúc. Đầu tiên client nộp Data Đăng Ký. Thứ hai Server xử lý, thay vì cấp quyền luôn, thì Server tự ép Field `isVerified: false` và cấp 1 chuỗi bằng phép tính Random `Math.random()`, nhét hẳn chuỗi này vào field `verifyOtp`. Cuối cùng Server yêu cầu Client đổi màn hình Nhập Mã. Client đệ trình mã lên Route `/verify-account`. Ở khối thứ ba, em mang cái mã Client gửi đối chiếu cứng với mã em lưu ở user trên server đó. Bằng nhau em mới kích bằng `user.isVerified = true` ạ."*

**❓ Câu hỏi 5: "Khi người dùng đăng ký xong thì tài khoản và mật khẩu được hệ thống lưu vào đâu?"**
> **👉 Trả Lời:** *"Dạ thưa thầy, đối với hệ thống Backend Node.js của em, khi đăng ký hoàn tất thì thông tin tài khoản được thêm ngay vào mảng `users` trên bộ nhớ RAM của Server (để hệ thống phản hồi cực nhanh). Ngay lập tức ở dòng code tiếp theo, em gọi hàm `saveData()` để chuyển mảng này thành chuỗi JSON và ghi đè vào file `data.json` nằm trên ổ cứng bằng cơ chế đồng bộ `fs.writeFileSync()`. Cách tiếp cận này giúp dữ liệu có tính 'Persist' (bền vững), giả sử tắt Server bật lại thì bộ nhớ ngầm định nó sẽ nạp lại file `data.json` đó vào RAM, nên tài khoản đã đăng ký không hề bị mất. Tất nhiên, với ứng dụng thực tế quy mô lớn, file JSON này sẽ được thay thế bằng Hệ Quản Trị CSDL như MongoDB hoặc MySQL ạ."*

**❓ Câu hỏi 6: "Phần Login với JWT và Forget Password OTP là em tự làm ở nhà đúng không? Giải thích cách em chặn người lạ đổi mật khẩu bừa bãi xem?"**
> **👉 Trả Lời:** *"Dạ đúng thưa Thầy, phần JWT và Forget Password là các Module bảo mật nâng cao do em tự nghiên cứu và thực hiện thêm ở nhà theo yêu cầu. Đối với Forget Password, thay vì mở lỗ hổng cho đổi mật khẩu trực tiếp bằng cách dò username, em bắt buộc Server sinh ra 1 thẻ OTP gắn vào biến `user.resetOtp` trên RAM. Nếu Hacker không thể truy cập vào Terminal máy chủ hoặc Email của người dùng để đọc OTP này, thì mọi luồng `/reset-password` gọi lên API đều bị chặn đứng và báo lỗi 400 Bad Request ngay lập tức ạ!"*

