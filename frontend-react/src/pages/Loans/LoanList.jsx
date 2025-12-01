import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { Plus, Search, Pencil, Trash2, Loader2, User, Calendar, Banknote, CheckCircle, AlertCircle, Filter, ChevronDown } from "lucide-react";

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
        setSelectedLoan(null);
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
            <div className="space-y-8 animate-pulse">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="h-8 w-32 bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-5 w-48 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="flex gap-4">
                    <div className="h-12 flex-1 bg-gray-200 rounded-xl"></div>
                    <div className="h-12 w-48 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
                    <div className="p-4 border-b border-border/50">
                        <div className="flex justify-between">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-6 w-24 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Loans</h1>
                    <p className="text-gray-500 mt-1">Manage all loan records.</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedLoan(null);
                        setIsLoanModalOpen(true);
                    }}
                    className="btn btn-primary shadow-lg shadow-primary/20 flex items-center gap-2 hover:translate-y-0.5 transition-transform"
                >
                    <Plus size={18} />
                    <span>Add Loan</span>
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-2 rounded-2xl border border-border/50 shadow-sm">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by borrower name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-gray-900 placeholder:text-gray-400"
                    />
                </div>

                <div className="h-8 w-px bg-gray-200 hidden sm:block self-center"></div>

                {/* Filter */}
                <div className="relative w-full sm:w-56">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-transparent border-none focus:ring-0 text-gray-700 font-medium cursor-pointer appearance-none"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active (Unpaid)</option>
                        <option value="paid">Paid</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-border/50 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-border/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Borrower</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Balance</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredLoans.map((loan) => (
                                <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-white shadow-sm">
                                                {loan.borrower.name.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-gray-900">{loan.borrower.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        ₱{Number(loan.amount).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`font-bold ${Number(loan.balance) > 0 ? 'text-primary' : 'text-green-600'}`}>
                                            ₱{Number(loan.balance).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {loan.status === 'paid' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                                                <CheckCircle size={12} /> Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                <AlertCircle size={12} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            {new Date(loan.date_borrowed).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {loan.status !== 'paid' && (
                                                <button
                                                    onClick={() => openPaymentModal(loan)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Add Payment"
                                                >
                                                    <Banknote size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setSelectedLoan(loan);
                                                    setIsLoanModalOpen(true);
                                                }}
                                                className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(loan.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                                    <td colSpan="6" className="px-6 py-24 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-gray-50 p-4 rounded-full mb-4 animate-bounce-slow">
                                                <Search className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-lg font-bold text-gray-900">No loans found</p>
                                            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or add a new loan.</p>
                                            <button
                                                onClick={() => {
                                                    setSearch("");
                                                    setStatusFilter("all");
                                                    setSelectedLoan(null);
                                                    setIsLoanModalOpen(true);
                                                }}
                                                className="mt-6 btn btn-primary"
                                            >
                                                Add New Loan
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Loan Modal */}
            <Modal
                isOpen={isLoanModalOpen}
                onClose={() => {
                    setIsLoanModalOpen(false);
                    setSelectedLoan(null);
                }}
                title={selectedLoan ? "Edit Loan" : "Add New Loan"}
            >
                <LoanForm
                    initialData={selectedLoan}
                    onSuccess={handleLoanAdded}
                    onCancel={() => {
                        setIsLoanModalOpen(false);
                        setSelectedLoan(null);
                    }}
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
