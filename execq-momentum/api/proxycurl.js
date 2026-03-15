export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.PROXYCURL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Proxycurl API key not configured' });
  }

  const { linkedin_url } = req.body || {};
  if (!linkedin_url) {
    return res.status(400).json({ error: 'linkedin_url is required' });
  }

  try {
    const params = new URLSearchParams({
      linkedin_profile_url: linkedin_url,
      use_cache: 'if-present',
      fallback_to_cache: 'on-error',
    });

    const response = await fetch(
      `https://nubela.co/proxycurl/api/v2/linkedin?${params}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const rawText = await response.text();
    let data = {};
    try { data = JSON.parse(rawText); } catch(e) {}

    if (response.status === 429) {
      return res.status(200).json({ error: 'Rate limit reached', code: 429, _raw_status: 429 });
    }
    if (response.status === 404) {
      return res.status(200).json({ error: 'Profile not found', code: 404, _raw_status: 404 });
    }
    if (!response.ok) {
      return res.status(200).json({ error: `Proxycurl error: ${response.status}`, code: response.status, _raw_status: response.status, _raw_body: rawText.slice(0, 300) });
    }

    const result = {
      full_name: [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
      headline: data.headline || null,
      follower_count: data.follower_count || 0,
      connections: typeof data.connections === 'number' ? data.connections : 0,
      activities: (data.activities || []).slice(0, 10).map(a => ({
        num_likes: a.num_likes || 0,
        num_comments: a.num_comments || 0,
      })),
      // Debug: raw fields from Proxycurl
      _raw_first_name: data.first_name,
      _raw_last_name: data.last_name,
      _raw_follower_count: data.follower_count,
      _raw_connections: data.connections,
      _raw_headline: data.headline,
      _raw_status: response.status,
      _raw_keys: Object.keys(data).slice(0, 20),
    };

    return res.status(200).json(result);

  } catch (err) {
    return res.status(200).json({ error: 'Network error: ' + err.message, code: 0 });
  }
}
