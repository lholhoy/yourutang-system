import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";
import { ArrowLeft, Pencil, Trash2, Plus, Banknote, CheckCircle, AlertCircle, FileText, Mail, MapPin, Phone, CreditCard, User } from "lucide-react";

import Modal from "../../components/Modal";
import LoanForm from "../Loans/LoanForm";
import PaymentForm from "../Payments/PaymentForm";
import BorrowerForm from "./BorrowerForm";
import Skeleton from "../../components/Skeleton";

export default function BorrowerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [borrower, setBorrower] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
            <div className="space-y-8 animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-gray-200 rounded-full"></div>
                        <div>
                            <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2"></div>
                            <div className="h-5 w-32 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
                        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
                    <div className="p-6 border-b border-border/50 flex justify-between">
                        <div>
                            <div className="h-6 w-32 bg-gray-200 rounded-lg mb-2"></div>
                            <div className="h-4 w-48 bg-gray-200 rounded-lg"></div>
                        </div>
                        <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!borrower) {
        return (
            <div className="text-center py-20">
                <div className="bg-gray-50 p-6 rounded-full mb-4 inline-block">
                    <User className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Borrower not found</h2>
                <p className="text-gray-500 mt-2">The borrower you are looking for does not exist or has been deleted.</p>
                <Link to="/borrowers" className="btn btn-primary mt-6 inline-flex">
                    Back to Borrowers
                </Link>
            </div>
        );
    }

    // Calculate totals
    const totalOutstanding = borrower.loans?.reduce((sum, loan) => sum + Number(loan.balance), 0) || 0;
    const activeLoansCount = borrower.loans?.filter(l => l.status === 'active').length || 0;

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex items-start gap-6">
                    <Link
                        to="/borrowers"
                        className="p-3 bg-white border border-border rounded-xl hover:bg-gray-50 transition-colors text-gray-500 shadow-sm group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg ring-4 ring-white">
                            {borrower.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{borrower.name}</h1>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-3">
                                {borrower.contact && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-primary" />
                                        <span>{borrower.contact}</span>
                                    </div>
                                )}
                                {borrower.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-primary" />
                                        <span>{borrower.email}</span>
                                    </div>
                                )}
                                {(borrower.full_address || borrower.address) && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-primary" />
                                        <span>{borrower.full_address || borrower.address}</span>
                                    </div>
                                )}
                                {(borrower.id_type || borrower.id_number) && (
                                    <div className="flex items-center gap-2">
                                        <CreditCard size={16} className="text-primary" />
                                        <span>{borrower.id_type} {borrower.id_number ? `(${borrower.id_number})` : ""}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 self-end lg:self-start">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <Pencil size={18} />
                        <span>Edit Profile</span>
                    </button>
                    <a
                        href={`http://localhost:8000/api/export/statement/${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <Banknote size={18} />
                        <span>Statement</span>
                    </a>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-soft relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Total Outstanding</h3>
                    <p className="text-3xl font-bold text-primary tracking-tight">
                        ₱{totalOutstanding.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-soft relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Active Loans</h3>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">
                        {activeLoansCount}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-soft relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Total Borrowed</h3>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">
                        ₱{Number(borrower.loans_sum_amount || 0).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Loans Table */}
            <div className="bg-white rounded-2xl border border-border/50 shadow-soft overflow-hidden">
                <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Loan History</h2>
                        <p className="text-sm text-gray-500">List of all loans for this borrower</p>
                    </div>
                    <button
                        onClick={() => setIsLoanModalOpen(true)}
                        className="btn btn-primary text-sm py-2.5 px-4 flex items-center gap-2 shadow-md shadow-primary/20"
                    >
                        <Plus size={18} />
                        Add Loan
                    </button>
                </div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left relative">
                        <thead className="bg-gray-50/50 border-b border-border/50 sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Balance</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {borrower.loans && borrower.loans.length > 0 ? (
                                borrower.loans.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {new Date(loan.date_borrowed).toLocaleDateString()}
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
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                {loan.status !== 'paid' && (
                                                    <>
                                                        <button
                                                            onClick={() => openPaymentModal(loan)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Add Payment"
                                                        >
                                                            <Banknote size={16} />
                                                        </button>
                                                        <a
                                                            href={`http://localhost:8000/api/export/contract/${loan.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Download Contract"
                                                        >
                                                            <FileText size={16} />
                                                        </a>
                                                    </>
                                                )}
                                                <Link
                                                    to={`/loans/${loan.id}/edit`}
                                                    className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                    title="Edit Loan"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteLoan(loan.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                                    <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                                        <button
                                            onClick={() => setIsLoanModalOpen(true)}
                                            className="flex flex-col items-center justify-center w-full hover:bg-gray-50 rounded-xl p-6 transition-colors group cursor-pointer border-2 border-dashed border-gray-200 hover:border-primary/30"
                                        >
                                            <div className="bg-gray-50 p-4 rounded-full mb-3 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                <Plus className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">No loans found</p>
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

            {/* Edit Borrower Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Borrower"
            >
                <BorrowerForm
                    initialData={borrower}
                    onSuccess={() => {
                        setIsEditModalOpen(false);
                        fetchBorrower();
                    }}
                    onCancel={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
