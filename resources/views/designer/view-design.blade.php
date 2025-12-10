@extends('layouts.app')

@section('content')
<style>
    .design-viewer-container {
        padding: 2rem;
        background: #1a202c;
        min-height: 100vh;
    }

    .design-viewer {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .design-main {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .design-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .design-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a202c;
    }

    .design-by {
        color: #718096;
        font-size: 0.9rem;
    }

    .design-canvas-container {
        position: relative;
        width: 100%;
        height: 600px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 3rem;
        font-weight: 700;
        overflow: auto;
    }

    .annotation-tool {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: crosshair;
    }

    .annotation-box {
        position: absolute;
        border: 2px solid #f093fb;
        background: rgba(240, 147, 251, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .annotation-box:hover {
        background: rgba(240, 147, 251, 0.2);
    }

    .annotation-box.active {
        border-color: #667eea;
        background: rgba(102, 126, 234, 0.2);
    }

    .annotation-pin {
        position: absolute;
        width: 20px;
        height: 20px;
        background: #f093fb;
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        color: white;
        font-weight: 700;
    }

    .annotation-pin.highlight {
        background: #ffd700;
    }

    .annotation-pin.question {
        background: #4facfe;
    }

    .design-sidebar {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
    }

    .sidebar-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
        font-weight: 700;
        color: #1a202c;
    }

    .sidebar-content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
    }

    .annotation-item {
        background: #f7fafc;
        border-left: 3px solid #667eea;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .annotation-item:hover {
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .annotation-user {
        font-weight: 600;
        color: #667eea;
        font-size: 0.9rem;
    }

    .annotation-text {
        color: #2d3748;
        margin-top: 0.5rem;
        font-size: 0.85rem;
        line-height: 1.4;
    }

    .annotation-time {
        color: #a0aec0;
        font-size: 0.75rem;
        margin-top: 0.5rem;
    }

    .add-annotation-form {
        padding: 1.5rem;
        border-top: 1px solid #e2e8f0;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-label {
        display: block;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }

    .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #cbd5e0;
        border-radius: 6px;
        font-size: 0.9rem;
        font-family: inherit;
    }

    .form-control:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #cbd5e0;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        font-family: inherit;
    }

    .btn {
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        width: 100%;
    }

    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-sm {
        padding: 0.5rem 0.75rem;
        font-size: 0.85rem;
        width: auto;
    }

    .btn-secondary {
        background: white;
        color: #667eea;
        border: 1px solid #667eea;
    }

    .btn-secondary:hover {
        background: #f7fafc;
    }

    .back-link {
        display: inline-block;
        margin-bottom: 1.5rem;
        color: white;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .back-link:hover {
        transform: translateX(-5px);
    }

    @media (max-width: 768px) {
        .design-viewer-container {
            padding: 1rem;
        }

        .design-viewer {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .design-canvas-container {
            height: 400px;
        }

        .design-sidebar {
            max-height: 400px;
        }
    }
</style>

<div class="design-viewer-container">
    <a href="{{ route('designer.profile', $design->user) }}" class="back-link">← Back to Designer</a>

    <div class="design-viewer">
        <!-- Main Design View -->
        <div class="design-main">
            <div class="design-header">
                <div>
                    <div class="design-title">{{ $design->title }}</div>
                    <div class="design-by">by <strong>{{ $design->user->name }}</strong></div>
                </div>
            </div>

            <div class="design-canvas-container" id="designCanvas">
                {{ substr($design->title, 0, 3) }}

                <!-- Annotation tool overlay -->
                @auth
                <div class="annotation-tool" id="annotationTool"></div>
                @endauth

                <!-- Display existing annotations -->
                @foreach($annotations as $annotation)
                    @php
                        $coords = json_decode($annotation->coordinates, true);
                    @endphp
                    <div class="annotation-box"
                        style="left: {{ $coords['x'] }}%; top: {{ $coords['y'] }}%; width: {{ $coords['width'] }}%; height: {{ $coords['height'] }}%;"
                        data-annotation-id="{{ $annotation->id }}">
                    </div>
                @endforeach
            </div>
        </div>

        <!-- Annotations Sidebar -->
        <div class="design-sidebar">
            <div class="sidebar-header">
                💬 Feedback ({{ $annotations->count() }})
            </div>

            <div class="sidebar-content" id="annotationsList">
                @forelse($annotations as $annotation)
                    <div class="annotation-item" data-annotation-id="{{ $annotation->id }}">
                        <div class="annotation-user">{{ $annotation->user->name }}</div>
                        <div class="annotation-text">{{ $annotation->comment }}</div>
                        <div class="annotation-time">{{ $annotation->created_at->diffForHumans() }}</div>

                        @if($annotation->comments->count() > 0)
                            <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e2e8f0;">
                                @foreach($annotation->comments as $comment)
                                    <div style="font-size: 0.8rem; color: #718096; margin-bottom: 0.5rem;">
                                        <strong style="color: #667eea;">{{ $comment->user->name }}:</strong> {{ $comment->content }}
                                    </div>
                                @endforeach
                            </div>
                        @endif
                    </div>
                @empty
                    <div style="text-align: center; padding: 2rem 0; color: #a0aec0;">
                        <p>No feedback yet</p>
                        <p style="font-size: 0.8rem; margin-top: 0.5rem;">@auth Click on the design to add feedback @else Login to add feedback @endauth</p>
                    </div>
                @endforelse
            </div>

            @auth
            <div class="add-annotation-form">
                <form id="annotationForm">
                    @csrf
                    <div class="form-group">
                        <label class="form-label">Feedback Type</label>
                        <select name="annotation_type" class="form-select" required>
                            <option value="comment">💬 Comment</option>
                            <option value="highlight">⭐ Highlight</option>
                            <option value="question">❓ Question</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Your Feedback</label>
                        <textarea name="comment" class="form-control" rows="3" placeholder="Share your thoughts..." required></textarea>
                    </div>

                    <input type="hidden" name="coordinates" id="coordinatesInput">

                    <button type="submit" class="btn btn-primary">
                        Post Feedback
                    </button>
                </form>
            </div>
            @endauth
        </div>
    </div>
</div>

<script>
    @auth
    const canvas = document.getElementById('designCanvas');
    const annotationTool = document.getElementById('annotationTool');
    const annotationForm = document.getElementById('annotationForm');
    const coordinatesInput = document.getElementById('coordinatesInput');

    let isDrawing = false;
    let startX, startY;
    let drawingBox = null;

    annotationTool.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        startX = ((e.clientX - rect.left) / rect.width) * 100;
        startY = ((e.clientY - rect.top) / rect.height) * 100;

        // Create preview box
        drawingBox = document.createElement('div');
        drawingBox.className = 'annotation-box';
        drawingBox.style.left = startX + '%';
        drawingBox.style.top = startY + '%';
        canvas.appendChild(drawingBox);
    });

    annotationTool.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const currentX = ((e.clientX - rect.left) / rect.width) * 100;
        const currentY = ((e.clientY - rect.top) / rect.height) * 100;

        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        drawingBox.style.left = Math.min(startX, currentX) + '%';
        drawingBox.style.top = Math.min(startY, currentY) + '%';
        drawingBox.style.width = width + '%';
        drawingBox.style.height = height + '%';
    });

    annotationTool.addEventListener('mouseup', (e) => {
        if (!isDrawing) return;
        isDrawing = false;

        const rect = canvas.getBoundingClientRect();
        const endX = ((e.clientX - rect.left) / rect.width) * 100;
        const endY = ((e.clientY - rect.top) / rect.height) * 100;

        const coordinates = {
            x: Math.min(startX, endX),
            y: Math.min(startY, endY),
            width: Math.abs(endX - startX),
            height: Math.abs(endY - startY)
        };

        coordinatesInput.value = JSON.stringify(coordinates);

        // Highlight the form
        document.querySelector('.add-annotation-form').scrollIntoView({ behavior: 'smooth' });
    });

    annotationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!coordinatesInput.value) {
            alert('Please click and drag on the design to select an area');
            return;
        }

        const formData = new FormData(annotationForm);

        try {
            const response = await fetch('{{ route("design.annotate", $design) }}', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                }
            });

            const data = await response.json();

            if (data.success) {
                // Add new annotation to list
                const annotationsList = document.getElementById('annotationsList');
                const newAnnotation = document.createElement('div');
                newAnnotation.className = 'annotation-item';
                newAnnotation.innerHTML = `
                    <div class="annotation-user">${data.user.name}</div>
                    <div class="annotation-text">${formData.get('comment')}</div>
                    <div class="annotation-time">just now</div>
                `;
                annotationsList.insertBefore(newAnnotation, annotationsList.firstChild);

                // Reset form
                annotationForm.reset();
                coordinatesInput.value = '';

                // Remove drawing box
                if (drawingBox) {
                    drawingBox.remove();
                    drawingBox = null;
                }

                // Reload page to show new annotation
                setTimeout(() => location.reload(), 500);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add feedback');
        }
    });
    @endauth
</script>
@endsection
