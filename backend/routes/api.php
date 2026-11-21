<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\SupplierController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('api.token')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('suppliers', SupplierController::class)
        ->only(['index', 'store', 'show', 'update']);

    Route::apiResource('purchases', PurchaseController::class)
        ->only(['index', 'store', 'show']);

    Route::get('/inventory', [InventoryController::class, 'index']);
});
