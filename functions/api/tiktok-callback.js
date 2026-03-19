// Cloudflare Pages Function — TikTok OAuth Callback
// Env vars: TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return new Response(renderHTML('Fehler', `<p>TikTok-Login fehlgeschlagen: ${error}</p><a href="/tiktok-demo">Zurück</a>`), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (!code) {
    return new Response(renderHTML('Fehler', '<p>Kein Authorization Code erhalten.</p><a href="/tiktok-demo">Zurück</a>'), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Exchange code for access token
  try {
    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: env.TIKTOK_CLIENT_KEY,
        client_secret: env.TIKTOK_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://stiefundgluecklich.de/api/tiktok-callback',
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      return new Response(renderHTML('Fehler', `<p>Token-Fehler: ${tokenData.error_description || tokenData.error || 'Unbekannt'}</p><a href="/tiktok-demo">Zurück</a>`), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Get user info
    const userRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();
    const displayName = userData?.data?.user?.display_name || 'TikTok User';
    const avatarUrl = userData?.data?.user?.avatar_url || '';

    // Render success page with upload form
    const html = `
      <div style="text-align:center; margin-bottom:2rem;">
        ${avatarUrl ? `<img src="${avatarUrl}" style="width:80px;height:80px;border-radius:50%;margin-bottom:1rem;">` : ''}
        <h2>✅ Verbunden als ${displayName}</h2>
        <p style="color:#666;">TikTok-Login erfolgreich. Du kannst jetzt Videos hochladen.</p>
      </div>
      
      <div style="background:#f8f8f8;border-radius:12px;padding:2rem;max-width:500px;margin:0 auto;">
        <h3>Video als Draft hochladen</h3>
        <form id="uploadForm">
          <input type="hidden" id="accessToken" value="${tokenData.access_token}">
          <div style="margin:1rem 0;">
            <label style="display:block;margin-bottom:0.5rem;font-weight:600;">Video-URL</label>
            <input type="url" id="videoUrl" placeholder="https://stiefundgluecklich.de/videos/reel.mp4" 
              style="width:100%;padding:0.75rem;border:1px solid #ddd;border-radius:8px;font-size:1rem;" required>
            <small style="color:#888;">Öffentlich erreichbare URL zur Video-Datei</small>
          </div>
          <button type="submit" id="uploadBtn"
            style="width:100%;padding:0.75rem 1.5rem;background:#FE2C55;color:white;border:none;border-radius:8px;font-size:1rem;cursor:pointer;font-weight:600;">
            📤 Als Draft hochladen
          </button>
        </form>
        <div id="result" style="margin-top:1rem;"></div>
      </div>

      <script>
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const btn = document.getElementById('uploadBtn');
          const result = document.getElementById('result');
          btn.disabled = true;
          btn.textContent = '⏳ Wird hochgeladen...';
          result.innerHTML = '';

          try {
            const res = await fetch('/api/tiktok-upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                access_token: document.getElementById('accessToken').value,
                video_url: document.getElementById('videoUrl').value,
              }),
            });
            const data = await res.json();
            if (data.success) {
              result.innerHTML = '<p style="color:#22c55e;font-weight:600;">✅ Video als Draft hochgeladen! Öffne TikTok um es zu veröffentlichen.</p>';
            } else {
              result.innerHTML = '<p style="color:#ef4444;">❌ ' + (data.error || 'Upload fehlgeschlagen') + '</p>';
            }
          } catch (err) {
            result.innerHTML = '<p style="color:#ef4444;">❌ Netzwerkfehler: ' + err.message + '</p>';
          }
          btn.disabled = false;
          btn.textContent = '📤 Als Draft hochladen';
        });
      </script>
    `;

    return new Response(renderHTML('TikTok verbunden', html), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err) {
    return new Response(renderHTML('Fehler', `<p>Server-Fehler: ${err.message}</p><a href="/tiktok-demo">Zurück</a>`), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}

function renderHTML(title, body) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — StiefundGlücklich</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:#FBF8F1; color:#1a1a1a; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem; }
    .container { max-width:600px; width:100%; }
    h2 { font-size:1.5rem; margin-bottom:0.5rem; }
    h3 { font-size:1.1rem; margin-bottom:1rem; }
    a { color:#FE2C55; }
  </style>
</head>
<body><div class="container">${body}</div></body>
</html>`;
}
