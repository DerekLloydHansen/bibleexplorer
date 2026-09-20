const API_ORIGIN = "https://api.youversion.com";
const VERSION_ID = /^\d+$/;
const PASSAGE_ID = /^[A-Za-z0-9_.-]+$/;

function corsHeaders(request, env) {
  const requestOrigin = request.headers.get("Origin");
  const allowedOrigin = env.ALLOWED_ORIGIN || "https://dereklloydhansen.github.io";
  const origin = requestOrigin === allowedOrigin ? requestOrigin : allowedOrigin;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(data, status, request, env, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders(request, env),
      "Content-Type": "application/json; charset=utf-8",
      ...extra,
    },
  });
}

function cacheRequest(request) {
  const url = new URL(request.url);
  url.searchParams.sort();
  return new Request(url.toString(), request);
}

async function proxyYouVersion(request, env, targetUrl, cacheSeconds = 86400) {
  const cache = caches.default;
  const cacheKey = cacheRequest(request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  if (!env.YVP_APP_KEY) {
    return json({ error: "Worker secret YVP_APP_KEY is not configured." }, 500, request, env);
  }

  const upstream = await fetch(targetUrl, {
    headers: {
      Accept: "application/json",
      "X-YVP-App-Key": env.YVP_APP_KEY,
    },
  });
  const body = await upstream.arrayBuffer();
  const headers = new Headers(corsHeaders(request, env));
  headers.set("Content-Type", upstream.headers.get("Content-Type") || "application/json");
  headers.set("Cache-Control", upstream.ok ? `public, max-age=${cacheSeconds}` : "no-store");
  headers.set("X-BibleExplorer-Cache", "miss");
  const response = new Response(body, { status: upstream.status, headers });
  if (upstream.ok) await cache.put(cacheKey, response.clone());
  return response;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }
    if (request.method !== "GET") {
      return json({ error: "Only GET requests are supported." }, 405, request, env);
    }

    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return json({ ok: true, service: "bibleexplorer-api" }, 200, request, env, { "Cache-Control": "no-store" });
    }

    if (url.pathname === "/bibles") {
      return proxyYouVersion(request, env, `${API_ORIGIN}/v1/bibles?language_ranges%5B%5D=en`, 3600);
    }

    if (url.pathname === "/version") {
      const versionId = url.searchParams.get("id") || "";
      if (!VERSION_ID.test(versionId)) return json({ error: "A numeric version id is required." }, 400, request, env);
      return proxyYouVersion(request, env, `${API_ORIGIN}/v1/bibles/${versionId}`, 86400);
    }

    if (url.pathname === "/passage") {
      const versionId = url.searchParams.get("versionId") || "";
      const passage = url.searchParams.get("passage") || "";
      const format = url.searchParams.get("format") === "json" ? "json" : "html";
      if (!VERSION_ID.test(versionId)) return json({ error: "A numeric versionId is required." }, 400, request, env);
      if (!PASSAGE_ID.test(passage)) return json({ error: "A valid USFM passage id is required, such as ISA.1.1." }, 400, request, env);
      const target = `${API_ORIGIN}/v1/bibles/${versionId}/passages/${encodeURIComponent(passage)}?format=${format}`;
      return proxyYouVersion(request, env, target, 86400);
    }

    return json({ error: "Not found" }, 404, request, env);
  },
};
