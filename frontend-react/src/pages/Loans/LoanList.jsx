import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { Plus, Search, Pencil, Trash2, Loader2, User, Calendar, Banknote, CheckCircle, AlertCircle } from "lucide-react";

import Modal from "../../components/Modal";
import LoanForm from "./LoanForm";
import PaymentForm from "../Payments/PaymentForm";
import Skeleton from "../../components/Skeleton";

export default function LoanList() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);

    useEffect(() => {
        fetchLoans();
    }, [statusFilter]);

    const fetchLoans = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter !== "all") params.status = statusFilter;

            const response = await axiosClient.get("/loans", { params });
            setLoans(response.data);
        } catch (error) {
            console.error("Error fetching loans:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this loan?")) return;
        try {
            await axiosClient.delete(`/loans/${id}`);
            setLoans(loans.filter((l) => l.id !== id));
        } catch (error) {
            console.error("Error deleting loan:", error);
            alert("Failed to delete loan");
        }
    };

    const handleLoanAdded = () => {
        setIsLoanModalOpen(false);
        fetchLoans();
    };

    const handlePaymentAdded = () => {
        setIsPaymentModalOpen(false);
        setSelectedLoan(null);
        fetchLoans();
    };

    const openPaymentModal = (loan) => {
        setSelectedLoan(loan);
        setIsPaymentModalOpen(true);
    };

    const filteredLoans = loans.filter((loan) =>
        loan.borrower.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-10 w-32 mb-2" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <div className="card">
                    <div className="p-4 border-b border-border">
                        <div className="flex justify-between">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Skeleton key={i} className="h-6 w-24" />
                            ))}
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-5 w-24" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Loans</h1>
                    <p className="text-gray-500 mt-1">Manage all loan records.</p>
                </div>
                <button
                    onClick={() => setIsLoanModalOpen(true)}
                    className="btn btn-primary shadow-lg shadow-primary/20"
                >
                    <span>Add Loan</span>
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by borrower name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-11"
                    />
                </div>

                {/* Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field w-full sm:w-48"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active (Unpaid)</option>
                    <option value="paid">Paid</option>
                </select>
            </div>

            {/* List */}
            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-border">
                            <tr>
                                <th className="table-header">Borrower</th>
                                <th className="table-header">Amount</th>
                                <th className="table-header">Balance</th>
                                <th className="table-header">Status</th>
                                <th className="table-header">Date</th>
                                <th className="table-header text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredLoans.map((loan) => (
                                <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-primary/5">
                                                {loan.borrower.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-900">{loan.borrower.name}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell font-medium text-gray-900">
                                        ₱{Number(loan.amount).toLocaleString()}
                                    </td>
                                    <td className="table-cell font-bold text-primary">
                                        ₱{Number(loan.balance).toLocaleString()}
                                    </td>
                                    <td className="table-cell">
                                        {loan.status === 'paid' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle size={12} /> Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <AlertCircle size={12} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="table-cell text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            {new Date(loan.date_borrowed).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="table-cell text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {loan.status !== 'paid' && (
                                                <button
                                                    onClick={() => openPaymentModal(loan)}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Add Payment"
                                                >
                                                    <Banknote size={18} />
                                                </button>
                                            )}
                                            <Link
                                                to={`/loans/${loan.id}/edit`}
                                                className="p-1.5 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(loan.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLoans.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                                                <Search className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-lg font-medium text-gray-900">No loans found</p>
                                            <p className="text-sm">Try adjusting your search or add a new loan.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Loan Modal */}
            <Modal
                isOpen={isLoanModalOpen}
                onClose={() => setIsLoanModalOpen(false)}
                title="Add New Loan"
            >
                <LoanForm
                    onSuccess={handleLoanAdded}
                    onCancel={() => setIsLoanModalOpen(false)}
                />
            </Modal>

            {/* Add Payment Modal */}
            <Modal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                title="Record Payment"
            >
                {selectedLoan && (
                    <PaymentForm
                        loan={selectedLoan}
                        onSuccess={handlePaymentAdded}
                        onCancel={() => setIsPaymentModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
}
