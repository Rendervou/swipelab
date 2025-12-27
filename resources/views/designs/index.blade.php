<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SwipeLab</title>
</head>
<body>

<h1>SwipeLab Feed</h1>

@foreach ($designs as $design)
<div class="card" data-id="{{ $design->id }}"
     style="border:1px solid #ccc;padding:16px;margin-bottom:16px;max-width:340px;">
    <img src="{{ asset('storage/' . $design->image) }}" width="320">
    <h3>{{ $design->title }}</h3>
    <p>{{ $design->category }}</p>

    <button onclick="swipe(this,'like')">👍 Like</button>
    <button onclick="swipe(this,'skip')">👎 Skip</button>
</div>
@endforeach

<script>
function swipe(btn, type) {
    const card = btn.closest('.card');
    const designId = card.dataset.id;

    fetch("{{ route('swipe') }}", {
        method: "POST",
        headers: {
            "X-CSRF-TOKEN": "{{ csrf_token() }}",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            design_id: designId,
            type: type
        })
    })
    .then(r => r.json())
    .then(res => {
        if (res.status === 'success') {
            card.remove();
        }
    });
}
</script>

</body>
</html>
