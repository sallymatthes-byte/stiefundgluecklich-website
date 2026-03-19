// Cloudflare Pages Function — TikTok Video Upload (Draft/Inbox mode)
// Uses FILE_UPLOAD method to avoid domain verification issues
// Flow: 1) Init upload → get upload_url  2) Return upload_url to browser  3) Browser uploads directly

export async function onRequestPost(context) {
  const { request } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const { access_token, action, upload_url, video_data, content_type, file_size } = await request.json();

    // Step 1: Initialize upload — get upload URL from TikTok
    if (action === 'init') {
      if (!access_token || !file_size) {
        return new Response(JSON.stringify({ success: false, error: 'access_token und file_size sind erforderlich' }), {
          status: 400, headers: corsHeaders,
        });
      }

      const initRes = await fetch('https://open.tiktokapis.com/v2/post/publish/inbox/video/init/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: file_size,
            chunk_size: file_size,
            total_chunk_count: 1,
          },
        }),
      });

      const initData = await initRes.json();

      if (initData.error?.code && initData.error.code !== 'ok') {
        return new Response(JSON.stringify({
          success: false,
          error: `TikTok API: ${initData.error.message || initData.error.code}`,
          details: initData,
        }), { status: 400, headers: corsHeaders });
      }

      return new Response(JSON.stringify({
        success: true,
        upload_url: initData.data?.upload_url,
        publish_id: initData.data?.publish_id,
      }), { headers: corsHeaders });
    }

    // Step 2: Proxy the upload to TikTok (browser can't do cross-origin PUT)
    if (action === 'upload') {
      if (!upload_url || !video_data) {
        return new Response(JSON.stringify({ success: false, error: 'upload_url und video_data erforderlich' }), {
          status: 400, headers: corsHeaders,
        });
      }

      // Decode base64 video data
      const binaryString = atob(video_data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const uploadRes = await fetch(upload_url, {
        method: 'PUT',
        headers: {
          'Content-Type': content_type || 'video/mp4',
          'Content-Range': `bytes 0-${bytes.length - 1}/${bytes.length}`,
        },
        body: bytes,
      });

      if (uploadRes.ok) {
        return new Response(JSON.stringify({
          success: true,
          message: 'Video als Draft an TikTok gesendet! Öffne die TikTok-App um es zu veröffentlichen.',
        }), { headers: corsHeaders });
      } else {
        const errText = await uploadRes.text();
        return new Response(JSON.stringify({
          success: false,
          error: `Upload fehlgeschlagen: ${uploadRes.status} ${errText}`,
        }), { status: 400, headers: corsHeaders });
      }
    }

    return new Response(JSON.stringify({ success: false, error: 'Unbekannte Aktion' }), {
      status: 400, headers: corsHeaders,
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500, headers: corsHeaders,
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
