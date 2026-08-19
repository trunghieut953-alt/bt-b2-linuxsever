import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });

  // ==========================================
  // CÂU 47: Gọi API lấy danh sách sinh viên
  // ==========================================
  const fetchStudents = async () => {
    try {
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

  // ==========================================
  // CÂU 49: Gửi dữ liệu từ Form lên API POST
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Thêm sinh viên thành công!');
        setFormData({ studentId: '', name: '', email: '' }); 
        fetchStudents(); 
      }
    } catch (error) {
      console.error('Lỗi khi thêm:', error);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Quản lý Sinh Viên</h2>

      {/* ==========================================
          CÂU 48: Tạo Form nhập liệu
          ========================================== */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input type="text" name="studentId" placeholder="Nhập MSSV..." value={formData.studentId} onChange={handleChange} required style={{ padding: '8px' }}/>
        <input type="text" name="name" placeholder="Nhập Họ tên..." value={formData.name} onChange={handleChange} required style={{ padding: '8px' }}/>
        <input type="email" name="email" placeholder="Nhập Email..." value={formData.email} onChange={handleChange} required style={{ padding: '8px' }}/>
        <button type="submit" style={{ padding: '10px', background: '#10b981', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          Thêm Sinh Viên
        </button>
      </form>

      {/* Bảng hiển thị danh sách */}
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#f4f4f4', textAlign: 'left' }}>
          <tr>
            <th>MSSV</th>
            <th>Họ Tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv._id}>
              <td>{sv.studentId}</td>
              <td>{sv.name}</td>
              <td>{sv.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;