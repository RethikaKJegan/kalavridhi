# Kala Vridhi Arts — Master Specification: Phases 4 & 5

**Project:** Kalavridhi / Kala Vridhi Arts (`kalavridhi-arts.com` / prospective `kalavridhi.com`)  
**Client / Founder:** Nishkala Krishna  
**Document Purpose:** Detailed engineering, optimization, security, SEO, and self-hosted Nginx deployment guide for completing Phase 4 and Phase 5.  
**Prerequisites Completed:** Phases 0, 1, 2, and 3 are built, verified, and running from `C:\Users\JKRFamily\Downloads\kalavridhi`.

---

## 1. Context & Progression Recap

| Phase | Description | Status |
|---|---|---|
| **Phase 0** | Asset audit, manifest, canonical renaming, client inputs log | ✅ Complete |
| **Phase 1** | Responsive static UI (Hero, ArtForms, About, Gallery, Moments, Upcoming, Recognition, Contact) | ✅ Complete |
| **Phase 2** | Restrained motion: 2D Watercolour Canvas, word-reveal, scroll reveals, 2.5D carousel | ✅ Complete |
| **Phase 3** | File-based CMS admin dashboard (`/admin`), full CRUD, file upload, auth middleware | ✅ Complete |
| **Phase 4** | **Conversion Hardening, Deep SEO, Mobile Core Web Vitals & Accessibility** | ⏳ **Target 1** |
| **Phase 5** | **Self-Hosted Nginx VPS Deployment, SSL, Systemd/PM2, Backups & Handover** | ⏳ **Target 2** |

---

## 2. Phase 4 — Conversion Hardening, SEO & Quality Assurance

### 4.1. Contact & Conversion Pipeline Hardening
The site is fundamentally a lead generation and trust-building portfolio. WhatsApp is the primary conversion channel.

- **Verified Contact Parameters:**
  - WhatsApp: `918925626784` (normalized format: country code `91` + 10 digits).
  - Instagram: `https://www.instagram.com/kala_vridhi_arts/`.
- **Form Hardening & Anti-Spam:**
  - **Honeypot Field:** Implement an invisible `<input type="text" name="hp_field" tabIndex="-1" autoComplete="off" style="display:none" />`. If populated on submission, discard the request silently as bot spam.
  - **Client-Side Validation:** Enforce phone number formatting (minimum 10 digits) and non-empty name before dispatching.
  - **Direct WhatsApp Protocol Fallback:** Ensure `window.open()` triggers cleanly across mobile browsers (iOS Safari pop-up blocker bypass) and desktop browsers (WhatsApp Web redirect).
- **Contextual WhatsApp Message Deep Links:**
  - Artwork Lightbox: `"Hello Nishkala, I saw your artwork '{artwork_title}' on Kalavridhi Arts and would like to enquire."`
  - Art Form Cards: `"Hello Nishkala, I am interested in learning {art_form_name}. Could you share course details?"`
  - Upcoming Workshops: `"Hello! I would like to register for the workshop '{workshop_title}'."`
  - General Hero CTA: `"Hello, I would like to know more about Kalavridhi Arts classes."`

### 4.2. Comprehensive Technical SEO & Structured Data
*Goal: Provide crawlers with structured, machine-readable facts and rich social previews without promising instant search engine indexing.*

- **Canonical URL & Domain Resolution:**
  - Enforce canonical domain (e.g., `https://kalavridhi-arts.com` or verified `https://kalavridhi.com`).
  - *Strict rule:* Reject underscores in hostnames (e.g. `kalavridhi_arts.com` is DNS-invalid).
- **Schema.org JSON-LD Structured Data:**
  Embed JSON-LD in `layout.tsx` or `page.tsx`:
  1. **VisualArtist / Person:**
     ```json
     {
       "@context": "https://schema.org",
       "@type": "VisualArtist",
       "name": "Nishkala Krishna",
       "alternateName": "T. Nishkala Krishna",
       "brand": "Kalavridhi Arts",
       "jobTitle": "Artist & Art Educator",
       "knowsAbout": ["Mandala art", "Madhubani art", "Kerala mural painting", "Tanjore fabric painting", "Zendoodle art", "Fabric painting"],
       "hasCredential": ["BCA", "MSc Psychology", "Diploma in Fashion Designing", "Diploma in Fine Arts"],
       "sameAs": ["https://www.instagram.com/kala_vridhi_arts/"]
     }
     ```
  2. **EducationalOrganization / LocalService:**
     ```json
     {
       "@context": "https://schema.org",
       "@type": "EducationalOrganization",
       "name": "Kalavridhi Arts",
       "slogan": "Grow Your Dream",
       "telephone": "+918925626784",
       "url": "https://kalavridhi-arts.com"
     }
     ```
  3. **Event (Dynamic):** Generate `VisualArtsEvent` schema dynamically whenever an active workshop in `data/workshops.json` has `status: "published"`.
