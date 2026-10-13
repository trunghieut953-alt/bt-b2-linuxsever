import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const [editId, setEditId] = useState(null);

  // ĐÃ XÓA BIẾN API_BASE_URL VÌ NGINX SẼ TỰ CHUYỂN TIẾP (REVERSE PROXY)

  const fetchStudents = async () => {
    try {
      // SỬA: Dùng đường dẫn tương đối
      const res = await fetch('/api/students');
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

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      let res;
      if (editId) {
        // SỬA: Dùng đường dẫn tương đối
        res = await fetch(`/api/students/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // SỬA: Dùng đường dẫn tương đối
        res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const result = await res.json().catch(() => ({})); 

      if (!res.ok) {
        throw new Error(result.message || result.error || `Mã lỗi Server: ${res.status}`);
      }

      alert(editId ? 'Cập nhật sinh viên thành công!' : 'Thêm sinh viên thành công!');
      setEditId(null);
      setFormData({ studentId: '', name: '', email: '' }); 
      fetchStudents(); 
    } catch (error) {
      console.error('Lỗi lưu dữ liệu:', error);
      alert('THẤT BẠI: ' + error.message); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      try {
        // SỬA: Dùng đường dẫn tương đối
        const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
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
      <h2 style={{ textAlign: 'center', color: '#333' }}>Trần Trung Hiếu - Quản lý Sinh Viên v2.0 </h2>

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