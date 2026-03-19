// Cloudflare Pages Function — TikTok Video Upload (Draft/Inbox mode)
// Uses Content Posting API with video.upload scope

export async function onRequestPost(context) {
  const { request } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const { access_token, video_url } = await request.json();

    if (!access_token || !video_url) {
      return new Response(JSON.stringify({ success: false, error: 'access_token und video_url sind erforderlich' }), {
        status: 400, headers: corsHeaders,
      });
    }

    // Step 1: Initialize video upload (pull from URL, inbox/draft mode)
    const initRes = await fetch('https://open.tiktokapis.com/v2/post/publish/inbox/video/init/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        source_info: {
          source: 'PULL_FROM_URL',
          video_url: video_url,
        },
      }),
    });

    const initData = await initRes.json();

    if (initData.error?.code !== 'ok' && initData.error?.code) {
      return new Response(JSON.stringify({
        success: false,
        error: `TikTok API: ${initData.error.message || initData.error.code}`,
        details: initData,
      }), { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Video als Draft an TikTok gesendet. Öffne die TikTok-App um es zu veröffentlichen.',
      publish_id: initData.data?.publish_id,
    }), { headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500, headers: corsHeaders,
    });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
