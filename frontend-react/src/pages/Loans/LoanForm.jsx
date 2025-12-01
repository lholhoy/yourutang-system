import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { ArrowLeft, Loader2, Save, Calculator, Banknote, Calendar, Percent, Clock, FileText, User } from "lucide-react";
import AmortizationModal from "../../components/AmortizationModal";

export default function LoanForm({ onSuccess, onCancel, initialData, preselectedBorrowerId }) {
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    // If in modal (onCancel exists), ignore routeId unless it's explicitly passed via initialData
    // This prevents picking up 'id' from parent routes (like BorrowerDetails /borrowers/:id)
    const loanId = initialData?.id || (!onCancel ? routeId : null);
    const isEditing = !!loanId;

    const [formData, setFormData] = useState({
        borrower_id: preselectedBorrowerId || "",
        amount: "",
        date_borrowed: new Date().toISOString().split('T')[0],
        description: "",
        interest_rate: 0,
        interest_type: "monthly",
        term_months: 1,
        term_unit: "months",
        due_date: "",
    });
    const [borrowers, setBorrowers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    const [isAmortizationOpen, setIsAmortizationOpen] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const borrowersRes = await axiosClient.get("/borrowers");
                setBorrowers(borrowersRes.data);

                if (initialData) {
                    setFormData({
                        borrower_id: initialData.borrower_id,
                        amount: initialData.amount,
                        date_borrowed: initialData.date_borrowed,
                        description: initialData.description || "",
                        interest_rate: initialData.interest_rate || 0,
                        interest_type: initialData.interest_type || "monthly",
                        term_months: initialData.term_months || 1,
                        term_unit: initialData.term_unit || "months",
                        due_date: initialData.due_date || "",
                    });
                } else if (loanId && !initialData) {
                    const loanRes = await axiosClient.get(`/loans/${loanId}`);
                    setFormData({
                        borrower_id: loanRes.data.borrower_id,
                        amount: loanRes.data.amount,
                        date_borrowed: loanRes.data.date_borrowed,
                        description: loanRes.data.description || "",
                        interest_rate: loanRes.data.interest_rate || 0,
                        interest_type: loanRes.data.interest_type || "monthly",
                        term_months: loanRes.data.term_months || 1,
                        term_unit: loanRes.data.term_unit || "months",
                        due_date: loanRes.data.due_date || "",
                    });
                }
            } catch (error) {
                console.error("Error initializing form:", error);
                if (isEditing && !initialData) navigate("/loans");
            } finally {
                setInitialLoading(false);
            }
        };
        init();
    }, [loanId, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        try {
            const payload = { ...formData };
            if (!payload.due_date) payload.due_date = null;
            if (!payload.interest_rate) payload.interest_rate = 0;

            if (isEditing) {
                const targetId = loanId || initialData.id;
                await axiosClient.put(`/loans/${targetId}`, payload);
            } else {
                await axiosClient.post("/loans", payload);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                navigate("/loans");
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error saving loan:", error);
                alert("Failed to save loan");
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const isModal = !!onCancel;

    return (
        <div className={isModal ? "" : "max-w-4xl mx-auto"}>
            {!isModal && (
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        to="/loans"
                        className="p-2.5 bg-white border border-border rounded-xl hover:bg-gray-50 transition-colors text-gray-500 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {isEditing ? "Edit Loan" : "Add New Loan"}
                        </h1>
                        <p className="text-gray-500 text-sm">Fill in the details below to save the loan record.</p>
                    </div>
                </div>
            )}

            <div className={isModal ? "" : "bg-white rounded-2xl border border-border shadow-soft overflow-hidden"}>
                {/* Header Gradient Line */}
                <div className="h-1.5 bg-gradient-to-r from-primary to-primary-600 w-full"></div>

                <form onSubmit={handleSubmit} className={isModal ? "space-y-6" : "p-6 sm:p-8 space-y-8"}>
                    {/* Borrower Selection */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div className="p-2 bg-primary-50 rounded-lg text-primary">
                                <User size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Borrower Information</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Select Borrower <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.borrower_id}
                                    onChange={(e) => setFormData({ ...formData, borrower_id: e.target.value })}
                                    className="input-field appearance-none"
                                    required
                                    disabled={isEditing || !!preselectedBorrowerId}
                                    autoFocus={isModal && !preselectedBorrowerId}
                                >
                                    <option value="">Select a borrower</option>
                                    {borrowers.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            {errors?.borrower_id && <p className="text-red-500 text-xs mt-1">{errors.borrower_id[0]}</p>}
                        </div>
                    </div>

                    {/* Loan Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div className="p-2 bg-primary-50 rounded-lg text-primary">
                                <Banknote size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Loan Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Amount (₱) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₱</span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="input-field pl-7"
                                        placeholder="0.00"
                                        required
                                        autoFocus={isModal && !!preselectedBorrowerId}
                                    />
                                </div>
                                {errors?.amount && <p className="text-red-500 text-xs mt-1">{errors.amount[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Date Borrowed <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        value={formData.date_borrowed}
                                        onChange={(e) => setFormData({ ...formData, date_borrowed: e.target.value })}
                                        className="input-field pl-10"
                                        required
                                    />
                                </div>
                                {errors?.date_borrowed && <p className="text-red-500 text-xs mt-1">{errors.date_borrowed[0]}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Terms & Interest */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div className="p-2 bg-primary-50 rounded-lg text-primary">
                                <Percent size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Terms & Interest</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Interest Rate
                                </label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.interest_rate}
                                            onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                                            className="input-field"
                                            placeholder="0"
                                        />
                                    </div>
                                    <select
                                        value={formData.interest_type}
                                        onChange={(e) => setFormData({ ...formData, interest_type: e.target.value })}
                                        className="input-field w-full sm:w-32 appearance-none bg-gray-50"
                                    >
                                        <option value="monthly">% / Month</option>
                                        <option value="daily">% / Day</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Loan Term
                                </label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.term_months}
                                            onChange={(e) => {
                                                const term = e.target.value;
                                                // Auto-calculate due date
                                                const date = new Date(formData.date_borrowed);
                                                if (formData.term_unit === 'weeks') {
                                                    date.setDate(date.getDate() + (parseInt(term || 0) * 7));
                                                } else {
                                                    date.setMonth(date.getMonth() + parseInt(term || 0));
                                                }
                                                setFormData({
                                                    ...formData,
                                                    term_months: term,
                                                    due_date: date.toISOString().split('T')[0]
                                                });
                                            }}
                                            className="input-field"
                                            placeholder="1"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            value={formData.term_unit}
                                            onChange={(e) => {
                                                const unit = e.target.value;
                                                // Recalculate due date based on new unit
                                                const term = formData.term_months;
                                                const date = new Date(formData.date_borrowed);
                                                if (unit === 'weeks') {
                                                    date.setDate(date.getDate() + (parseInt(term || 0) * 7));
                                                } else {
                                                    date.setMonth(date.getMonth() + parseInt(term || 0));
                                                }
                                                setFormData({
                                                    ...formData,
                                                    term_unit: unit,
                                                    due_date: date.toISOString().split('T')[0]
                                                });
                                            }}
                                            className="input-field flex-1 sm:w-32 appearance-none bg-gray-50"
                                        >
                                            <option value="months">Months</option>
                                            <option value="weeks">Weeks</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsAmortizationOpen(true)}
                                            className="btn btn-secondary px-3 text-primary hover:text-primary-700 hover:bg-primary-50 border-primary/20"
                                            title="View Amortization Schedule"
                                        >
                                            <Calculator size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Due Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        value={formData.due_date}
                                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                        className="input-field pl-10 bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div className="p-2 bg-primary-50 rounded-lg text-primary">
                                <FileText size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
                        </div>

                        <div>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="input-field resize-none"
                                placeholder="Optional description or remarks..."
                            />
                            {errors?.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-border">
                        {onCancel ? (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="btn btn-secondary w-auto px-6"
                            >
                                Cancel
                            </button>
                        ) : (
                            <Link
                                to="/loans"
                                className="btn btn-secondary w-auto px-6"
                            >
                                Cancel
                            </Link>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-auto px-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {!loading && <Save size={18} />}
                            Save Loan
                        </button>
                    </div>
                </form>
            </div>

            <AmortizationModal
                isOpen={isAmortizationOpen}
                onClose={() => setIsAmortizationOpen(false)}
                amount={formData.amount}
                interestRate={formData.interest_rate}
                interestType={formData.interest_type}
                termMonths={formData.term_months}
                startDate={formData.date_borrowed}
            />
        </div>
    );
}
