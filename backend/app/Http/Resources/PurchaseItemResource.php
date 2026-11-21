<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PurchaseItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $imageData = null;
        if ($this->product?->image_path) {
            $disk = Storage::disk('public');
            $imagePath = $this->product->image_path;
            if ($disk->exists($imagePath)) {
                $mimeType = $disk->mimeType($imagePath);
                if (in_array($mimeType, ['image/jpeg', 'image/png', 'image/webp'], true)) {
                    $imageData = 'data:'.$mimeType.';base64,'.base64_encode($disk->get($imagePath));
                }
            }
        }

        return [
            'id' => $this->id,
            'productId' => $this->product_id,
            'productName' => $this->product?->name,
            'imageData' => $imageData,
            'batchNumber' => $this->batch_number,
            'expiryDate' => $this->expiry_date?->format('Y-m-d'),
            'quantity' => $this->quantity_received,
            'quantityRemaining' => $this->quantity_remaining,
            'unit' => $this->unit,
            'purchasePrice' => (float) $this->purchase_price,
            'sellingPrice' => (float) $this->selling_price,
            'lineTotal' => (float) $this->line_total,
        ];
    }
}
