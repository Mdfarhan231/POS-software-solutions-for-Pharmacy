<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PurchaseService
{
    public function create(array $data, int $userId): Purchase
    {
        $supplier = Supplier::query()->findOrFail($data['supplier_id']);
        if ($supplier->status !== 'Active') {
            throw ValidationException::withMessages([
                'supplier_id' => 'Purchases cannot be recorded for a supplier on hold.',
            ]);
        }

        $totalAmount = collect($data['items'])->sum(
            fn (array $item): float => (int) $item['quantity'] * (float) $item['purchase_price']
        );
        $totalAmount = round($totalAmount, 2);
        $amountPaid = round((float) ($data['amount_paid'] ?? 0), 2);

        if ($amountPaid > $totalAmount) {
            throw ValidationException::withMessages([
                'amount_paid' => 'Amount paid cannot exceed the purchase total.',
            ]);
        }

        return DB::transaction(function () use ($data, $supplier, $userId, $totalAmount, $amountPaid): Purchase {
            $purchase = Purchase::create([
                'supplier_id' => $supplier->id,
                'created_by' => $userId,
                'reference' => $data['reference'] ?? 'PUR-'.Str::upper(Str::random(10)),
                'invoice_number' => filled($data['invoice_number'] ?? null)
                    ? trim($data['invoice_number'])
                    : null,
                'purchase_date' => $data['purchase_date'],
                'total_amount' => $totalAmount,
                'amount_paid' => $amountPaid,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                $product = Product::query()
                    ->whereRaw('LOWER(name) = ?', [Str::lower(trim($item['product_name']))])
                    ->first();

                if (! $product) {
                    $product = Product::create(['name' => trim($item['product_name'])]);
                }

                if (filled($item['image_data'] ?? null)) {
                    $product->image_path = $this->storeProductImage($item['image_data']);
                    $product->save();
                }

                $quantity = (int) $item['quantity'];
                $product->purchaseItems()->create([
                    'purchase_id' => $purchase->id,
                    'batch_number' => trim($item['batch_number']),
                    'expiry_date' => $item['expiry_date'],
                    'quantity_received' => $quantity,
                    'quantity_remaining' => $quantity,
                    'unit' => $item['unit'] ?? 'unit',
                    'purchase_price' => $item['purchase_price'],
                    'selling_price' => $item['selling_price'] ?? 0,
                ]);
            }

            return $purchase->load(['supplier', 'items.product']);
        });
    }

    private function storeProductImage(string $dataUrl): string
    {
        if (! preg_match('/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+\/=]+)$/', $dataUrl, $matches)) {
            throw ValidationException::withMessages([
                'items' => 'A product image has an unsupported or invalid format.',
            ]);
        }

        $contents = base64_decode($matches[2], true);
        if ($contents === false || strlen($contents) > 1_500_000) {
            throw ValidationException::withMessages([
                'items' => 'A product image is invalid or too large.',
            ]);
        }

        $extension = match ($matches[1]) {
            'jpeg' => 'jpg',
            default => $matches[1],
        };
        $path = 'products/'.Str::uuid().'.'.$extension;
        Storage::disk('public')->put($path, $contents);

        return $path;
    }
}
