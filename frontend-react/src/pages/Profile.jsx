import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axios";
import { Camera, Loader2, Save, User } from "lucide-react";

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
            // Update user with new photo URL
            // We need to refresh user data or manually update the state
            // For simplicity, let's assume the backend returns the full URL or we construct it
            // But the best way is to re-fetch user or update local state if we know the path
            // The backend response returns 'profile_image' path.

            // Let's re-fetch user to be safe and consistent
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
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profile Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account information and password.</p>
            </div>

            <div className="card p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg ring-1 ring-gray-200">
                            {user?.profile_image ? (
                                <img
                                    src={`http://localhost:8000/storage/${user.profile_image}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                    <User size={48} />
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
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
                    <p className="text-sm font-medium text-primary mt-3 hover:underline cursor-pointer" onClick={handlePhotoClick}>Change Profile Photo</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {message && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            {message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                required
                            />
                            {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                required
                            />
                            {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Change Password</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="input-field"
                                    placeholder="Leave blank to keep current password"
                                />
                                {errors?.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password[0]}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="input-field"
                                    />
                                    {errors?.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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

                    <div className="flex justify-end pt-6 border-t border-border">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary px-8"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
