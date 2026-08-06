export const SITE_CONFIG = {
  name: "Nail Book LLC",
  domain: "https://nailbookapp.com",
  phone: "+1 (832) 598-8899",
  email: "support@nailbookapp.com",
  address: "10201 Harwin Dr, Suite 204, Houston, TX 77036, United States",
  social: {
    facebook: "https://facebook.com/nailbookllc",
    instagram: "https://instagram.com/nailbook.app",
  }
};

export const getServices = (lang: string) => {
  if (lang === "EN") {
    return [
      {
        id: "booking-247",
        title: "24/7 Booking & Auto Deposits",
        icon: "Calendar",
        description: "Clients can self-book services, select their preferred Tech, view available slots, and pay a deposit ($10 - $20) instantly to secure their spot, even when the salon is closed.",
      },
      {
        id: "smart-reminders",
        title: "Automated SMS Reminders",
        icon: "Bell",
        description: "System automatically sends confirmation & reminder texts 24 hours and 2 hours prior. Clients can easily 'Confirm' or 'Reschedule', reducing No-Shows by 92%.",
      },
      {
        id: "payroll-commission",
        title: "Automated Payroll & Commissions",
        icon: "Users",
        description: "Automatically calculates commission splits (e.g., 60/40, 70/30), adds Tips, and manages Turn rotations fairly among techs, eliminating salon drama.",
      },
      {
        id: "auto-marketing",
        title: "Auto Marketing & 5-Star Reviews",
        icon: "TrendingUp",
        description: "Automatically detects clients who haven't returned in 30 days to send a $5 Coupon via SMS. After the service, sends a link asking for a 5-star review on Google Maps & Yelp.",
      },
    ];
  }
  return [
    {
      id: "booking-247",
      title: "Đặt Lịch Tự Động 24/7 Qua Web & Mobile App",
      icon: "Calendar",
      description: "Khách hàng tự chọn dịch vụ (Nail Art, Pedicure, Hair Color...), chọn thợ ruột (Tech), xem khung giờ trống và thanh toán tiền cọc (Deposit $10 - $20) giữ chỗ tức thì ngay cả lúc tiệm đã đóng cửa.",
    },
    {
      id: "smart-reminders",
      title: "Nhắc Lịch Hẹn Tự Động Qua SMS & Zalo",
      icon: "Bell",
      description: "Hệ thống tự động gửi tin nhắn xác nhận & nhắc lịch hẹn trước 24 giờ và trước 2 giờ. Khách bấm 'Xác nhận' hoặc 'Đổi giờ' dễ dàng, giảm 92% tình trạng No-Show (bùng hẹn).",
    },
    {
      id: "payroll-commission",
      title: "Quản Lý Thợ & Chia Hoa Hồng (Commission) Tự Động",
      icon: "Users",
      description: "Tự động tính chia tỷ lệ ăn chia (ví dụ 60/40, 70/30), tự cộng tiền Tip, quản lý lượt xoay ca (Turn) giữa các thợ minh bạch, tránh tình trạng tị nạnh trong tiệm.",
    },
    {
      id: "auto-marketing",
      title: "Marketing Tự Động & Kéo Review 5 Sao",
      icon: "TrendingUp",
      description: "Tự động nhận diện khách cũ 30 ngày chưa quay lại để gửi SMS tặng Coupon $5. Sau khi khách làm xong, hệ thống tự động gửi link mời viết đánh giá 5 sao lên Google Maps & Yelp.",
    },
  ];
};

