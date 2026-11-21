<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('suppliers')) {
            Schema::create('suppliers', function (Blueprint $table): void {
                $table->id();
                $table->string('code', 32)->unique();
                $table->string('name');
                $table->string('drug_license', 100)->nullable();
                $table->string('contact_person')->nullable();
                $table->string('phone', 50)->nullable();
                $table->text('address')->nullable();
                $table->unsignedInteger('pay_term_value')->default(0);
                $table->string('pay_term_unit', 16)->default('days');
                $table->string('status', 20)->default('Active');
                $table->timestampsTz();
            });
        }

        if (! Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table): void {
                $table->id();
                $table->string('name');
                $table->string('barcode', 100)->nullable()->unique();
                $table->text('image_path')->nullable();
                $table->timestampsTz();
                $table->index('name');
            });
        }

        if (! Schema::hasTable('purchases')) {
            Schema::create('purchases', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('supplier_id')->constrained()->restrictOnDelete();
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                $table->string('reference', 64)->unique();
                $table->string('invoice_number', 100)->nullable();
                $table->date('purchase_date');
                $table->decimal('total_amount', 12, 2);
                $table->decimal('amount_paid', 12, 2)->default(0);
                $table->text('notes')->nullable();
                $table->timestampsTz();
                $table->unique(['supplier_id', 'invoice_number']);
                $table->index(['supplier_id', 'purchase_date']);
            });
        }

        if (! Schema::hasTable('purchase_items')) {
            Schema::create('purchase_items', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('purchase_id')->constrained()->cascadeOnDelete();
                $table->foreignId('product_id')->constrained()->restrictOnDelete();
                $table->string('batch_number', 100);
                $table->date('expiry_date');
                $table->unsignedInteger('quantity_received');
                $table->unsignedInteger('quantity_remaining');
                $table->string('unit', 24)->default('unit');
                $table->decimal('purchase_price', 12, 2);
                $table->decimal('selling_price', 12, 2)->default(0);
                $table->decimal('line_total', 14, 2)
                    ->storedAs('quantity_received * purchase_price');
                $table->timestampsTz();
                $table->index(['product_id', 'batch_number']);
                $table->index('expiry_date');
            });
        }
    }

    public function down(): void
    {
        // These tables may have been created from the supplied PostgreSQL SQL
        // before this migration was added. Preserve purchase data on rollback.
    }
};
