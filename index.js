const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Lấy port từ biến môi trường, nếu không có thì dùng port 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Tạo một API (Route) cơ bản để kiểm tra
app.get('/', (req, res) => {
    res.send('Backend Server is running on Linux Server!');
});

// Lắng nghe các yêu cầu gửi tới Server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Thêm mongoose
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Đã kết nối thành công với MongoDB Atlas!'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

app.get('/', (req, res) => {
    res.send('Backend Server is running on Linux Server!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});