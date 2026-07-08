export const config = { runtime: 'edge' };

const SENDGRID_HOST = 'sendgrid.net';
const YOUR_DOMAIN = 'url9641.heirwise.ca'; // <-- update if your branded subdomain differs

export default async function handler(request) {
  const url = new URL(request.url);
  const target = `https://${SENDGRID_HOST}${url.pathname}${url.search}`;

  // Copy incoming headers, but override Host so SendGrid resolves correctly
  const headers = new Headers(request.headers);
  headers.set('host', YOUR_DOMAIN);

  const proxied = await fetch(target, {
    method: request.method,
    headers,
    redirect: 'manual', // pass redirects through untouched so the browser follows them naturally
  });

  // Pass the response straight back to the browser
  return new Response(proxied.body, {
    status: proxied.status,
    statusText: proxied.statusText,
    headers: proxied.headers,
  });
}
