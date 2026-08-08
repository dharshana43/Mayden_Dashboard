import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
    const [data, setData] = useState([]);
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token) {
            navigate('/login');
            return;
        }

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        axios.get('http://localhost:5000/api/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            setData(response.data.data);
        })
        .catch((err) => {
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const latest = data.length > 0 ? data[0] : null;

    const formatDate = (dateString) => {
        return dateString.split('T')[0];
    };

    const filteredData = data.filter((row) => {
        const term = searchTerm.toLowerCase();
        return (
            formatDate(row.entry_date).includes(term) ||
            String(row.policies).includes(term) ||
            String(row.corporates).includes(term) ||
            String(row.active_members).includes(term) ||
            String(row.inactive_members).includes(term) ||
            String(row.total_members).includes(term) ||
            String(row.total_lives).includes(term)
        );
    });

    const handleExportExcel = () => {
        const headers = ['SL.NO', 'DATE', 'POLICIES', 'CORPORATES', 'ACTIVE MEMBERS', 'INACTIVE MEMBERS', 'TOTAL MEMBERS', 'TOTAL LIVES'];
        const rows = filteredData.map((row, index) => [
            index + 1,
            formatDate(row.entry_date),
            row.policies,
            row.corporates,
            row.active_members,
            row.inactive_members,
            row.total_members,
            row.total_lives
        ]);

        let csvContent = headers.join(',') + '\n';
        rows.forEach((row) => {
            csvContent += row.join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'dashboard_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-item active">Dashboard</div>
                <div className="sidebar-item">Configuration</div>
                <div className="sidebar-item">Online Data</div>
                <div className="sidebar-item">RFQ</div>
                <div className="sidebar-item">Online Enrollment</div>
                <div className="sidebar-item">Cash Deposit Balance</div>
                <div className="sidebar-item">VAS</div>
                <div className="sidebar-item">Reports And Analysis</div>
                <div className="sidebar-item">Utility</div>
                <div className="sidebar-item">Claim Intimation</div>
                <div className="sidebar-item">Claim Submission</div>
                <div className="sidebar-item">Online Payment Status</div>
                <div className="sidebar-item">Natural Submission</div>
            </aside>

            <main className="main-content">
                <div className="topbar">
                    <span className="app-title">Dashboard</span>
                    <div className="topbar-right">
                        <span>Welcome, {user ? user.name : ''}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>

                <div className="cards-row">
                    <div className="card">
                        <div className="card-icon icon-policy">📄</div>
                        <div className="card-text">
                            <div className="card-label">Policy</div>
                            <div className="card-value">{latest ? latest.policies : 0}</div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-icon icon-corporates">🏢</div>
                        <div className="card-text">
                            <div className="card-label">Corporates</div>
                            <div className="card-value">{latest ? latest.corporates : 0}</div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-icon icon-employees">👥</div>
                        <div className="card-text">
                            <div className="card-label">Employees</div>
                            <div className="card-value">{latest ? latest.total_members : 0}</div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-icon icon-lives">👨‍👩‍👧</div>
                        <div className="card-text">
                            <div className="card-label">Lives</div>
                            <div className="card-value">{latest ? latest.total_lives : 0}</div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-icon icon-insurer">☂️</div>
                        <div className="card-text">
                            <div className="card-label">Insurer</div>
                            <div className="card-value">{latest ? latest.insurers : 0}</div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-icon icon-payer">₹</div>
                        <div className="card-text">
                            <div className="card-label">Payer</div>
                            <div className="card-value">{latest ? latest.payers : 0}</div>
                        </div>
                    </div>
                </div>

                <div className="table-section">
                    <div className="table-toolbar">
                        <button className="export-btn" onClick={handleExportExcel}>Excel</button>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>SL.NO</th>
                                <th>DATE</th>
                                <th>POLICIES</th>
                                <th>CORPORATES</th>
                                <th>ACTIVE MEMBERS</th>
                                <th>INACTIVE MEMBERS</th>
                                <th>TOTAL MEMBERS</th>
                                <th>TOTAL LIVES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row, index) => (
                                <tr key={row.id}>
                                    <td>{index + 1}</td>
                                    <td>{formatDate(row.entry_date)}</td>
                                    <td>{row.policies}</td>
                                    <td>{row.corporates}</td>
                                    <td>{row.active_members}</td>
                                    <td>{row.inactive_members}</td>
                                    <td>{row.total_members}</td>
                                    <td>{row.total_lives}</td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>No data found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
