const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối thành công với MongoDB Atlas!'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// --- ĐỊNH NGHĨA MODEL SINH VIÊN ---
const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema);

// --- CÁC API ROUTES CHO CRUD ---

// 1. Lấy danh sách sinh viên (GET)
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Thêm sinh viên mới (POST)
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 3. Cập nhật sinh viên (PUT)
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. Xóa sinh viên (DELETE)
app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Đã xóa sinh viên thành công" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Route kiểm tra server cơ bản
app.get('/', (req, res) => {
    res.send('Backend Server is running on Linux Server!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});