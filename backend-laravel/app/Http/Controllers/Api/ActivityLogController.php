<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = ActivityLog::where('user_id', auth()->id())
            ->latest()
            ->take(5)
            ->get();

        return response()->json($logs);
    }
}