- **Dynamic XML Sitemap & Robots:**
  - Verified in `src/app/sitemap.ts` and `src/app/robots.ts`.
  - Disallow indexing of `/admin/*` and `/api/*` in `robots.txt`.
  - Ensure all admin routes return `X-Robots-Tag: noindex, nofollow` HTTP headers via `middleware.ts`.
- **OpenGraph & Twitter Cards:**
  - High-resolution preview image (`/images/artwork/tanjore-fabric-painting.jpeg`, 1200x630).
  - Explicit `og:title`, `og:description`, `og:type=website`, and `twitter:card=summary_large_image`.

### 4.3. Performance Budget & Core Web Vitals (CWV)
*Target: Mobile Lighthouse Performance score ≥ 90, LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms.*

- **Image Optimization Matrix:**
  - Convert all client hero assets to responsive WebP with `sizes` attributes.
  - Set `fetchpriority="high"` strictly on the above-the-fold central Tanjore artwork.
  - Enable lazy loading (`loading="lazy"`) and asynchronous decoding on all below-the-fold galleries, moments, and recognition cards.
- **Canvas 2D Watercolour Optimization:**
  - Cap device pixel ratio at `1.5` (`Math.min(window.devicePixelRatio || 1, 1.5)`).
  - Cap animation frame rate to 28 FPS via timestamp delta checks.
  - Automatically pause rendering loop (`cancelAnimationFrame`) when `document.hidden` is true (background tabs).
  - Use `IntersectionObserver` on `#hero` to stop RAF when the user scrolls past the hero into the content sections.
- **CSS & Rendering Efficiency:**
  - Enforce `content-visibility: auto` on lower sections (`#gallery`, `#workshops`, `#recognition`) to defer rendering costs.
  - Keep `will-change: transform` only on active animating elements to prevent excess GPU layer memory consumption.

### 4.4. Accessibility (WCAG 2.1 AA) & Motion Hardening
- **Keyboard Trapping & Escape Handlers:**
  - Lightbox modal in `Gallery` and `Recognition` must trap focus, close on `Escape`, and return focus to the triggering element.
- **Focus Indicators:**
  - All interactive buttons, chips, and links must render high-contrast focus rings (`outline: 3px solid var(--peacock); outline-offset: 3px;`).
- **prefers-reduced-motion:**
  - Respect OS motion preferences: immediately disable Canvas drift, word-by-word animation, card floats, and scroll reveals (`opacity: 1 !important; transform: none !important; animation: none !important;`).
- **Screen Reader Verification:**
  - Ensure all authentic artwork images have descriptive, non-redundant `alt` tags stating art form, subject matter, and artist credit.

---

## 3. Phase 5 — Self-Hosted Production Rollout (Nginx & VPS)

### 5.1. Production Architecture Overview

```text
Internet / Users / Googlebot
          │
          │ HTTPS (Port 443) / Let's Encrypt SSL
          ▼
   [Nginx Reverse Proxy]
          │
          ├──> Static cache & immutable assets (/_next/static/*)
          ├──> Rate-limited Admin endpoints (/admin/*, /api/admin/*)
          │
          ▼ Reverse Proxy (HTTP Port 3000)
   [Next.js App (Node.js via PM2 / systemd)]
          │
          ├── Persistent Filesystem:
          │     ├── /var/www/kalavridhi/data/*.json
          │     └── /var/www/kalavridhi/public/images/uploads/
          │
          ▼ Daily Cron Script
   [Local / Encrypted Off-site Backup]
```

### 5.2. Server Preparation (Ubuntu 22.04 / 24.04 LTS)

1. **System packages & security update:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y nginx certbot python3-certbot-nginx ufw fail2ban curl
   ```
2. **Install Node.js 20+ LTS & PM2:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install -g pm2
   ```
3. **Firewall configuration:**
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

### 5.3. Application Deployment & Process Management

1. **Clone/Sync Project to Server:**
   ```bash
   sudo mkdir -p /var/www/kalavridhi
   sudo chown -R $USER:$USER /var/www/kalavridhi
   # Deploy code via Git or rsync to /var/www/kalavridhi
   cd /var/www/kalavridhi
   npm ci
   ```
2. **Set Production Environment (`.env.production`):**
   ```bash
   NODE_ENV=production
   ADMIN_PASSWORD="<STRONG_RANDOMLY_GENERATED_PASSWORD>"
   ADMIN_SESSION_SECRET="<SECURE_CRYPTO_HASH>"
   NEXT_PUBLIC_SITE_URL="https://kalavridhi-arts.com"
   PORT=3000
   ```
3. **Build Next.js Production Bundle:**
   ```bash
   npm run build
   ```
