import { useEffect, useState } from "react";
import axiosClient from "../api/axios";
import { Clock, Loader2 } from "lucide-react";
import { format } from "date-fns"; // We might need date-fns, or just use native Date

export default function HistoryLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const fetchLogs = async () => {
        try {
            const response = await axiosClient.get(`/history?page=${page}`);
            if (page === 1) {
                setLogs(response.data.data);
            } else {
                setLogs((prev) => [...prev, ...response.data.data]);
            }
            setHasMore(!!response.data.next_page_url);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
        }).format(date);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <Clock className="text-primary w-8 h-8" />
                    History Logs
                </h1>
                <p className="text-gray-500 mt-1 ml-11">View recent system activities and changes.</p>
            </div>

            <div className="card overflow-hidden">
                <div className="divide-y divide-border/50">
                    {logs.map((log) => (
                        <div key={log.id} className="p-5 hover:bg-gray-50/50 transition-colors group">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                        {log.user?.name || 'System'}
                                    </p>
                                    <p className="text-gray-600 mt-1 text-sm">{log.description}</p>
                                </div>
                                <span className="text-xs font-medium text-gray-400 whitespace-nowrap bg-gray-100 px-2 py-1 rounded-md">
                                    {formatDate(log.created_at)}
                                </span>
                            </div>
                        </div>
                    ))}

                    {logs.length === 0 && !loading && (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <Clock className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="font-medium">No history logs found.</p>
                        </div>
                    )}
                </div>

                {hasMore && (
                    <div className="p-4 text-center border-t border-border bg-gray-50/30">
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={loading}
                            className="text-primary font-medium hover:underline disabled:opacity-50 text-sm"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading...
                                </span>
                            ) : "Load More"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
