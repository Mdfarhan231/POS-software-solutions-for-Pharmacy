<?php

namespace App\Http\Requests;

use App\Models\Supplier;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $routeSupplier = $this->route('supplier');
        $supplierId = $routeSupplier instanceof Supplier
            ? $routeSupplier->id
            : $routeSupplier;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'drug_license' => ['sometimes', 'nullable', 'string', 'max:100'],
            'contact_person' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'address' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'pay_term_value' => ['sometimes', 'integer', 'min:0', 'max:3650'],
            'pay_term_unit' => ['sometimes', Rule::in(['days', 'weeks', 'months'])],
            'status' => ['sometimes', Rule::in(['Active', 'On Hold'])],
            'code' => [
                'sometimes', 'string', 'max:32',
                Rule::unique('suppliers', 'code')->ignore($supplierId),
            ],
        ];
    }
}
