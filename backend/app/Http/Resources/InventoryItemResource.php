<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $purchase = $this->purchase;

        return [
            'id' => $this->id,
            'productId' => $this->product_id,
            'productName' => $this->product?->name,
            'imageData' => (new PurchaseItemResource($this))->toArray($request)['imageData'],
            'batchNumber' => $this->batch_number,
            'supplierName' => $purchase?->supplier?->name,
            'reference' => $purchase?->reference,
            'expiryDate' => $this->expiry_date?->format('Y-m-d'),
            'quantity' => $this->quantity_remaining,
            'unit' => $this->unit,
            'purchasePrice' => (float) $this->purchase_price,
            'sellingPrice' => (float) $this->selling_price,
        ];
    }
}