export const getPricingPlans = (lang: string) => {
  if (lang === "EN") {
    return [
      {
        name: "Free",
        priceMonthly: "$0",
        priceYearly: "$0",
        desc: "For testing and new salons",
        features: [
          "1 staff member",
          "30 appointments/month",
          "Email and app notifications",
          "Booking page, link and QR",
          "No SMS included",
        ],
        highlight: false,
        cta: "Start for Free",
      },
      {
        name: "Star",
        priceMonthly: "$24",
        priceYearly: "$240",
        desc: "For teams of 1-4 people",
        features: [
          "Includes 4 staff members",
          "100 shared SMS segments",
          "Smart SMS, clients, payments, contacts",
          "Add member: $10/mo or $100/yr",
          "Membership & Loyalty programs",
        ],
        highlight: false,
        cta: "Register",
      },
      {
        name: "Pro",
        priceMonthly: "$54",
        priceYearly: "$540",
        desc: "For teams of 5-8 people",
        features: [
          "Includes 8 staff members",
          "500 shared SMS segments",
          "Permissions, schedule, commissions and reports",
          "Add member: $10/mo or $100/yr",
          "Lucky Wheel minigame to attract new clients",
          "Membership & Loyalty programs",
        ],
        highlight: true,
        cta: "Register",
      },
      {
        name: "Elite",
        priceMonthly: "$94",
        priceYearly: "$940",
        desc: "For teams of 9-15 people",
        features: [
          "Includes 15 staff members",
          "1,000 shared SMS segments",
          "Large team management and priority support",
          "Add member: $10/mo or $100/yr",
          "Lucky Wheel minigame to attract new clients",
          "Membership & Loyalty programs",
        ],
        highlight: false,
        cta: "Register",
      },
    ];
  }
  return [
    {
      name: "Free",
      priceMonthly: "$0",
      priceYearly: "$0",
      desc: "Thử nghiệm và tiệm mới",
      features: [
        "1 nhân viên",
        "30 lịch hẹn/tháng",
        "Email và thông báo app",
        "Trang đặt lịch, link và QR",
        "Không gồm SMS",
      ],
      highlight: false,
      cta: "Bắt đầu miễn phí",
    },
    {
      name: "Star",
      priceMonthly: "$24",
      priceYearly: "$240",
      desc: "Nhóm 1–4 người",
      features: [
        "Gồm 4 nhân viên",
        "100 SMS segment dùng chung",
        "Smart SMS, khách hàng, thanh toán, liên hệ",
        "Thêm người: $10/tháng hoặc $100/năm",
        "Chương trình thẻ thành viên (Membership)",
      ],
      highlight: false,
      cta: "Đăng Ký",
    },
    {
      name: "Pro",
      priceMonthly: "$54",
      priceYearly: "$540",
      desc: "Nhóm 5–8 người",
      features: [
        "Gồm 8 nhân viên",
        "500 SMS segment dùng chung",
        "Quyền, lịch, hoa hồng và báo cáo",
        "Thêm người: $10/tháng hoặc $100/năm",
        "Minigame Vòng quay may mắn thu hút khách mới",
        "Chương trình thẻ thành viên (Membership)",
      ],
      highlight: true,
      cta: "Đăng Ký",
    },
    {
      name: "Elite",
      priceMonthly: "$94",
      priceYearly: "$940",
      desc: "Nhóm 9–15 người",
      features: [
        "Gồm 15 nhân viên",
        "1.000 SMS segment dùng chung",
        "Quản lý nhóm lớn và hỗ trợ ưu tiên",
        "Thêm người: $10/tháng hoặc $100/năm",
        "Minigame Vòng quay may mắn thu hút khách mới",
        "Chương trình thẻ thành viên (Membership)",
      ],
      highlight: false,
      cta: "Đăng Ký",
    },
  ];
};