4. **Configure PM2 Process Runner:**
   Create `/var/www/kalavridhi/ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [
       {
         name: "kalavridhi",
         script: "node_modules/next/dist/bin/next",
         args: "start -p 3000",
         cwd: "/var/www/kalavridhi",
         instances: "max",
         exec_mode: "cluster",
         env: {
           NODE_ENV: "production",
         },
         restart_delay: 4000,
         max_memory_restart: "600M",
       },
     ],
   };
   ```
   Start and register startup boot:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### 5.4. Hardened Nginx Production Configuration

Create `/etc/nginx/sites-available/kalavridhi`:

```nginx
# Rate limiting zone for admin brute force protection
limit_req_zone $binary_remote_addr zone=admin_limit:10m rate=5r/m;

# HTTP -> HTTPS redirect (Enforce Canonical Domain)
server {
    listen 80;
    listen [::]:80;
    server_name kalavridhi-arts.com www.kalavridhi-arts.com;
    return 301 https://kalavridhi-arts.com$request_uri;
}

# Redirect www to non-www
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.kalavridhi-arts.com;
    
    ssl_certificate /etc/letsencrypt/live/kalavridhi-arts.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kalavridhi-arts.com/privkey.pem;
    
    return 301 https://kalavridhi-arts.com$request_uri;
}

# Primary Secure Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name kalavridhi-arts.com;

    # SSL Configuration (Certbot will manage)
    ssl_certificate /etc/letsencrypt/live/kalavridhi-arts.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kalavridhi-arts.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Max upload size (matched with CMS upload route limit of 10MB)
    client_max_body_size 12M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # 1. Immutable Next.js static assets
    location /_next/static/ {
        alias /var/www/kalavridhi/.next/static/;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 2. Uploaded Media caching (re-validated)
    location /images/uploads/ {
        alias /var/www/kalavridhi/public/images/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # 3. Rate-limited Admin Login & Auth API
    location /api/admin/auth/login {
        limit_req zone=admin_limit burst=3 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 4. Main Next.js application reverse proxy
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and test:
```bash
sudo ln -s /etc/nginx/sites-available/kalavridhi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Obtain SSL certificate:
```bash
sudo certbot --nginx -d kalavridhi-arts.com -d www.kalavridhi-arts.com
```

### 5.5. Automated Backup Pipeline (Cron Job)
Create `/usr/local/bin/backup-kalavridhi.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/kalavridhi"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

# Archive data JSON files and uploaded media
tar -czf "$BACKUP_DIR/kalavridhi_backup_$DATE.tar.gz" \
    -C /var/www/kalavridhi data/ public/images/uploads/

# Keep only the last 14 days of backups
find "$BACKUP_DIR" -type f -name "kalavridhi_backup_*.tar.gz" -mtime +14 -delete
```
Make executable and add to crontab (`crontab -e`):
```bash
# Run backup every night at 2:30 AM
30 2 * * * /usr/local/bin/backup-kalavridhi.sh >/dev/null 2>&1
```

### 5.6. Search Console Submission & Post-Launch Verification
1. **Google Search Console (GSC):**
   - Add property for `https://kalavridhi-arts.com`.
   - Verify via DNS TXT record or HTML meta tag.
   - Submit `https://kalavridhi-arts.com/sitemap.xml`.
2. **Post-Launch Smoke Test Checklist:**
   - [ ] SSL padlock intact; HTTP redirects automatically to HTTPS.
   - [ ] Both desktop and mobile viewports render without horizontal scroll or jank.
   - [ ] WhatsApp CTA buttons open directly into WhatsApp with the pre-filled message.
   - [ ] Contact form opens WhatsApp cleanly.
   - [ ] `/admin/login` accepts the new production password and rejects wrong attempts.
   - [ ] Adding a test artwork updates the public site immediately without build/restart.
   - [ ] Uploaded image appears properly formatted on the live page.
   - [ ] Deleting/editing artworks functions accurately.

---

## 4. Client Handover & Administration Runbook

A simple guide for Nishkala to operate her site without technical help:

1. **How to access the Admin Panel:**
   - Go to `https://kalavridhi-arts.com/admin` in any phone or laptop browser.
   - Enter your secure password and tap **Sign In**.
2. **Adding a New Artwork:**
   - Go to **Artworks** → click **+ Add Artwork**.
   - Type the title, pick the art style (e.g., *Mandala art*, *Kerala mural*).
   - Click **Upload** to choose a photo from your phone or laptop.
   - Check **Published (visible on site)** and click **Add Artwork**.
   - *It will appear in your public gallery immediately!*
3. **Announcing an Upcoming Workshop:**
   - Go to **Workshops** → click **+ Add Workshop**.
   - Enter title, date, location (or "Online"), and age range.
   - Switch status to **Published** and check **Registration Open**.
   - Click **Create Workshop**.
   - The workshop will show on the website with an instant "Register via WhatsApp" button.
4. **Updating Phone Number or Bio:**
   - Go to **Settings** to update your WhatsApp number, Instagram link, qualifications, or biography.
   - Click **Save All Settings**.
