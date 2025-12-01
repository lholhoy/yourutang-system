import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { ArrowLeft, Loader2, Save, Calculator } from "lucide-react";
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
        <div className={isModal ? "" : "max-w-2xl mx-auto"}>
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

            <div className={isModal ? "" : "card p-8"}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Borrower <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.borrower_id}
                            onChange={(e) => setFormData({ ...formData, borrower_id: e.target.value })}
                            className="input-field"
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
                        {errors?.borrower_id && <p className="text-red-500 text-xs mt-1">{errors.borrower_id[0]}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Amount (₱) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="input-field"
                                placeholder="0.00"
                                required
                                autoFocus={isModal && !!preselectedBorrowerId}
                            />
                            {errors?.amount && <p className="text-red-500 text-xs mt-1">{errors.amount[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Date Borrowed <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.date_borrowed}
                                onChange={(e) => setFormData({ ...formData, date_borrowed: e.target.value })}
                                className="input-field"
                                required
                            />
                            {errors?.date_borrowed && <p className="text-red-500 text-xs mt-1">{errors.date_borrowed[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Interest Rate
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.interest_rate}
                                    onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                                    className="input-field"
                                    placeholder="0"
                                />
                                <select
                                    value={formData.interest_type}
                                    onChange={(e) => setFormData({ ...formData, interest_type: e.target.value })}
                                    className="input-field w-32"
                                >
                                    <option value="monthly">% / Month</option>
                                    <option value="daily">% / Day</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Term
                            </label>
                            <div className="flex gap-2">
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
                                    className="input-field w-32"
                                >
                                    <option value="months">Months</option>
                                    <option value="weeks">Weeks</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsAmortizationOpen(true)}
                                    className="btn btn-secondary px-3"
                                    title="View Amortization Schedule"
                                >
                                    <Calculator size={18} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Description / Notes
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="input-field resize-none"
                            placeholder="Optional description..."
                        />
                        {errors?.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border">
                        {onCancel ? (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        ) : (
                            <Link
                                to="/loans"
                                className="btn btn-secondary"
                            >
                                Cancel
                            </Link>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            <Save size={18} />
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
