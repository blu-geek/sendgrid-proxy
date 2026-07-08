# SendGrid Link Branding SSL Proxy

This is a minimal reverse proxy that forwards all traffic from your SendGrid
Link Branding subdomain (`url9641.heirwise.ca`) to SendGrid's servers
(`sendgrid.net`), while letting Vercel handle SSL for your custom domain.

This solves the "Your connection is not private" / NET::ERR_CERT_COMMON_NAME_INVALID
error, since SendGrid's default certificate doesn't cover your custom branded
subdomain, but Vercel will auto-issue and auto-renew a certificate for it.

## Deploy Option A — via GitHub (recommended)

1. Create a new repo on GitHub (e.g. `sendgrid-proxy`)
2. Push these files to it:
   ```
   git init
   git add .
   git commit -m "Initial proxy setup"
   git branch -M main
   git remote add origin https://github.com/<your-username>/sendgrid-proxy.git
   git push -u origin main
   ```
3. Go to https://vercel.com/new and import the repo
4. Click Deploy (no build settings needed — it's a static + edge function project)

## Deploy Option B — via Vercel CLI (no GitHub needed)

1. Install the CLI:
   ```
   npm install -g vercel
   ```
2. From inside this folder, run:
   ```
   vercel
   ```
3. Follow the prompts (log in, confirm project name, accept defaults)
4. It will deploy and give you a `*.vercel.app` URL to test with

## After deploying

1. In the Vercel dashboard, go to your project → Settings → Domains
2. Add `url9641.heirwise.ca`
3. Vercel will show a CNAME target, usually `cname.vercel-dns.com`
4. In GoDaddy DNS for heirwise.ca, edit your existing `url9641` CNAME record
   to point to that Vercel target instead of SendGrid directly
5. Wait for DNS to propagate (check with: `dig CNAME url9641.heirwise.ca +short`)
6. Vercel will auto-issue an SSL certificate for the subdomain once DNS resolves
7. Test by visiting a tracked link from a real SendGrid email — it should now
   load without a certificate warning
8. Contact SendGrid support to enable "SSL for Click and Open Tracking" on
   your account now that the proxy is confirmed working

## Notes

- If your branded subdomain is different from `url9641.heirwise.ca`, update
  the `YOUR_DOMAIN` constant in `api/proxy.js` before deploying.
- No SendGrid or Cloudflare account credentials are required for this setup.
- This does not touch or migrate your main `heirwise.ca` DNS — only the one
  `url9641` CNAME record changes.
