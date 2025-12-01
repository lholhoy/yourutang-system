import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setIsLoading(true);
        try {
            await register({ name, email, password, password_confirmation: passwordConfirmation });
            toast.success("Account Created Successfully");
            navigate("/login");
        } catch (e) {
            if (e.response && e.response.status === 422) {
                setErrors(e.response.data.errors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Create Account</h2>
                <p className="text-gray-500">Join us to start managing your loans efficiently</p>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-border overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-primary to-primary-600 w-full"></div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {errors && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 animate-fadeIn">
                            <p className="font-medium mb-1">Please fix the errors below:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                                {Object.keys(errors).map((key) => (
                                    <li key={key}>{errors[key][0]}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field pl-10 transition-shadow focus:shadow-md"
                                placeholder=""
                                required
                                autoComplete="name"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-10 transition-shadow focus:shadow-md"
                                placeholder=""
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-10 pr-10 transition-shadow focus:shadow-md"
                                placeholder=""
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type={showPassword ? "text" : "password"}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="input-field pl-10 transition-shadow focus:shadow-md"
                                placeholder=""
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn btn-primary py-3 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
                    >
                        {isLoading && <Loader2 className="animate-spin" size={20} />}
                        Create Account
                    </button>
                </form>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-bold hover:text-primary-700 hover:underline transition-all">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
