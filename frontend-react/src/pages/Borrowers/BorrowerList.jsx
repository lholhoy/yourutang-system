import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { Plus, Search, Pencil, Trash2, Loader2, User, Download } from "lucide-react";

import Modal from "../../components/Modal";
import BorrowerForm from "./BorrowerForm";
import Skeleton from "../../components/Skeleton";

export default function BorrowerList() {
    const [borrowers, setBorrowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
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

    const filteredBorrowers = borrowers.filter((borrower) =>
        borrower.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-10 w-48 mb-2" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-36" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="card p-6">
                            <div className="flex justify-between mb-6">
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div>
                                        <Skeleton className="h-6 w-32 mb-2" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                </div>
                            </div>
                            <Skeleton className="h-16 w-full rounded-xl mb-6" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Borrowers</h1>
                    <p className="text-gray-500 mt-1">Manage your borrowers and their loan history.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="btn btn-secondary"
                    >
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={() => {
                            setSelectedBorrower(null);
                            setIsModalOpen(true);
                        }}
                        className="btn btn-primary shadow-lg shadow-primary/20"
                    >
                        <span>Add Borrower</span>
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search borrowers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field pl-11"
                />
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBorrowers.map((borrower) => (
                    <div
                        key={borrower.id}
                        className="card card-hover p-6 group"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg ring-4 ring-primary/5">
                                    {borrower.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg">{borrower.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{borrower.contact || "No contact"}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => {
                                        setSelectedBorrower(borrower);
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
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

                        <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-border/50">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Total Loans</span>
                                <span className="font-bold text-gray-900">
                                    ₱{Number(borrower.loans_sum_amount || 0).toLocaleString()}
                                </span>
                            </div>
                            {borrower.notes && (
                                <p className="text-xs text-gray-500 line-clamp-2 italic border-t border-border/50 pt-2 mt-2">{borrower.notes}</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <Link
                                to={`/borrowers/${borrower.id}`}
                                className="w-full btn btn-secondary hover:border-primary hover:text-primary group-hover:shadow-md"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}

                {filteredBorrowers.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-900">No borrowers found</p>
                        <p className="text-sm">Try adjusting your search or add a new borrower.</p>
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
