<!DOCTYPE html>
<html>
<head>
    <title>SwipeLab - Dashboard</title>
</head>
<body>
    <h1>SwipeLab Dashboard</h1>

    @foreach ($designs as $design)
    <div style="border:1px solid #ccc; padding:20px; margin-bottom:20px;">
        <img src="{{ asset('storage/' . $design->image) }}" width="300">
        <h3>{{ $design->title }}</h3>
        <p>{{ $design->category }}</p>

        <form action="/swipe" method="POST" style="display:inline;">
            @csrf
            <input type="hidden" name="design_id" value="{{ $design->id }}">
            <input type="hidden" name="type" value="like">
            <button>👍 Like</button>
        </form>

        <form action="/swipe" method="POST" style="display:inline;">
            @csrf
            <input type="hidden" name="design_id" value="{{ $design->id }}">
            <input type="hidden" name="type" value="skip">
            <button>👎 Skip</button>
        </form>
    </div>
@endforeach

</body>
</html>
