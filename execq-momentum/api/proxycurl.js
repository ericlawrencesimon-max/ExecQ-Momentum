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
    // Proxycurl Person Profile Endpoint
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

    // Rate limit or billing issue
    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached', code: 429 });
    }

    // Profile not found or private
    if (response.status === 404) {
      return res.status(200).json({ error: 'Profile not found', code: 404 });
    }

    if (!response.ok) {
      const text = await response.text();
      return res.status(200).json({ error: `Proxycurl error: ${response.status}`, code: response.status });
    }

    const data = await response.json();

    // Map Proxycurl response fields to what the app expects
    const result = {
      full_name: [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
      headline: data.headline || null,
      follower_count: data.follower_count || 0,
      // Proxycurl returns connections as a number or null
      connections: data.connections || 0,
      // Recent posts for engagement rate calc
      activities: (data.activities || []).slice(0, 10).map(a => ({
        num_likes: a.num_likes || 0,
        num_comments: a.num_comments || 0,
      })),
    };

    return res.status(200).json(result);

  } catch (err) {
    // Network error — return empty so app falls back gracefully
    return res.status(200).json({ error: 'Network error', code: 0 });
  }
}
