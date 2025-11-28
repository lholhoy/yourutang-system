import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setIsLoading(true);
        try {
            await login({ email, password, remember });
        } catch (e) {
            if (e.response && e.response.status === 422) {
                setErrors(e.response.data.errors);
            } else {
                const msg = e.response?.data?.message || e.message || "Unknown error";
                const status = e.response?.status || "No Status";
                setErrors({ email: [`Error ${status}: ${msg}`] });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-center text-gray-500 mb-8 font-medium">Sign in to your account</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                {errors && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex flex-col gap-1">
                        {Object.keys(errors).map((key) => (
                            <p key={key} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {errors[key][0]}
                            </p>
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
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Password</label>
                        <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-primary-700 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field pr-10"
                            required
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
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                        Remember me
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn btn-primary py-3 text-base shadow-lg shadow-primary/20"
                >
                    {isLoading && <Loader2 className="animate-spin" size={20} />}
                    Sign In
                </button>
            </form>
            <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-semibold hover:text-primary-700 hover:underline transition-all">
                    Create one
                </Link>
            </p>
        </div>
    );
}
