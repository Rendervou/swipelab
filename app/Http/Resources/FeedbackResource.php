<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'comment' => $this->comment,
            'rating' => $this->rating,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'design_id' => $this->design_id,
            'created_at' => $this->created_at,
        ];
    }
}
