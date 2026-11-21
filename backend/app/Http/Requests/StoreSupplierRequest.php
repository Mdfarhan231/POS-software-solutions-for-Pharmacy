<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['sometimes', 'string', 'max:32', Rule::unique('suppliers', 'code')],
            'name' => ['required', 'string', 'max:255'],
            'drug_license' => ['nullable', 'string', 'max:100'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:2000'],
            'pay_term_value' => ['nullable', 'integer', 'min:0', 'max:3650'],
            'pay_term_unit' => ['nullable', Rule::in(['days', 'weeks', 'months'])],
            'status' => ['nullable', Rule::in(['Active', 'On Hold'])],
        ];
    }
}
