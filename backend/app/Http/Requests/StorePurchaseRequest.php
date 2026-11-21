<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $supplierId = $this->input('supplier_id');

        return [
            'supplier_id' => ['required', 'integer', 'exists:suppliers,id'],
            'reference' => ['nullable', 'string', 'max:64', Rule::unique('purchases', 'reference')],
            'invoice_number' => [
                'nullable', 'string', 'max:100',
                Rule::unique('purchases', 'invoice_number')->where('supplier_id', $supplierId),
            ],
            'purchase_date' => ['required', 'date'],
            'amount_paid' => ['nullable', 'numeric', 'min:0', 'decimal:0,2'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'items' => ['required', 'array', 'min:1', 'max:100'],
            'items.*.product_name' => ['required', 'string', 'max:255'],
            'items.*.batch_number' => ['required', 'string', 'max:100'],
            'items.*.expiry_date' => ['required', 'date', 'after:purchase_date'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:1000000'],
            'items.*.unit' => ['nullable', 'string', 'max:24'],
            'items.*.purchase_price' => ['required', 'numeric', 'min:0', 'decimal:0,2'],
            'items.*.selling_price' => ['nullable', 'numeric', 'min:0', 'decimal:0,2'],
            'items.*.image_data' => [
                'nullable', 'string', 'max:2000000',
                'regex:/^data:image\/(?:jpeg|png|webp);base64,/',
            ],
        ];
    }
}
