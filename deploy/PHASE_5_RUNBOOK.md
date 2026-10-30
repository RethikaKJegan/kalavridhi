# Phase 5 — VPS deployment runbook

This repository contains the application-side deployment package. The production rollout remains pending until the owner verifies domain ownership and supplies VPS/DNS access. The domain below is an example based on the current project preference; do not issue a certificate or enable the final Nginx vhost until it is confirmed.

## 1. Values required before rollout

- Verified canonical domain and whether `www` should redirect to it.
- Ubuntu 22.04/24.04 VPS hostname/IP and SSH access for the operator.
- DNS provider access to point the apex and `www` A/AAAA records at the VPS.
- A unique production admin password and session secret. Keep the real values only in `/var/www/kalavridhi/.env.production`; use `deploy/env.production.example` as a key list, never as the live secret file.
- Google Search Console owner access for the final property verification and sitemap submission.

## 2. Server setup

Run as an authorized VPS administrator. Confirm SSH access before enabling a firewall.

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y nginx certbot python3-certbot-nginx ufw fail2ban curl git
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Install Node.js 20 LTS (Next.js 16 requires a supported Node 20 release) and PM2 using the current official installation instructions for the selected Ubuntu release. Verify `node --version`, `npm --version`, and `pm2 --version` before deploying.

## 3. Deploy the application

```bash
sudo mkdir -p /var/www/kalavridhi
sudo chown -R "$USER":"$USER" /var/www/kalavridhi
cd /var/www/kalavridhi
git clone https://github.com/RethikaKJegan/kalavridhi.git .
npm ci
```

Create `/var/www/kalavridhi/.env.production` with `NODE_ENV`, `PORT`, the verified `NEXT_PUBLIC_SITE_URL`, and strong unique `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` values. Restrict it with `chmod 600 .env.production`.

Create and preserve the mutable CMS directories before the first run. Keep these on the VPS across code updates:

```bash
mkdir -p data public/images/uploads
chmod 750 data public/images/uploads
npm run build
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup
```

Copy the exact startup command printed by `pm2 startup` and run it. The PM2 file intentionally uses one forked process because the CMS stores records as local JSON files; clustering multiple processes can race on writes. Keep Node bound to localhost; expose only Nginx ports 80/443 publicly.

## 4. DNS, first certificate, and Nginx

After domain ownership is confirmed, set the apex and `www` DNS records to the VPS and wait for both to resolve. Replace the sample hostnames in `deploy/nginx/kalavridhi-http-bootstrap.conf` with the verified domain. Install it in `sites-available`, enable it, run `sudo nginx -t`, and reload Nginx. Then request the certificate:

```bash
sudo certbot --nginx -d kalavridhi-arts.com -d www.kalavridhi-arts.com
```

Replace the sample hostnames and certificate paths in `deploy/nginx/kalavridhi.conf` with the actual values, enable that final vhost, and validate before reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo certbot renew --dry-run
```

The final Nginx config serves immutable `/_next/static/` assets directly, revalidates uploaded media on a 30-day cache, caps request uploads at 12 MB, rate-limits the admin login endpoint, applies TLS/security headers, and proxies the app to `127.0.0.1:3000`.

## 5. Daily backups and restore

Install `deploy/backup-kalavridhi.sh` as `/usr/local/bin/backup-kalavridhi.sh`, make it executable, and ensure the backup directory is writable only by the deployment operator. It archives `data/` and `public/images/uploads/`, validates gzip integrity, then removes local archives older than 14 days.

Add the daily 02:30 server-local-time cron entry:

```cron
30 2 * * * /usr/local/bin/backup-kalavridhi.sh >>/var/log/kalavridhi-backup.log 2>&1
```

This script is a local backup only. Configure and test encrypted off-site replication to an owner-controlled destination before treating the backup plan as disaster recovery. Periodically test a restore into a separate staging directory:

```bash
tar -tzf /var/backups/kalavridhi/kalavridhi_backup_<timestamp>.tar.gz
mkdir -p /tmp/kalavridhi-restore-check
tar -xzf /var/backups/kalavridhi/kalavridhi_backup_<timestamp>.tar.gz -C /tmp/kalavridhi-restore-check
```

For a real restore, stop PM2 first, restore `data/` and `public/images/uploads/` to the app directory with the correct owner/permissions, then start PM2 and verify the public site and admin CRUD.

## 6. Post-launch checks and handover

- Check HTTPS, canonical redirects, certificate renewal, and security response headers.
- Check `/robots.txt`, `/sitemap.xml`, public OpenGraph metadata, and JSON-LD.
- Check admin/login and the `X-Robots-Tag: noindex, nofollow, noarchive` header on admin pages and admin APIs.
- Check WhatsApp messages for the hero, artwork lightbox, workshop registration, and general contact path.
- Check admin add/edit/delete and image uploads; confirm updates appear on the public page without rebuilding.
- Check desktop and mobile overflow, keyboard operation, reduced motion, and screen-reader labels.
- In the verified Google Search Console property, submit `https://<verified-domain>/sitemap.xml`; indexing timing is controlled by Google.
- Hand Nishkala the admin URL, credentials through a separate secure channel, and the owner-approved editing/backup process. Never place credentials in Git or this runbook.