export const getTestimonials = (lang: string) => {
  if (lang === "EN") {
    return [
      {
        quote: "We used to get about 5-7 no-shows a week, losing at least $300-$400 in idle time for the techs. Since using Nail Book with the $15 deposit feature and SMS reminders, our no-shows have almost completely disappeared!",
        author: "Kelly Vu",
        role: "Owner, Luxe Nail Lounge (Houston, TX) - 8 Nail Tables, 6 Spa Chairs",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      },
      {
        quote: "My favorite part is the Commission and Tip calculation for techs. At the end of the week, I just click a button and get a summary of what everyone made. No more confusion or drama over 'Turns'. It saves me an entire evening of bookkeeping every week.",
        author: "Kevin Trinh",
        role: "Owner, K-Hair & Beauty Studio (Garden Grove, CA)",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
      },
      {
        quote: "Our young lash techs used to manage their schedules chaotically. Since getting the Nail Book App, clients self-select their favorite tech, choose the lash style, and pay the deposit immediately. Our Google Reviews also jumped from 40 to over 280 5-star ratings thanks to the auto-review feature!",
        author: "Mina Nguyen",
        role: "Founder, Mina Lash & Brow Academy (Atlanta, GA)",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
      },
    ];
  }
  return [
    {
      quote: "Trước đây tiệm bị bùng tầm 5-7 cuộc hẹn mỗi tuần, mất ít nhất $300-$400 tiền công thợ ngồi chờ. Từ ngày xài Nail Book có tính năng bắt cọc $15 khi booking và SMS nhắc hẹn, tiệm gần như không còn khách no-show nữa!",
      author: "Kelly Vũ (Vũ Thị Hồng Hạnh)",
      role: "Chủ Luxe Nail Lounge (Houston, TX) - 8 Bàn Nail, 6 Ghế Spa",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "Cái tôi thích nhất là khoản tính Commission và Tip cho thợ. Cuối tuần chỉ cần bấm 1 nút là ra bảng tổng kết từng thợ được bao nhiêu, không sợ nhầm lẫn hay thợ tị nạnh nhau về Turn làm việc nữa. Tiết kiệm cho tôi mỗi tuần cả buổi tối sổ sách.",
      author: "Kevin Trịnh (Trịnh Quốc Bảo)",
      role: "Owner K-Hair & Beauty Studio (Garden Grove, CA)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "Mấy bé thợ mi tiệm mình trẻ nên lúc trước quản lý lịch rất lộn xộn. Từ ngày có App Nail Book, khách tự vào chọn bé thợ mi yêu thích, chọn mẫu mi rồi cọc tiền luôn. Google Review của tiệm cũng tăng từ 40 lên hơn 280 bài đánh giá 5 sao nhờ tính năng tự xin review!",
      author: "Mina Nguyễn",
      role: "Founder Mina Lash & Brow Academy (Atlanta, GA)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
  ];
};

export const getFaqs = (lang: string) => {
  if (lang === "EN") {
    return [
      { question: "How long does the implementation and setup take?", answer: "It only takes 1-3 business days. Our team will handle the entire setup, including importing your service menu, pricing, and staff list. You can start accepting bookings immediately after." },
      { question: "Does the app support collecting deposits for bookings?", answer: "Yes! You can require clients to pay a flat deposit (e.g. $15) or a percentage of the service upfront using a credit card. This effectively reduces No-Shows and last-minute cancellations." },
      { question: "Will it calculate payroll, commissions, and tips for my technicians?", answer: "Absolutely. The system automatically tracks working hours, calculates commission splits (e.g. 60/40), adds tips, and deducts any supplies fees, generating an accurate payslip with one click." },
      { question: "Is the software easy to use for older technicians who aren't tech-savvy?", answer: "Yes, we designed the interface specifically for the nail industry. It's incredibly straightforward with large buttons and clear colors. Most techs learn how to check their schedule and tips in under 10 minutes." },
      { question: "Does this include a booking website for my salon?", answer: "Yes, every subscription includes a modern, customized booking website featuring your salon's name, logo, and brand colors. You can link this directly to your Google Business page and Instagram." },
      { question: "How does the automated SMS marketing work?", answer: "The system tracks client visit history. If a client hasn't returned in 30 or 60 days, it automatically sends them an SMS with a special offer (like $5 off) to win them back. It also sends birthday texts." },
      { question: "Do you integrate with my existing POS or credit card terminal?", answer: "We integrate directly with Clover, Square, and Stripe. You can seamlessly check out clients from your booking calendar directly to your physical card reader." },
      { question: "Can I manage multiple salon locations from one account?", answer: "Yes, our Enterprise plan is built for multi-location chains. You can view schedules, transfer staff, and track consolidated revenue across all your branches from a single dashboard." },
      { question: "Are there any hidden fees or setup charges?", answer: "No hidden fees. You only pay the flat monthly or annual subscription rate. Standard credit card processing fees (e.g. 2.9% + 30¢ for Stripe) apply only when clients pay online deposits." },
      { question: "What kind of customer support do you provide?", answer: "We provide 24/7 priority support via phone, SMS, and Zalo. Our support team speaks both English and Vietnamese natively to ensure you and your staff always get clear assistance." },
    ];
  }
  
  return [
    { question: "Thời gian triển khai và cài đặt hệ thống mất bao lâu?", answer: "Chỉ mất từ 1-3 ngày làm việc. Đội ngũ của chúng tôi sẽ thiết lập toàn bộ từ Menu dịch vụ, bảng giá đến danh sách thợ. Sau đó, tiệm của bạn có thể bắt đầu nhận lịch đặt ngay lập tức." },
    { question: "App có hỗ trợ thu tiền cọc (Deposit) khi khách đặt lịch không?", answer: "Có! Chủ tiệm có thể yêu cầu khách phải cà thẻ cọc trước một số tiền (ví dụ $15) hoặc cọc theo % dịch vụ. Việc này giúp tiệm giảm thiểu tối đa tình trạng khách bùng lịch (No-Show)." },
    { question: "Hệ thống có tự động tính lương, chia Commission và tiền Tip không?", answer: "Chắc chắn rồi. App tự động tính toán ăn chia theo tỷ lệ (vd 60/40), cộng tiền Tip, trừ tiền supply (hóa chất), và xuất ra bảng lương (Payslip) cực kỳ chuẩn xác chỉ với 1 cú click chuột." },
    { question: "Phần mềm có dễ xài đối với thợ lớn tuổi, không rành công nghệ không?", answer: "Rất dễ sử dụng! Giao diện được thiết kế riêng cho ngành Nail với nút bấm to, màu sắc rõ ràng. Các cô chú thợ lớn tuổi chỉ mất chưa tới 10 phút để biết cách xem lịch và tiền Tip của mình." },
    { question: "Tiệm của tôi có được cung cấp một trang Web đặt lịch riêng không?", answer: "Có, mỗi gói dịch vụ đều bao gồm một trang Web Booking được thiết kế hiện đại, mang tên thương hiệu, logo và màu sắc riêng của tiệm bạn. Bạn có thể gắn link này lên Google, Facebook hoặc Instagram." },
    { question: "Tính năng gửi tin nhắn SMS Marketing tự động hoạt động ra sao?", answer: "Hệ thống tự động theo dõi lịch sử làm đẹp của khách. Nếu 30 hoặc 60 ngày khách chưa quay lại, phần mềm tự động gửi tin nhắn tặng mã giảm giá (Coupon) để kéo khách về. Ngoài ra còn tự động chúc mừng sinh nhật." },
    { question: "Phần mềm có kết nối được với máy cà thẻ (POS terminal) hiện tại của tôi không?", answer: "Chúng tôi có tích hợp trực tiếp với Clover, Square và Stripe. Bạn có thể bấm thanh toán (Checkout) trên màn hình máy tính và số tiền sẽ tự nhảy sang máy cà thẻ của khách." },
    { question: "Tôi có nhiều chi nhánh, liệu có thể quản lý chung trên một ứng dụng không?", answer: "Được chứ. Gói Enterprise của chúng tôi sinh ra dành cho các chuỗi salon. Bạn có thể xem lịch, điều chuyển thợ và xem báo cáo tổng doanh thu của tất cả các chi nhánh chỉ trên 1 màn hình duy nhất." },
    { question: "Chi phí có phát sinh thêm khoản phí ẩn hay phí cài đặt nào không?", answer: "Hoàn toàn không có phí ẩn. Bạn chỉ trả đúng cước phí gói phần mềm hàng tháng/năm. Phí quẹt thẻ (khoảng 2.9% + 30¢ từ Stripe/Square) chỉ áp dụng khi khách cà thẻ thanh toán online." },
    { question: "Nếu gặp sự cố, tôi có được hỗ trợ kỹ thuật bằng tiếng Việt không?", answer: "Có! Chúng tôi hỗ trợ kỹ thuật 24/7 qua điện thoại, tin nhắn SMS và Zalo. Đội ngũ Support 100% người Việt, hiểu rõ cách vận hành của các tiệm Nail tại Mỹ/Canada nên sẽ hỗ trợ bạn cực kỳ nhanh chóng." },
  ];
};
