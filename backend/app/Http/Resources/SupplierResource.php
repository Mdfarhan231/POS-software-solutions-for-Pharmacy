<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $totalPurchases = (float) ($this->total_purchases ?? 0);
        $totalPaid = (float) ($this->total_paid ?? 0);

        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'drugLicense' => $this->drug_license,
            'contactPerson' => $this->contact_person,
            'phone' => $this->phone,
            'address' => $this->address,
            'payTermValue' => $this->pay_term_value,
            'payTermUnit' => $this->pay_term_unit,
            'totalPurchases' => round($totalPurchases, 2),
            'balanceDue' => round(max(0, $totalPurchases - $totalPaid), 2),
            'status' => $this->status,
            'lastSupplyDate' => $this->last_supply_date,
        ];
    }
}
