import { useState } from "react";
import axiosClient from "../../api/axios";
import { Loader2, Save, DollarSign, Calendar } from "lucide-react";

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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-border/50 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Total Loan Amount</span>
                    <span className="font-semibold text-gray-900">₱{Number(loan.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Remaining Balance</span>
                    <span className="font-bold text-primary text-lg">₱{Number(loan.balance).toLocaleString()}</span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Payment Amount (₱) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="input-field pl-10"
                        placeholder="0.00"
                        required
                        autoFocus
                        max={loan.balance} // Optional: prevent overpayment
                    />
                </div>
                {errors?.amount && <p className="text-red-500 text-xs mt-1">{errors.amount[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Payment Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="date"
                        value={formData.payment_date}
                        onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                        className="input-field pl-10"
                        required
                    />
                </div>
                {errors?.payment_date && <p className="text-red-500 text-xs mt-1">{errors.payment_date[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Notes
                </label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Optional notes..."
                />
                {errors?.notes && <p className="text-red-500 text-xs mt-1">{errors.notes[0]}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading && <Loader2 className="animate-spin" size={18} />}
                    <Save size={18} />
                    Record Payment
                </button>
            </div>
        </form>
    );
}
