<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\FormTaskRequest;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $userId = Auth::user()->id;
        return Task::where('user_id', $userId)->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Requests\FormTaskRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(FormTaskRequest $request)
    {
        $task = $request->validated();
         Task::create(
            [
                'title' => $task['title'],
                'user_id' => Auth::user()->id,
            ]
        );
        $response = [
            'title' => $task['title'],
            'user_id' => Auth::user()->id,
        ];
        return response($response, 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy( Task $task)
    {
        $userId = Auth::user()->id;
        if ($userId === $task->user_id) {
           Task::destroy($task->id);
           return response()->json(['Message'=>'Task deleted successfully'],201);
        } else {
            return "you can't delete this task";
        }
    }
}