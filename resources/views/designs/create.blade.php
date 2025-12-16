<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Upload Design - SwipeLab</title>
</head>
<body>

<h1>Upload Design</h1>

<form action="/upload" method="POST" enctype="multipart/form-data">
    @csrf

    <div>
        <label>Judul</label><br>
        <input type="text" name="title" required>
    </div>

    <br>

    <div>
        <label>Kategori</label><br>
        <select name="category" required>
            <option value="">-- Pilih Kategori --</option>
            <option value="uiux">UI / UX</option>
            <option value="poster">Poster</option>
            <option value="illustration">Ilustrasi</option>
        </select>
    </div>

    <br>

    <div>
        <label>Gambar</label><br>
        <input type="file" name="image" accept="image/*" required>
    </div>

    <br>

    <div>
        <label>Deskripsi (opsional)</label><br>
        <textarea name="description"></textarea>
    </div>

    <br>

    <button type="submit">Upload</button>

</form>

</body>
</html>
