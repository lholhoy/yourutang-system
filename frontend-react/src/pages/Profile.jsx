import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axios";
import { Camera, Loader2, Save, User, Lock, Mail, Type } from "lucide-react";

export default function Profile() {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState(null);
    const fileInputRef = useRef(null);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setErrors(null);

        try {
            const payload = {
                name,
                email,
                ...(newPassword && {
                    current_password: currentPassword,
                    password: newPassword,
                    password_confirmation: confirmPassword,
                }),
            };
            const response = await axiosClient.put("/profile", payload);
            setUser(response.data.user);
            setMessage("Profile updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error updating profile:", error);
                alert("Failed to update profile");
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("photo", file);

        setPhotoLoading(true);
        try {
            const response = await axiosClient.post("/profile/photo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const userRes = await axiosClient.get("/user");
            setUser(userRes.data);

            setMessage("Photo uploaded successfully!");
        } catch (error) {
            console.error("Error uploading photo:", error);
            const msg = error.response?.data?.message || "Failed to upload photo";
            alert(msg);
        } finally {
            setPhotoLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profile Settings</h1>
                <p className="text-gray-500 mt-2">Manage your account information and security preferences.</p>
            </div>

            <div className="bg-white rounded-2xl border border-border/50 shadow-soft overflow-hidden">
                <div className="p-8 border-b border-border/50 bg-gray-50/30">
                    <div className="flex flex-col items-center">
                        <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg ring-1 ring-gray-200 transition-transform group-hover:scale-105 duration-300">
                                {user?.profile_image ? (
                                    <img
                                        src={`http://localhost:8000/storage/${user.profile_image}`}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                        <User size={56} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                {photoLoading ? (
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                ) : (
                                    <Camera className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                        </div>
                        <button
                            onClick={handlePhotoClick}
                            className="mt-4 text-sm font-semibold text-primary hover:text-primary-600 transition-colors"
                        >
                            Change Profile Photo
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                        {message && (
                            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                {message}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Type className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-field pl-10"
                                        required
                                    />
                                </div>
                                {errors?.name && <p className="text-red-500 text-xs">{errors.name[0]}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field pl-10"
                                        required
                                    />
                                </div>
                                {errors?.email && <p className="text-red-500 text-xs">{errors.email[0]}</p>}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border/50">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-gray-400" />
                                Change Password
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="input-field"
                                        placeholder="Leave blank to keep current password"
                                    />
                                    {errors?.current_password && <p className="text-red-500 text-xs">{errors.current_password[0]}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="input-field"
                                        />
                                        {errors?.password && <p className="text-red-500 text-xs">{errors.password[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-border/50">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary px-8 py-2.5 shadow-lg shadow-primary/20"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
