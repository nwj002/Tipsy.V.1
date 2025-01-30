import React, { useEffect, useState } from 'react';
import { Alert, Button, Spinner, Table } from 'react-bootstrap';
import { delUserById, getActivityLogsApi, getUserData } from '../../../apis/api';
import AdminNav from '../../../components/AdminNav';
import FooterCard from '../../../components/FooterCard';

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUserData();
                setUsers(response.data.data || []);
            } catch (error) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        const fetchActivityLogs = async () => {
            try {
                const response = await getActivityLogsApi();
                setActivityLogs(response.data.logs || []);
            } catch (error) {
                setError('Failed to fetch activity logs');
            }
        };

        fetchUsers();
        fetchActivityLogs();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await delUserById(userId);
                setUsers(users.filter(user => user._id !== userId));
            } catch (error) {
                setError('Failed to delete user');
            }
        }
    };

    return (<>
        <div className="container-fluid" style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
            <div className="row">
                <AdminNav />
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <h2 className="my-4" style={{ color: '#D29062' }}>User Management</h2>

                    {loading ? (
                        <Spinner animation="border" variant="primary" />
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <div className="table-responsive">
                            <Table bordered hover className="bg-white" style={{ backgroundColor: '#D8CEC4' }}>
                                <thead>
                                    <tr>
                                        <th style={{ backgroundColor: '#D29062', color: '#FFFFFF' }}>Username</th>
                                        <th style={{ backgroundColor: '#D29062', color: '#FFFFFF' }}>Email</th>
                                        <th style={{ backgroundColor: '#D29062', color: '#FFFFFF' }}>Phone Number</th>
                                        <th style={{ backgroundColor: '#D29062', color: '#FFFFFF' }}>Age</th>
                                        <th style={{ backgroundColor: '#D29062', color: '#FFFFFF' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user._id}>
                                                <td>{user.fullname}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone}</td>
                                                <td>{user.age}</td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDelete(user._id)}
                                                        style={{ backgroundColor: '#D29062', borderColor: '#D29062' }}
                                                    >
                                                        Delete User
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    <h2 className="my-4" style={{ color: '#D29062' }}>Activity Logs</h2>
                    <div className="table-responsive">
                        <Table bordered hover className="bg-white" style={{ backgroundColor: '#D8CEC4' }}>
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: '#D29062', color: '#FFFFFF' }}>User</th>
                                    <th style={{ backgroundColor: '#D29062', color: '#FFFFFF' }}>Action</th>
                                    <th style={{ backgroundColor: '#D29062', color: '#FFFFFF' }}>IP Address</th>
                                    <th style={{ backgroundColor: '#D29062', color: '#FFFFFF' }}>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activityLogs.length > 0 ? (
                                    activityLogs.map((log) => (
                                        <tr key={log._id}>
                                            <td>{log.userID?.email || "Unknown"}</td>
                                            <td>{log.action}</td>
                                            <td>{log.ipAddress}</td>
                                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No activity logs found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </main>
            </div>
        </div>
        <FooterCard />
    </>
    );
};

export default ViewUsers;
