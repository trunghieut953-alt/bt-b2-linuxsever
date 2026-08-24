import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const [editId, setEditId] = useState(null); // Lưu ID của sinh viên đang được sửa

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi lấy danh sách:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // CÂU 60 & 61: Xử lý Thêm mới (POST) hoặc Cập nhật (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      if (editId) {
        // Nếu đang có editId -> Gọi API Cập nhật (Câu 61)
        const res = await fetch(`http://localhost:5000/api/students/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) alert('Cập nhật sinh viên thành công!');
        setEditId(null); // Reset lại trạng thái
      } else {
        // Nếu không có editId -> Gọi API Thêm mới (Câu 60)
        const res = await fetch('http://localhost:5000/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) alert('Thêm sinh viên thành công!');
      }
      setFormData({ studentId: '', name: '', email: '' }); // Xóa trắng form
      fetchStudents(); // CÂU 63: Load lại danh sách
    } catch (error) {
      console.error('Lỗi lưu dữ liệu:', error);
    }
  };

  // CÂU 62: Xử lý Xóa sinh viên (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      try {
        await fetch(`http://localhost:5000/api/students/${id}`, { method: 'DELETE' });
        alert('Xóa thành công!');
        fetchStudents(); // CÂU 63: Load lại danh sách sau khi xóa
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  // Đổ dữ liệu lên form khi bấm nút Sửa
  const handleEditClick = (student) => {
    setFormData({ studentId: student.studentId, name: student.name, email: student.email });
    setEditId(student._id);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Quản lý Sinh Viên (Full CRUD)</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input type="text" name="studentId" placeholder="MSSV" value={formData.studentId} onChange={handleChange} required style={{ padding: '8px', flex: 1 }}/>
        <input type="text" name="name" placeholder="Họ tên" value={formData.name} onChange={handleChange} required style={{ padding: '8px', flex: 2 }}/>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ padding: '8px', flex: 2 }}/>
        <button type="submit" style={{ padding: '10px 20px', background: editId ? '#f59e0b' : '#10b981', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          {editId ? 'Cập Nhật' : 'Thêm Sinh Viên'}
        </button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead style={{ background: '#f4f4f4' }}>
          <tr>
            <th>MSSV</th>
            <th>Họ Tên</th>
            <th>Email</th>
            <th style={{ width: '150px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv._id}>
              <td>{sv.studentId}</td>
              <td>{sv.name}</td>
              <td>{sv.email}</td>
              <td>
                <button onClick={() => handleEditClick(sv)} style={{ marginRight: '10px', padding: '5px 10px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}>Sửa</button>
                <button onClick={() => handleDelete(sv._id)} style={{ padding: '5px 10px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;