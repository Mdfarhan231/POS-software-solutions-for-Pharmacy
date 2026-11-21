<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SupplierController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $suppliers = $this->withLedgerTotals()
            ->orderBy('name')
            ->get();

        return SupplierResource::collection($suppliers);
    }

    public function store(StoreSupplierRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['code'] ??= sprintf('SUP-%06d', (Supplier::max('id') ?? 0) + 1);
        $data['status'] ??= 'Active';
        $supplier = Supplier::create($data);

        return (new SupplierResource($this->withLedgerTotals()->findOrFail($supplier->id)))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Supplier $supplier): SupplierResource
    {
        return new SupplierResource(
            $this->withLedgerTotals()->findOrFail($supplier->id)
        );
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier): SupplierResource
    {
        $supplier->update($request->validated());

        return new SupplierResource(
            $this->withLedgerTotals()->findOrFail($supplier->id)
        );
    }

    private function withLedgerTotals()
    {
        return Supplier::query()
            ->withSum('purchases as total_purchases', 'total_amount')
            ->withSum('purchases as total_paid', 'amount_paid')
            ->withMax('purchases as last_supply_date', 'purchase_date');
    }
}
