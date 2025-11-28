import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";
import { Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [token] = useState(searchParams.get("token"));

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid reset link");
            navigate("/login");
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setIsLoading(true);
        try {
            await axiosClient.post("/reset-password", {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            toast.success("Password has been reset!");
            navigate("/login");
        } catch (e) {
            if (e.response && e.response.status === 422) {
                setErrors(e.response.data.errors);
            } else {
                setErrors({ email: [e.response?.data?.message || "Something went wrong"] });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-center text-gray-900 font-bold text-2xl mb-2">Set New Password</h2>
            <p className="text-center text-gray-500 mb-8 text-sm">
                Create a new secure password for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {errors && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}

                <input type="hidden" value={token} />

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        required
                        readOnly
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field pr-10"
                            required
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn btn-primary py-3 text-base shadow-lg shadow-primary/20"
                >
                    {isLoading && <Loader2 className="animate-spin" size={20} />}
                    Reset Password
                </button>
            </form>
        </div>
    );
}
