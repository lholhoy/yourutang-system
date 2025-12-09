import { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import { Plus, Pencil, Trash2, Search, Shield, ShieldAlert, User } from "lucide-react";
import Modal from "../../components/Modal";
import UserForm from "./UserForm";
import { useAuth } from "../../context/AuthContext";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosClient.get("/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axiosClient.delete(`/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. You cannot delete your own account.");
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        fetchUsers();
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
                    <p className="text-gray-500 mt-2">Manage system administrators and users.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="btn btn-primary flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-border/50 shadow-soft overflow-hidden">
                <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/30">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="input-field pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        Total Users: <span className="text-gray-900 font-bold">{filteredUsers.length}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-border/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-10 w-48 bg-gray-200 rounded-lg"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 rounded-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 w-16 bg-gray-200 rounded ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white font-bold shadow-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_admin ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                                                    <Shield size={12} /> Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                                    <User size={12} /> User
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                {currentUser.id !== user.id && (
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedUser ? "Edit User" : "Add New User"}
            >
                <UserForm
                    initialData={selectedUser}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
