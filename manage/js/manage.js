document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("albumForm");
  const baseUrl = "https://hassanitani6.github.io/ITAAudio/";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const artist = document.getElementById("artist").value.trim();
    const album = document.getElementById("album").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const spotify = document.getElementById("spotify").value.trim();
    const apple = document.getElementById("apple").value.trim();
    const youtube = document.getElementById("youtube").value.trim();
    let shortcode = document.getElementById("shortcode").value.trim();

    if (!artist || !album || !spotify) {
      alert("Please fill all required fields.");
      return;
    }

    if (!shortcode)
      shortcode = "a" + Math.floor(Math.random() * 1000).toString().padStart(2, "0");

    const slug = (artist + "-" + album)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const albumHtml = `<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width,initial-scale=1.0'>
  <title>${artist} - ${album}</title>
  <meta http-equiv='refresh' content='0;url=${spotify}'>
  <style>
    body { font-family: Arial, sans-serif; background:#f8f8f8; text-align:center; padding:40px 20px; }
    .logo { max-width:130px; margin-bottom:25px; }
    h1 { margin-bottom:10px; font-size:1.4em; font-weight:600; }
    .btn { display:inline-block; background:#000; color:#fff; text-decoration:none;
      padding:10px 22px; border-radius:8px; margin:8px; font-weight:bold;
      transition:background .3s, transform .2s; }
    .btn:hover { background:#333; transform:scale(1.05); }
    p.note { margin-top:25px; font-size:.9em; color:#555; }
  </style>
</head>
<body>
  <img src='https://hassanitani6.github.io/ITAAudio/assets/logo.png' class='logo' alt='ITA Prints Logo'>
  <h1>${artist} – ${album}</h1>
  ${genre ? `<p><em>${genre}</em></p>` : ""}
  <div>
    <a href='${spotify}' target='_blank' class='btn'>🎵 Spotify</a>
    ${apple ? `<a href='${apple}' target='_blank' class='btn'>🍎 Apple Music</a>` : ""}
    ${youtube ? `<a href='${youtube}' target='_blank' class='btn'>▶️ YouTube Music</a>` : ""}
  </div>
  <p class='note'>If it didn’t open automatically, tap a button above.</p>
</body></html>`;

    const redirectHtml = `<meta http-equiv='refresh' content='0;url=${baseUrl}albums/${slug}.html'>`;

    const albumEntry = { title: `${artist} – ${album}`, file: `${slug}.html` };

    // Create ZIP with HTML files + updated albums.json
    const zip = new JSZip();

    // Add album HTML
    zip.file(`albums/${slug}.html`, albumHtml);

    // Add redirect page
    zip.file(`${shortcode}/index.html`, redirectHtml);

    // Try to load current albums.json if available (for convenience)
    try {
      const res = await fetch(baseUrl + "albums/albums.json");
      const existing = await res.json();
      existing.push(albumEntry);
      zip.file("albums/albums.json", JSON.stringify(existing, null, 2));
    } catch {
      zip.file("albums/albums.json", JSON.stringify([albumEntry], null, 2));
    }

    // Download
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${artist}-${album}.zip`;
    link.click();

    alert("✅ Files created! ZIP downloading...");
  });

  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  });
});
