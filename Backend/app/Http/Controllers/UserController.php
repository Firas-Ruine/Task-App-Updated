<?php

namespace App\Http\Controllers;

use App\Http\Requests\FormLoginRequest;
use App\Http\Requests\FormRegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;;
class UserController extends Controller
{
    public function register(FormRegisterRequest $request)
    {
        $fields =  $request->validated();
        $user = User::create([
            'fullname' => $fields['fullname'],
            'email' => $fields['email'],
            'password' => bcrypt($fields['password']),
        ]);

        $token = $user->createToken('taskapptoken')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }

    public function login(FormLoginRequest $request) {
        $fields = $request->validated();
        // Check email
        $user = User::where('email', $fields['email'])->first();

        // Check password
        if(!$user || !Hash::check($fields['password'], $user->password)) {
            return response([
                'message' => 'Invalid Credentials'
            ], 401);
        }

        $token = $user->createToken('myapptoken')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }

    public function logout(Request $request)
    {
        Auth::user()->tokens()->delete();

        return [
            'message' => 'Logged out'
        ];
    }
}
