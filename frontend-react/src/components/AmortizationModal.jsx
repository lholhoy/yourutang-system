import { X, Calendar, Calculator } from "lucide-react";

export default function AmortizationModal({ isOpen, onClose, amount, interestRate, termMonths, startDate }) {
    if (!isOpen) return null;

    const calculateSchedule = () => {
        const schedule = [];
        let balance = parseFloat(amount) || 0;
        const rate = (parseFloat(interestRate) || 0) / 100;
        const term = parseInt(termMonths) || 1;
        const start = new Date(startDate);

        if (term <= 0 || balance <= 0) return [];

        // Flat Rate Calculation
        const monthlyPrincipal = balance / term;
        const monthlyInterest = balance * rate;
        const monthlyPayment = monthlyPrincipal + monthlyInterest;

        for (let i = 1; i <= term; i++) {
            balance -= monthlyPrincipal;
            const date = new Date(start);
            date.setMonth(start.getMonth() + i);

            schedule.push({
                payment_no: i,
                date: date.toLocaleDateString(),
                amount: monthlyPayment,
                principal: monthlyPrincipal,
                interest: monthlyInterest,
                balance: Math.max(0, balance),
            });
        }
        return schedule;
    };

    const schedule = calculateSchedule();
    const totalPayment = schedule.reduce((sum, item) => sum + item.amount, 0);
    const totalInterest = schedule.reduce((sum, item) => sum + item.interest, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <Calculator size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Amortization Schedule</h2>
                            <p className="text-sm text-gray-500">Estimated repayment plan</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs font-medium text-gray-500 uppercase">Total Payment</p>
                            <p className="text-lg font-bold text-gray-900">₱{totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs font-medium text-gray-500 uppercase">Total Interest</p>
                            <p className="text-lg font-bold text-primary">₱{totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs font-medium text-gray-500 uppercase">Monthly Payment</p>
                            <p className="text-lg font-bold text-gray-900">₱{(schedule[0]?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                            <tr>
                                <th className="px-4 py-3 font-medium text-gray-500">#</th>
                                <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                                <th className="px-4 py-3 font-medium text-gray-500 text-right">Amount</th>
                                <th className="px-4 py-3 font-medium text-gray-500 text-right">Interest</th>
                                <th className="px-4 py-3 font-medium text-gray-500 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {schedule.map((row) => (
                                <tr key={row.payment_no} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-900">{row.payment_no}</td>
                                    <td className="px-4 py-3 text-gray-600">{row.date}</td>
                                    <td className="px-4 py-3 text-right font-medium text-gray-900">₱{row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-3 text-right text-red-500">₱{row.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-3 text-right text-gray-600">₱{row.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-border bg-gray-50 rounded-b-2xl flex justify-end">
                    <button onClick={onClose} className="btn btn-primary">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
