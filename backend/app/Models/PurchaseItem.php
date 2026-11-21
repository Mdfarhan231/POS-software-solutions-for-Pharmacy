<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'purchase_id', 'product_id', 'batch_number', 'expiry_date', 'quantity_received',
    'quantity_remaining', 'unit', 'purchase_price', 'selling_price',
])]
class PurchaseItem extends Model
{
    protected function casts(): array
    {
        return [
            'expiry_date' => 'date:Y-m-d',
            'quantity_received' => 'integer',
            'quantity_remaining' => 'integer',
            'purchase_price' => 'decimal:2',
            'selling_price' => 'decimal:2',
            'line_total' => 'decimal:2',
        ];
    }

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
