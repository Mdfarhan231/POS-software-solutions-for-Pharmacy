<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'supplier_id', 'created_by', 'reference', 'invoice_number', 'purchase_date',
    'total_amount', 'amount_paid', 'notes',
])]
class Purchase extends Model
{
    protected function casts(): array
    {
        return [
            'purchase_date' => 'date:Y-m-d',
            'total_amount' => 'decimal:2',
            'amount_paid' => 'decimal:2',
        ];
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function getDueAmountAttribute(): string
    {
        return number_format(max(0, (float) $this->total_amount - (float) $this->amount_paid), 2, '.', '');
    }

    public function getPaymentStatusAttribute(): string
    {
        if ((float) $this->amount_paid <= 0) {
            return 'Due';
        }

        return (float) $this->amount_paid >= (float) $this->total_amount ? 'Paid' : 'Partial';
    }
}
