import { useState } from "react";
import axiosClient from "../../api/axios";
import { Loader2, Save, PhilippinePeso, Calendar, FileText, Banknote, CreditCard } from "lucide-react";

export default function PaymentForm({ loan, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        loan_id: loan.id,
        amount: "",
        payment_date: new Date().toISOString().split('T')[0],
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        try {
            await axiosClient.post("/payments", formData);
            if (onSuccess) onSuccess();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error saving payment:", error);
                alert("Failed to save payment");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden">
            {/* Header Gradient Line (Optional if inside another card, but good for standalone) */}
            <div className="h-1.5 bg-gradient-to-r from-primary to-primary-600 w-full"></div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">

                {/* Loan Summary Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-border/60 shadow-inner">
                    <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold border-b border-gray-200 pb-2">
                        <Banknote size={18} className="text-primary" />
                        <h3>Loan Summary</h3>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-500">Total Loan Amount</span>
                        <span className="font-semibold text-gray-900">₱{Number(loan.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Remaining Balance</span>
                        <span className="font-bold text-primary text-xl">₱{Number(loan.balance).toLocaleString()}</span>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Payment Amount (₱) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <PhilippinePeso className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="input-field pl-10 transition-shadow focus:shadow-md"
                                placeholder="0.00"
                                required
                                autoFocus
                                max={loan.balance} // Optional: prevent overpayment
                            />
                        </div>
                        {errors?.amount && <p className="text-red-500 text-xs mt-1">{errors.amount[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Payment Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="date"
                                value={formData.payment_date}
                                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                                className="input-field pl-10 transition-shadow focus:shadow-md"
                                required
                            />
                        </div>
                        {errors?.payment_date && <p className="text-red-500 text-xs mt-1">{errors.payment_date[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Notes
                        </label>
                        <div className="relative group">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                                className="input-field pl-10 resize-none transition-shadow focus:shadow-md"
                                placeholder="Optional notes..."
                            />
                        </div>
                        {errors?.notes && <p className="text-red-500 text-xs mt-1">{errors.notes[0]}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary px-5"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary px-5 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
                    >
                        {loading && <Loader2 className="animate-spin" size={18} />}
                        {!loading && <Save size={18} />}
                        Record Payment
                    </button>
                </div>
            </form>
        </div>
    );
}
