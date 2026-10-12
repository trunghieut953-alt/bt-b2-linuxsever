import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const [editId, setEditId] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/students`);
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

  // HÀM ĐÃ ĐƯỢC NÂNG CẤP ĐỂ BẮT LỖI CHÍNH XÁC TỪ BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      let res;
      if (editId) {
        res = await fetch(`${API_BASE_URL}/api/students/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        res = await fetch(`${API_BASE_URL}/api/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const result = await res.json().catch(() => ({})); 

      // NẾU BACKEND BÁO LỖI (Mã 4xx, 5xx) -> Quăng ra lỗi ngay lập tức
      if (!res.ok) {
        throw new Error(result.message || result.error || `Mã lỗi Server: ${res.status}`);
      }

      // NẾU THÀNH CÔNG THỰC SỰ
      alert(editId ? 'Cập nhật sinh viên thành công!' : 'Thêm sinh viên thành công!');
      setEditId(null);
      setFormData({ studentId: '', name: '', email: '' }); 
      fetchStudents(); 
    } catch (error) {
      console.error('Lỗi lưu dữ liệu:', error);
      alert('THẤT BẠI: ' + error.message); // Hiển thị nguyên nhân thực sự lên màn hình
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/students/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Không thể xóa trên server');
        alert('Xóa thành công!');
        fetchStudents(); 
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Lỗi xóa: ' + error.message);
      }
    }
  };

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