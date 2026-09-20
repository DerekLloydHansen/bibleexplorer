# Bible Explorer YouVersion proxy

This Cloudflare Worker keeps the YouVersion App Key out of the public GitHub Pages bundle. The browser calls the Worker; the Worker calls YouVersion with its private `YVP_APP_KEY` secret.

## One-time setup

From this directory:

```bash
npx wrangler login
npx wrangler secret put YVP_APP_KEY
npx wrangler deploy
```

When prompted for `YVP_APP_KEY`, paste a newly generated YouVersion App Key. Do not commit it to GitHub or put it in `app.js`.

The deployed Worker will be available at:

```text
https://bibleexplorer-api.<your-cloudflare-subdomain>.workers.dev
```

## Endpoints

- `GET /health`
- `GET /bibles`
- `GET /version?id=VERSION_ID`
- `GET /passage?versionId=VERSION_ID&passage=ISA.1.1&format=html`
- `GET /passage?versionId=VERSION_ID&passage=ISA.1.1&format=json`

The Worker only allows the public GitHub Pages origin, forwards the App Key server-side, and caches successful reads for one day.
