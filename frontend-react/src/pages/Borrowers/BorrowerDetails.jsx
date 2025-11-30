import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";
import { ArrowLeft, Pencil, Trash2, Plus, Banknote, CheckCircle, AlertCircle, FileText } from "lucide-react";

import Modal from "../../components/Modal";
import LoanForm from "../Loans/LoanForm";
import PaymentForm from "../Payments/PaymentForm";
import Skeleton from "../../components/Skeleton";

export default function BorrowerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [borrower, setBorrower] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);

    useEffect(() => {
        fetchBorrower();
    }, [id]);

    const fetchBorrower = async () => {
        try {
            const response = await axiosClient.get(`/borrowers/${id}`);
            setBorrower(response.data);
        } catch (error) {
            console.error("Error fetching borrower:", error);
            if (error.response && error.response.status === 404) {
                navigate("/borrowers");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this borrower?")) return;
        try {
            await axiosClient.delete(`/borrowers/${id}`);
            navigate("/borrowers");
        } catch (error) {
            console.error("Error deleting borrower:", error);
            alert("Failed to delete borrower");
        }
    };

    const handleDeleteLoan = async (loanId) => {
        if (!window.confirm("Are you sure you want to delete this loan record?")) return;
        try {
            await axiosClient.delete(`/loans/${loanId}`);
            fetchBorrower(); // Refresh to update totals
        } catch (error) {
            console.error("Error deleting loan:", error);
            alert("Failed to delete loan");
        }
    };

    const handleLoanAdded = () => {
        setIsLoanModalOpen(false);
        fetchBorrower();
    };

    const handlePaymentAdded = () => {
        setIsPaymentModalOpen(false);
        setSelectedLoan(null);
        fetchBorrower();
    };

    const openPaymentModal = (loan) => {
        setSelectedLoan(loan);
        setIsPaymentModalOpen(true);
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card p-6">
                            <Skeleton className="h-4 w-32 mb-4" />
                            <Skeleton className="h-8 w-40" />
                        </div>
                    ))}
                </div>

                <div className="card">
                    <div className="p-6 border-b border-border flex justify-between">
                        <div>
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-9 w-24" />
                    </div>
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-6 w-16 rounded-full" />
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

    if (!borrower) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Borrower not found</h2>
                <p className="text-gray-500 mt-2">The borrower you are looking for does not exist or has been deleted.</p>
                <Link to="/borrowers" className="btn btn-primary mt-4 inline-flex">
                    Back to Borrowers
                </Link>
            </div>
        );
    }

    // Calculate totals
    const totalOutstanding = borrower.loans?.reduce((sum, loan) => sum + Number(loan.balance), 0) || 0;
    const activeLoansCount = borrower.loans?.filter(l => l.status === 'active').length || 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        to="/borrowers"
                        className="p-2.5 bg-white border border-border rounded-xl hover:bg-gray-50 transition-colors text-gray-500 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{borrower.name}</h1>
                        <div className="flex flex-col gap-1 text-sm text-gray-500 mt-1">
                            {borrower.contact && (
                                <p className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">Contact:</span> {borrower.contact}
                                </p>
                            )}
                            {borrower.email && (
                                <p className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">Email:</span> {borrower.email}
                                </p>
                            )}
                            {borrower.address && (
                                <p className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">Address:</span> {borrower.address}
                                </p>
                            )}
                            {(borrower.id_type || borrower.id_number) && (
                                <p className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">ID:</span>
                                    {borrower.id_type} {borrower.id_number ? `(${borrower.id_number})` : ""}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <a
                        href={`http://localhost:8000/api/export/statement/${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                    >
                        <Banknote size={18} />
                        <span>Statement</span>
                    </a>
                    <Link
                        to={`/borrowers/${id}/edit`}
                        className="btn btn-secondary"
                    >
                        <Pencil size={18} />
                        <span>Edit</span>
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="btn btn-danger"
                    >
                        <Trash2 size={18} />
                        <span>Delete</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8" />
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Total Outstanding</h3>
                    <p className="text-3xl font-bold text-primary tracking-tight">
                        ₱{totalOutstanding.toLocaleString()}
                    </p>
                </div>
                <div className="card p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8" />
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Active Loans</h3>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">
                        {activeLoansCount}
                    </p>
                </div>
                <div className="card p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-8 -mt-8" />
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Total Borrowed</h3>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">
                        ₱{Number(borrower.loans_sum_amount || 0).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Loans Table */}
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/30">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Loan History</h2>
                        <p className="text-sm text-gray-500">List of all loans for this borrower</p>
                    </div>
                    <button
                        onClick={() => setIsLoanModalOpen(true)}
                        className="btn btn-primary text-sm py-2"
                    >
                        Add Loan
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-border">
                            <tr>
                                <th className="table-header">Date</th>
                                <th className="table-header">Amount</th>
                                <th className="table-header">Balance</th>
                                <th className="table-header">Status</th>
                                <th className="table-header text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {borrower.loans && borrower.loans.length > 0 ? (
                                borrower.loans.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="table-cell font-medium text-gray-900">
                                            {new Date(loan.date_borrowed).toLocaleDateString()}
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
                                        <td className="table-cell text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {loan.status !== 'paid' && (
                                                    <>
                                                        <button
                                                            onClick={() => openPaymentModal(loan)}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Add Payment"
                                                        >
                                                            <Banknote size={16} />
                                                        </button>
                                                        <a
                                                            href={`http://localhost:8000/api/export/contract/${loan.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Download Contract"
                                                        >
                                                            <FileText size={16} />
                                                        </a>
                                                    </>
                                                )}
                                                <Link
                                                    to={`/loans/${loan.id}/edit`}
                                                    className="p-1.5 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                    title="Edit Loan"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteLoan(loan.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Loan"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <button
                                            onClick={() => setIsLoanModalOpen(true)}
                                            className="flex flex-col items-center justify-center w-full hover:bg-gray-50 rounded-xl p-4 transition-colors group cursor-pointer"
                                        >
                                            <div className="bg-gray-50 p-3 rounded-full mb-3 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">No loans found</p>
                                            <p className="text-sm mt-1">Click here to add a loan.</p>
                                        </button>
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
                    preselectedBorrowerId={id}
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
