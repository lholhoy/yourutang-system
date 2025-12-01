import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { Plus, Search, Pencil, Trash2, Loader2, User, Download, Filter, ChevronDown } from "lucide-react";

import Modal from "../../components/Modal";
import BorrowerForm from "./BorrowerForm";
import Skeleton from "../../components/Skeleton";

export default function BorrowerList() {
    const [borrowers, setBorrowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBorrower, setSelectedBorrower] = useState(null);

    useEffect(() => {
        fetchBorrowers();
    }, []);

    const fetchBorrowers = async () => {
        try {
            const response = await axiosClient.get("/borrowers");
            setBorrowers(response.data);
        } catch (error) {
            console.error("Error fetching borrowers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this borrower?")) return;
        try {
            await axiosClient.delete(`/borrowers/${id}`);
            setBorrowers(borrowers.filter((b) => b.id !== id));
        } catch (error) {
            console.error("Error deleting borrower:", error);
            alert("Failed to delete borrower");
        }
    };

    const handleBorrowerAdded = () => {
        setIsModalOpen(false);
        setSelectedBorrower(null);
        fetchBorrowers(); // Refresh list
    };

    const handleExport = async () => {
        try {
            const response = await axiosClient.get('/export/borrowers', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `borrowers_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting data:", error);
            alert("Failed to export data");
        }
    };

    const filteredBorrowers = borrowers.filter((borrower) => {
        const matchesSearch = borrower.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all"
            ? true
            : filter === "active"
                ? borrower.active_loans_count > 0
                : borrower.active_loans_count === 0;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-4 w-64 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="flex gap-3">
                        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
                        <div className="h-10 w-36 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Borrowers</h1>
                    <p className="text-gray-500 mt-1">Manage your borrowers and their loan history.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-auto">
                    <button
                        onClick={handleExport}
                        className="btn btn-secondary flex items-center justify-center gap-2 w-auto"
                    >
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={() => {
                            setSelectedBorrower(null);
                            setIsModalOpen(true);
                        }}
                        className="btn btn-primary shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:translate-y-0.5 transition-transform w-auto"
                    >
                        <Plus size={18} />
                        <span>Add Borrower</span>
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-2 rounded-2xl border border-border/50 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search borrowers by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-gray-900 placeholder:text-gray-400"
                    />
                </div>
                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                <div className="relative w-full sm:w-56">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-transparent border-none focus:ring-0 text-gray-700 font-medium cursor-pointer appearance-none"
                    >
                        <option value="all">All Borrowers</option>
                        <option value="active">With Active Loans</option>
                        <option value="inactive">No Active Loans</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBorrowers.map((borrower) => (
                    <div
                        key={borrower.id}
                        className="bg-white rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary-600/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-700 font-bold text-xl shadow-inner border border-white ring-1 ring-gray-100 shrink-0">
                                    {borrower.name.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg truncate">{borrower.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium truncate">{borrower.contact || "No contact"}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => {
                                        setSelectedBorrower(borrower);
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(borrower.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-border/50 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Outstanding</span>
                                <span className="font-bold text-primary">
                                    ₱{Number(borrower.total_outstanding || 0).toLocaleString()}
                                </span>
                            </div>
                            {borrower.notes && (
                                <p className="text-xs text-gray-500 line-clamp-2 italic border-t border-border/50 pt-2 mt-2">{borrower.notes}</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <Link
                                to={`/borrowers/${borrower.id}`}
                                className="w-full btn btn-secondary hover:border-primary hover:text-primary group-hover:shadow-md justify-center py-2.5"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}

                {filteredBorrowers.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 p-6 rounded-full mb-4 animate-bounce-slow">
                            <User className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-xl font-bold text-gray-900">No borrowers found</p>
                        <p className="text-sm text-gray-500 mt-1">Try adjusting your search or add a new borrower.</p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setSelectedBorrower(null);
                                setIsModalOpen(true);
                            }}
                            className="mt-6 btn btn-primary"
                        >
                            Add New Borrower
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedBorrower(null);
                }}
                title={selectedBorrower ? "Edit Borrower" : "Add New Borrower"}
            >
                <BorrowerForm
                    initialData={selectedBorrower}
                    onSuccess={handleBorrowerAdded}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedBorrower(null);
                    }}
                />
            </Modal>
        </div>
    );
}
