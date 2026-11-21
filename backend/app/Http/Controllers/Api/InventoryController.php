<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InventoryItemResource;
use App\Models\PurchaseItem;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class InventoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $batches = PurchaseItem::query()
            ->with(['product', 'purchase.supplier'])
            ->where('quantity_remaining', '>', 0)
            ->orderBy('expiry_date')
            ->orderByDesc('id')
            ->get();

        return InventoryItemResource::collection($batches);
    }
}
