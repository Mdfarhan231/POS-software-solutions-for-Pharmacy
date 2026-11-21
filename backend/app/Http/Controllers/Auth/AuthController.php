<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\ApiToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->username)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Invalid email or password.'
            ], 401);
        }

        $storedPassword = $user->getAuthPassword();
        $passwordInfo = password_get_info($storedPassword);
        $storedAlgorithm = $passwordInfo['algoName'] ?? 'unknown';

        if ($storedAlgorithm === 'bcrypt') {
            $passwordMatches = Hash::check($request->password, $storedPassword);
        } elseif ($storedAlgorithm !== 'unknown') {
            // Accept older supported PHP hashes and migrate them after login.
            $passwordMatches = password_verify($request->password, $storedPassword);
        } else {
            // Some existing installations stored passwords before hashing was
            // configured. Verify once, then replace the plaintext value below.
            $passwordMatches = hash_equals($storedPassword, $request->password);
        }

        if (!$passwordMatches) {
            return response()->json([
                'message' => 'Invalid email or password.'
            ], 401);
        }

        if ($storedAlgorithm !== 'bcrypt') {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        $plainTextToken = Str::random(64);
        ApiToken::create([
            'user_id' => $user->id,
            'name' => 'PharmaDesk frontend',
            'token_hash' => hash('sha256', $plainTextToken),
            'expires_at' => $request->boolean('remember_me')
                ? now()->addDays(30)
                : now()->addHours(12),
        ]);

        return response()->json([
            'token' => $plainTextToken,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'Pharmacist',
                'counter' => $request->counter,
            ]
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'Pharmacist',
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->attributes->get('api_token')?->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }
}
