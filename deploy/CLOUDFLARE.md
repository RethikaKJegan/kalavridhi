# Current production hosting

- Site: https://kalavridhi.kalavridhi-arts.workers.dev
- Admin: https://kalavridhi.kalavridhi-arts.workers.dev/admin
- Cloudflare Worker: `kalavridhi`; database: `kalavridhi-cms` (`CMS_DB`).
- Uses Workers Free and D1; no R2 subscription or paid plan was activated.
- `kalavridhi.com` is not connected: ownership and DNS control have not been verified.

## Development and deployment

Use Node.js 22 or newer and `npm ci`. Existing `npm run dev` and `npm run build` run Next.js using local JSON files. `npm run dev:vinext` and `npm run build:vinext` use the Cloudflare adapter. The Vite alias selects the D1 storage implementation only for the Worker build.

1. Run `npm run check:cloudflare`.
2. Set `NEXT_PUBLIC_SITE_URL` to the production URL in the build environment. It must agree with `wrangler.jsonc`, as public environment values may be embedded during bundling.
3. Run `npm run build:vinext`.
4. Run `npx wrangler deploy --config dist/server/wrangler.json`.

The CLI must be authenticated to the correct Cloudflare account. Credentials remain in Wrangler's user configuration, never Git. Runtime `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are Worker secrets; deployments preserve them. The deployed admin password is the existing local `ADMIN_PASSWORD` from `.env.local`. The production session secret was generated independently. Rotate both through the Cloudflare secret configuration if needed.

Initial database contents were imported from `deploy/cloudflare/seed.sql`. Do not rerun seed imports on an established CMS: deleted seed records could be restored. Deploying code does not overwrite D1 records or uploaded images.

## Data, images and security

CMS records and new image uploads are stored persistently in D1. Existing photos are bundled as static assets. New uploads are validated by their file signatures and capped at 1.5 MB; the artwork uploader compresses larger photos in the browser from inputs up to 10 MB. Animated GIFs must already fit the 1.5 MB limit. This limit keeps uploads below D1's per-row limit. D1 is intended here for a small portfolio; migrate media to object storage if requirements grow.

Admin routes and APIs require a signed, expiring session. Cookies use Secure, HttpOnly and SameSite=Lax in production. Login attempts are limited to 10 per IP per 15 minutes in persistent D1 storage. Cross-origin admin writes are rejected. HTTPS, noindex admin headers, and upload content-type protections are enabled.

Free service quotas still apply. Monitor usage in Cloudflare. No uptime guarantee or unlimited usage is implied.

## Backups and recovery

Export the complete database, including stored image blobs, before significant admin changes and keep encrypted copies outside this computer/account:

```powershell
New-Item -ItemType Directory -Force .backups
npx wrangler d1 export kalavridhi-cms --remote --output .backups/kalavridhi.sql
```

`.backups/` is ignored by Git. Restore into a separate staging database first and verify record counts, admin editing and image retrieval before considering a production restore. The earlier VPS backup script applies only to filesystem deployments; it does not back up the Cloudflare database. Domain connection is a separate step after ownership is verified.

## Verification performed

Worker build and Cloudflare TypeScript checks; production HTTP responses; HTTPS; admin authentication and unauthorized API rejection; create/read/update/delete on temporary draft artwork; D1 image upload and byte-for-byte retrieval; sitemap, robots and canonical URL; all referenced initial homepage assets. Browser visual review was blocked by the user's browser permission gate and was not performed.
