<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HistoryLogController extends Controller
{
    public function index()
    {
        $logs = ActivityLog::where('user_id', Auth::id())
            ->latest()
            ->paginate(20);

        return response()->json($logs);
    }
}
