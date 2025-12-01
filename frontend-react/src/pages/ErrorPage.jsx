import { useRouteError, Link } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center p-8">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Oops!</h1>
                <p className="text-gray-500 mb-6">Sorry, an unexpected error has occurred.</p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
                    <p className="text-sm font-mono text-gray-600">
                        {error.statusText || error.message}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="btn btn-primary flex items-center justify-center gap-2"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-secondary flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} />
                        Reload Page
                    </button>
                </div>
            </div>
        </div>
    );
}
