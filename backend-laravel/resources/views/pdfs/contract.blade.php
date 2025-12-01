<!DOCTYPE html>
<html>
<head>
    <title>Loan Agreement</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; line-height: 1.4; color: #000; font-size: 12px; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
        .subtitle { font-size: 14px; font-style: italic; }
        .section { margin-bottom: 15px; }
        .section-title { font-weight: bold; margin-bottom: 5px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .label { font-weight: bold; }
        .signature-section { margin-top: 30px; display: flex; justify-content: space-between; }
        .signature-block { width: 45%; text-align: center; }
        .line { border-bottom: 1px solid #000; margin-bottom: 10px; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">Loan Agreement</div>
            <div class="subtitle">This Loan Agreement is made on {{ \Carbon\Carbon::parse($loan->date_borrowed)->format('F j, Y') }}</div>
        </div>

        <div class="section">
            <div class="section-title">1. THE PARTIES</div>
            <p>This Agreement is made between:</p>
            <p><strong>Lender:</strong> {{ $loan->borrower->user->name }}</p>
            <p><strong>Borrower:</strong> {{ $loan->borrower->name }}</p>
            @if($loan->borrower->address)
            <p><strong>Address:</strong> {{ $loan->borrower->address }}</p>
            @endif
            @if($loan->borrower->id_type && $loan->borrower->id_number)
            <p><strong>ID:</strong> {{ $loan->borrower->id_type }} - {{ $loan->borrower->id_number }}</p>
            @endif
        </div>

        <div class="section">
            <div class="section-title">2. LOAN DETAILS</div>
            <p>The Lender agrees to loan the Borrower the following amount under these terms:</p>
            <ul>
                <li><strong>Principal Amount:</strong> &#8369;{{ number_format($loan->amount, 2) }}</li>
                @if($loan->interest_rate)
                <li><strong>Interest Rate:</strong> {{ $loan->interest_rate }}% per month</li>
                @endif
                @if($loan->term_months)
                <li><strong>Term:</strong> {{ $loan->term_months }} months</li>
                @endif
                @if($loan->due_date)
                <li><strong>Due Date:</strong> {{ \Carbon\Carbon::parse($loan->due_date)->format('F j, Y') }}</li>
                @endif
            </ul>
        </div>

        <div class="section">
            <div class="section-title">3. REPAYMENT</div>
            <p>The Borrower agrees to repay the Principal Amount along with any accrued interest by the Due Date. Payments may be made in installments or in full.</p>
        </div>

        <div class="section">
            <div class="section-title">4. AGREEMENT</div>
            <p>By signing below, both parties acknowledge and agree to the terms of this Loan Agreement.</p>
        </div>

        <table style="width: 100%; margin-top: 50px; border: none;">
            <tr>
                <td style="width: 45%; border: none; text-align: center;">
                    <div style="height: 40px;"></div>
                    <strong>{{ strtoupper($loan->borrower->user->name) }}</strong><br>
                    <div style="border-bottom: 1px solid black; margin-bottom: 5px;"></div>
                    Signature over Printed Name<br>
                    (Lender)
                </td>
                <td style="width: 10%; border: none;"></td>
                <td style="width: 45%; border: none; text-align: center;">
                    <div style="height: 40px;"></div>
                    <strong>{{ strtoupper($loan->borrower->name) }}</strong><br>
                    <div style="border-bottom: 1px solid black; margin-bottom: 5px;"></div>
                    Signature over Printed Name<br>
                    (Borrower)
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
