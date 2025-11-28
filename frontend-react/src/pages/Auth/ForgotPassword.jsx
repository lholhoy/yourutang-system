import { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setStatus(null);
        setIsLoading(true);
        try {
            const response = await axiosClient.post("/forgot-password", { email });
            setStatus(response.data.status);
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
            <div className="mb-8">
                <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4">
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Login
                </Link>
                <h2 className="text-center text-gray-900 font-bold text-2xl">Reset Password</h2>
                <p className="text-center text-gray-500 mt-2 text-sm">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {status && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm border border-green-100 font-medium">
                        {status}
                    </div>
                )}

                {errors && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        required
                        autoFocus
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn btn-primary py-3 text-base shadow-lg shadow-primary/20"
                >
                    {isLoading && <Loader2 className="animate-spin" size={20} />}
                    Send Reset Link
                </button>
            </form>
        </div>
    );
}
