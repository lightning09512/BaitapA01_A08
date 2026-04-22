export const getProductSpecs = (productName) => {
  const specsDB = {
    "iPhone 15 Pro Max": [
      { label: "Kích thước màn hình", value: "6.7 inches" },
      { label: "Công nghệ màn hình", value: "Super Retina XDR OLED, 120Hz" },
      { label: "Camera sau", value: "Chính 48 MP, Phụ 12 MP & 12 MP" },
      { label: "Camera trước", value: "12 MP" },
      { label: "Chipset", value: "Apple A17 Pro (3 nm)" },
      { label: "Bộ nhớ trong", value: "256 GB / 512 GB / 1 TB" },
      { label: "Pin", value: "4422 mAh, Sạc nhanh 20W" },
      { label: "Hệ điều hành", value: "iOS 17" }
    ],
    "Samsung Galaxy S24 Ultra": [
      { label: "Kích thước màn hình", value: "6.8 inches" },
      { label: "Công nghệ màn hình", value: "Dynamic AMOLED 2X, 120Hz" },
      { label: "Camera sau", value: "Chính 200 MP, Phụ 50 MP, 12 MP & 10 MP" },
      { label: "Camera trước", value: "12 MP" },
      { label: "Chipset", value: "Snapdragon 8 Gen 3 for Galaxy" },
      { label: "Bút S-Pen", value: "Có hỗ trợ (tích hợp trong thân máy)" },
      { label: "Pin", value: "5000 mAh, Sạc cực nhanh 45W" },
      { label: "Hệ điều hành", value: "Android 14, One UI 6.1" }
    ],
    "MacBook Air M3 13 inch": [
      { label: "Kích thước màn hình", value: "13.6 inches" },
      { label: "Công nghệ màn hình", value: "Liquid Retina display (2560 x 1664)" },
      { label: "CPU", value: "Apple M3 (8-core CPU)" },
      { label: "GPU", value: "Apple M3 (8-10 core GPU)" },
      { label: "RAM", value: "8GB / 16GB / 24GB Unified Memory" },
      { label: "Ổ cứng", value: "256GB / 512GB SSD" },
      { label: "Trọng lượng", value: "1.24 kg" },
      { label: "Hệ điều hành", value: "macOS" }
    ],
    "Dell XPS 13 Plus": [
      { label: "Kích thước màn hình", value: "13.4 inches" },
      { label: "Công nghệ màn hình", value: "FHD+ / OLED 3.5K Touch" },
      { label: "CPU", value: "Intel Core i7-1360P / i7-1340P" },
      { label: "Card đồ họa", value: "Intel Iris Xe Graphics" },
      { label: "RAM", value: "16GB / 32GB LPDDR5" },
      { label: "Ổ cứng", value: "512GB / 1TB PCIe NVMe" },
      { label: "Trọng lượng", value: "1.26 kg" },
      { label: "Thiết kế", value: "Bàn di chuột tàng hình, phím liền khối" }
    ],
    "Sony WH-1000XM5": [
      { label: "Kiểu tai nghe", value: "Over-ear (Chụp tai)" },
      { label: "Công nghệ", value: "Chống ồn chủ động (ANC) hàng đầu" },
      { label: "Driver", value: "30mm specially designed" },
      { label: "Bluetooth", value: "5.2, LDAC, SBC, AAC" },
      { label: "Pin", value: "Lên đến 30 giờ (nếu bật ANC)" },
      { label: "Sạc nhanh", value: "Sạc 3 phút = nghe 3 giờ" },
      { label: "Trọng lượng", value: "Khoảng 250g" },
      { label: "Microphone", value: "4 micro định dạng chùm tia" }
    ],
    "iPad Pro M4 11 inch": [
      { label: "Kích thước màn hình", value: "11 inches" },
      { label: "Công nghệ màn hình", value: "Tandem OLED, ProMotion 120Hz" },
      { label: "CPU", value: "Apple M4 (9 lõi CPU, 10 lõi GPU)" },
      { label: "Bộ nhớ trong", value: "256 GB / 512 GB / 1 TB" },
      { label: "Camera sau", value: "12 MP Wide, LiDAR Scanner" },
      { label: "Bút cảm ứng", value: "Hỗ trợ Apple Pencil Pro" },
      { label: "Số loa", value: "4 loa stereo" },
      { label: "Trọng lượng", value: "444 g (Wi-Fi), siêu mỏng 5.3mm" }
    ],
    "Xiaomi 14 Ultra": [
      { label: "Kích thước màn hình", value: "6.73 inches" },
      { label: "Công nghệ màn hình", value: "LTPO AMOLED, 120Hz, Dolby Vision" },
      { label: "Hợp tác Camera", value: "Leica Optics" },
      { label: "Camera sau", value: "Quad 50MP (Chính, Siêu rộng, Tele x3.2, Tele x5)" },
      { label: "Chipset", value: "Snapdragon 8 Gen 3" },
      { label: "Pin", value: "5000 mAh" },
      { label: "Sạc", value: "Sạc nhanh có dây 90W, không dây 80W" },
      { label: "Hệ điều hành", value: "HyperOS (Android 14)" }
    ],
    "OPPO Find X7 Ultra": [
      { label: "Kích thước màn hình", value: "6.82 inches" },
      { label: "Công nghệ màn hình", value: "LTPO AMOLED, 1B colors, 120Hz" },
      { label: "Hợp tác Camera", value: "Hasselblad Color Calibration" },
      { label: "Camera ống kính kép", value: "2 Camera Periscope Telephoto" },
      { label: "Chipset", value: "Snapdragon 8 Gen 3" },
      { label: "Pin", value: "5000 mAh" },
      { label: "Sạc nhanh", value: "100W có dây, 50W không dây" }
    ],
    "Google Pixel 8 Pro": [
      { label: "Kích thước màn hình", value: "6.7 inches" },
      { label: "Công nghệ màn hình", value: "Super Actua display (LTPO OLED), 120Hz" },
      { label: "Camera", value: "Chính 50MP, Siêu rộng 48MP, Tele 48MP x5" },
      { label: "Tính năng AI", value: "Magic Editor, Video Boost, Audio Magic Eraser" },
      { label: "Chipset", value: "Google Tensor G3" },
      { label: "Thời gian hỗ trợ OS", value: "Cập nhật Android & Bảo mật 7 năm" }
    ],
    "ASUS ROG Zephyrus G16": [
      { label: "Kích thước màn hình", value: "16 inches" },
      { label: "Công nghệ màn hình", value: "OLED ROG Nebula Display 2.5K 240Hz" },
      { label: "CPU", value: "Intel Core Ultra 9 / 7" },
      { label: "Card đồ họa", value: "NVIDIA GeForce RTX 4070 / 4080" },
      { label: "RAM", value: "Up to 32GB LPDDR5X" },
      { label: "Tản nhiệt", value: "ROG Intelligent Cooling, 3 Quạt Arc Flow" }
    ],
    "Lenovo ThinkPad X1 Carbon": [
      { label: "Màn hình", value: "14 inches WUXGA / 2.8K OLED" },
      { label: "Bộ vi xử lý", value: "Intel Core Ultra (Series 1)" },
      { label: "Độ bền", value: "MIL-STD 810H quân đội" },
      { label: "Bàn phím", value: "TrackPoint truyền thống đặc trưng" },
      { label: "Trọng lượng", value: "Chỉ từ 1.09 kg" }
    ],
    "HP Spectre x360 14": [
      { label: "Tính năng", value: "Laptop xoay gập 360 độ (2-in-1)" },
      { label: "Màn hình", value: "14 inches OLED 2.8K Touchscreen" },
      { label: "Bút cảm ứng", value: "Có hỗ trợ HP Rechargeable MPP2.0 Tilt Pen" },
      { label: "Bộ vi xử lý", value: "Intel Core Ultra 7" }
    ],
    "Samsung Galaxy Tab S9 Ultra": [
      { label: "Kích thước khổng lồ", value: "14.6 inches" },
      { label: "Công nghệ màn hình", value: "Dynamic AMOLED 2X, 120Hz" },
      { label: "Kháng nước, bụi", value: "IP68 (cho cả máy và S-Pen)" },
      { label: "Chipset", value: "Snapdragon 8 Gen 2 for Galaxy" },
      { label: "Pin", value: "11200 mAh, Sạc 45W" }
    ],
    "Microsoft Surface Pro 9": [
      { label: "Kích thước màn hình", value: "13 inches PixelSense Flow" },
      { label: "Trọng lượng", value: "Xấp xỉ 879 g" },
      { label: "Hệ điều hành", value: "Windows 11 Home" },
      { label: "Phụ kiện tương thích", value: "Surface Pro Signature Keyboard" }
    ],
    "iPad Air M2 11 inch": [
      { label: "Màn hình", value: "11 inches Liquid Retina" },
      { label: "CPU", value: "Apple M2 mạnh mẽ" },
      { label: "Apple Intelligence", value: "Sẵn sàng hỗ trợ AI của Apple" },
      { label: "Bảo mật", value: "Touch ID tích hợp nút nguồn" }
    ],
    "AirPods Pro 2": [
      { label: "Chống ồn chủ động", value: "Gấp 2 lần thế hệ trước (Với chip H2)" },
      { label: "Cổng sạc", value: "USB-C hoặc MagSafe (Tùy phiên bản)" },
      { label: "Âm thanh vòm", value: "Spatial Audio hỗ trợ theo dõi chuyển động đầu" },
      { label: "Định vị hộp sạc", value: "Tích hợp loa tìm kiếm chuẩn xác Precision Finding" }
    ],
    "Apple Watch Ultra 2": [
      { label: "Màn hình", value: "Retina LTPO OLED độ sáng rực rỡ 3000 nits" },
      { label: "Khung máy", value: "Titanium hàng không vũ trụ cao cấp" },
      { label: "Khả năng lặn", value: "EN13319 chống nước cực mạnh, lặn sâu 40m" },
      { label: "Chip xử lý", value: "Apple S9 SiP (Hỗ trợ chạm 2 ngón tay Double Tap)" }
    ],
    "Samsung Galaxy Watch 6 Classic": [
      { label: "Mặt đồng hồ", value: "Kính Sapphire cao cấp" },
      { label: "Điểm nhấn", value: "Viền bezel xoay vật lý độc quyền" },
      { label: "Tính năng sức khỏe", value: "Huyết áp, ECG, Phân tích chỉ số cơ thể BIA" }
    ],
    "Logitech MX Master 3S": [
      { label: "Thiết kế", value: "Công thái học cho cảm giác cầm nắm thoải mái" },
      { label: "Click switch", value: "Quiet Clicks (Silent, cực kỳ êm ái)" },
      { label: "Cảm biến", value: "8000 DPI Darkfield (dùng trên cả kính)" },
      { label: "Cuộn trang", value: "MagSpeed Electromagnetic cuộn 1000 dòng/giây" }
    ],
    "Magic Keyboard iPad Pro": [
      { label: "Thiết kế", value: "Treo từ tính độc đáo (Nổi trên không)" },
      { label: "Bàn phím", value: "Hành trình phím 1mm, có đèn nền" },
      { label: "Trackpad", value: "Tích hợp sẵn hỗ trợ Multi-Touch" }
    ],
    "Xiaomi 14": [
      { label: "Màn hình", value: "6.36-inch LTPO OLED, 120Hz" },
      { label: "Chipset", value: "Qualcomm Snapdragon 8 Gen 3" },
      { label: "Camera", value: "Hệ thống ống kính Leica 75mm" },
      { label: "Pin", value: "4610 mAh, Sạc nhanh 90W" },
      { label: "Hệ điều hành", value: "HyperOS (Android 14)" }
    ],
    "TECNO Camon 30": [
      { label: "Màn hình", value: "6.78-inch AMOLED, 120Hz" },
      { label: "Chipset", value: "MediaTek Helio G99 Ultimate" },
      { label: "RAM/ROM", value: "8GB/12GB + 256GB" },
      { label: "Camera trước", value: "50 MP (Lấy nét tự động)" },
      { label: "Pin", value: "5000 mAh, Sạc nhanh 45W" }
    ],
    "HONOR X8b": [
      { label: "Màn hình", value: "6.7-inch AMOLED, 2000 nits" },
      { label: "CPU", value: "Qualcomm Snapdragon 680" },
      { label: "Camera sau", value: "108 MP (Chụp siêu nét)" },
      { label: "Camera trước", value: "50 MP (Góc nhìn rộng)" },
      { label: "Thiết kế", value: "Siêu mỏng 6.78mm" }
    ],
    "Nubia RedMagic 9 Pro": [
      { label: "Màn hình", value: "6.8-inch AMOLED, 120Hz Full Display" },
      { label: "Chipset", value: "Snapdragon 8 Gen 3" },
      { label: "Tản nhiệt", value: "Quạt tản nhiệt chủ động 22,000 RPM" },
      { label: "Pin/Sạc", value: "6500 mAh, Sạc nhanh 80W" },
      { label: "Gaming", value: "Trigger vai 520Hz, Hệ thống đèn RGB" }
    ],
    "Nokia G42": [
      { label: "Màn hình", value: "6.56-inch IPS LCD, 90Hz" },
      { label: "Hiệu năng", value: "Snapdragon 480+ 5G" },
      { label: "Độ bền", value: "Thiết kế QuickFix (Dễ dàng tự sửa chữa)" },
      { label: "Pin", value: "Thời lượng pin lên đến 3 ngày" },
      { label: "Camera", value: "50 MP với công nghệ AI" }
    ],
    "Infinix Note 40 Pro": [
      { label: "Màn hình", value: "6.78-inch 3D Curved AMOLED, 120Hz" },
      { label: "Chipset", value: "MediaTek Dimensity 7020" },
      { label: "Camera sau", value: "108 MP (OIS) Phóng đại 3x" },
      { label: "Sạc", value: "45W All-Round FastCharge + 20W Sạc từ tính" },
      { label: "Âm thanh", value: "Loa kép được tinh chỉnh bởi JBL" }
    ]
  };

  const genericSpecs = [
    { label: "Xuất xứ", value: "Đang cập nhật" },
    { label: "Năm ra mắt", value: "Mới nhất" },
    { label: "Thương hiệu", value: "Chính hãng" },
    { label: "Trọng lượng", value: "Tiêu chuẩn" }
  ];

  return specsDB[productName] || genericSpecs;
};
