<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'supplierId' => $this->supplier_id,
            'supplierName' => $this->supplier?->name,
            'reference' => $this->reference,
            'invoiceNumber' => $this->invoice_number,
            'purchaseDate' => $this->purchase_date?->format('Y-m-d'),
            'items' => PurchaseItemResource::collection($this->whenLoaded('items')),
            'totalAmount' => (float) $this->total_amount,
            'amountPaid' => (float) $this->amount_paid,
            'dueAmount' => (float) $this->due_amount,
            'status' => $this->payment_status,
            'notes' => $this->notes,
            'createdAt' => $this->created_at?->toISOString(),
        ];
    }
}
