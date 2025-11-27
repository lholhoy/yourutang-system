<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Statement of Account</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { margin: 0; color: #0F9E99; }
        .header p { margin: 5px 0; color: #666; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { padding: 5px; vertical-align: top; }
        .section-title { font-size: 14px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #eee; padding-bottom: 5px; color: #0F9E99; }
        table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.data-table th, table.data-table td { border: 1px solid #eee; padding: 8px; text-align: left; }
        table.data-table th { background-color: #f9fafb; font-weight: bold; }
        .text-right { text-align: right; }
        .total-row { font-weight: bold; background-color: #f0fdfa; }
        .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>YourUtang System</h1>
        <p>Statement of Account</p>
        <p>Date: {{ date('F d, Y') }}</p>
    </div>

    <table class="info-table">
        <tr>
            <td width="50%">
                <strong>Borrower Details:</strong><br>
                {{ $borrower->name }}<br>
                {{ $borrower->email ?? 'No Email' }}<br>
                {{ $borrower->contact ?? 'No Contact' }}
            </td>
            <td width="50%" class="text-right">
                <strong>Summary:</strong><br>
                Total Borrowed: ₱{{ number_format($borrower->loans->sum('amount'), 2) }}<br>
                Total Paid: ₱{{ number_format($borrower->loans->sum(fn($l) => $l->payments->sum('amount')), 2) }}<br>
                <strong>Outstanding Balance: ₱{{ number_format($borrower->loans->sum('balance'), 2) }}</strong>
            </td>
        </tr>
    </table>

    <div class="section-title">Loan History</div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th class="text-right">Amount</th>
                <th class="text-right">Paid</th>
                <th class="text-right">Balance</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($borrower->loans as $loan)
            <tr>
                <td>{{ \Carbon\Carbon::parse($loan->date_borrowed)->format('M d, Y') }}</td>
                <td>
                    Loan #{{ $loan->id }}
                    @if($loan->description)<br><small>{{ $loan->description }}</small>@endif
                </td>
                <td class="text-right">₱{{ number_format($loan->amount, 2) }}</td>
                <td class="text-right">₱{{ number_format($loan->payments->sum('amount'), 2) }}</td>
                <td class="text-right">₱{{ number_format($loan->balance, 2) }}</td>
                <td>{{ ucfirst($loan->status) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="section-title">Recent Payments</div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Loan Reference</th>
                <th class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($borrower->loans->flatMap->payments->sortByDesc('created_at')->take(10) as $payment)
            <tr>
                <td>{{ $payment->created_at->format('M d, Y') }}</td>
                <td>Loan #{{ $payment->loan_id }}</td>
                <td class="text-right">₱{{ number_format($payment->amount, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>This is a system-generated statement. No signature required.</p>
    </div>
</body>
</html>
