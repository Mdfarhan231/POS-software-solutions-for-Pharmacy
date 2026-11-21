<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchaseRequest;
use App\Http\Resources\PurchaseResource;
use App\Models\Purchase;
use App\Services\PurchaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PurchaseController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $purchases = Purchase::query()
            ->with(['supplier', 'items.product'])
            ->orderByDesc('purchase_date')
            ->orderByDesc('id')
            ->limit(500)
            ->get();

        return PurchaseResource::collection($purchases);
    }

    public function store(
        StorePurchaseRequest $request,
        PurchaseService $purchaseService
    ): JsonResponse {
        $purchase = $purchaseService->create(
            $request->validated(),
            (int) $request->user()->id
        );

        return (new PurchaseResource($purchase))->response()->setStatusCode(201);
    }

    public function show(Purchase $purchase): PurchaseResource
    {
        return new PurchaseResource($purchase->load(['supplier', 'items.product']));
    }
}
