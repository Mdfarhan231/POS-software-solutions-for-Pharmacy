<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'code', 'name', 'drug_license', 'contact_person', 'phone', 'address',
    'pay_term_value', 'pay_term_unit', 'status',
])]
class Supplier extends Model
{
    protected function casts(): array
    {
        return [
            'pay_term_value' => 'integer',
        ];
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }
}
