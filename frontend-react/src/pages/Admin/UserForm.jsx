import { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import { User, Mail, Lock, Shield, Loader2, Save } from "lucide-react";

export default function UserForm({ initialData, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        is_admin: false,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                password: "",
                password_confirmation: "",
                is_admin: Boolean(initialData.is_admin),
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        try {
            if (initialData) {
                await axiosClient.put(`/users/${initialData.id}`, formData);
            } else {
                await axiosClient.post("/users", formData);
            }
            onSuccess();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error saving user:", error);
                alert("Failed to save user");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field pl-10"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    {errors?.name && <p className="text-red-500 text-xs">{errors.name[0]}</p>}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field pl-10"
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                    {errors?.email && <p className="text-red-500 text-xs">{errors.email[0]}</p>}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        {initialData ? "New Password (leave blank to keep current)" : "Password"}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field pl-10"
                            placeholder="••••••••"
                            required={!initialData}
                        />
                    </div>
                    {errors?.password && <p className="text-red-500 text-xs">{errors.password[0]}</p>}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="input-field pl-10"
                            placeholder="••••••••"
                            required={!initialData}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <label className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            name="is_admin"
                            checked={formData.is_admin}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        <div className="flex items-center gap-2">
                            <Shield className={`w-5 h-5 ${formData.is_admin ? 'text-primary' : 'text-gray-400'}`} />
                            <div>
                                <p className="font-semibold text-gray-900">Administrator Access</p>
                                <p className="text-xs text-gray-500">Can manage users and system settings</p>
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/50">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary flex-1"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {initialData ? "Update User" : "Create User"}
                </button>
            </div>
        </form>
    );
}
