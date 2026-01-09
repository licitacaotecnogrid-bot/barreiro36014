# Using Neon with Cloudflare Pages (Edge functions)

Cloudflare Pages Functions run on the V8 isolate (Edge) and cannot open raw TCP sockets required by PostgreSQL drivers like `pg`.

Recommended approach:

1. Create a small server-side proxy (in an environment that supports TCP) that can talk to Neon using a standard Postgres client (e.g. `pg` or Prisma). This proxy exposes a secure HTTP(s) endpoint that the Cloudflare Pages functions can call.

2. Configure Cloudflare Pages environment variables:
   - `NEON_API_URL` — the HTTPS URL of your proxy endpoint.
   - `NEON_SERVICE_KEY` — a secret token that the proxy validates to authenticate requests from your Pages functions.

3. Example proxy (Node) using `pg` (run on Vercel/Render/Fly or any Node runtime that supports TCP):

```javascript
// proxy/index.js
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
if (!process.env.NEON_SERVICE_KEY) throw new Error('NEON_SERVICE_KEY required');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${process.env.NEON_SERVICE_KEY}`) return res.status(401).json({ error: 'Unauthorized' });

  const { path, payload } = req.body;
  try {
    if (path === '/login') {
      const { email, password } = payload;
      // example SQL - adapt to your schema
      const { rows } = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1 LIMIT 1', [email]);
      // verify password, etc.
      return res.json({ rows });
    }

    return res.status(400).json({ error: 'Unknown path' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error', details: String(err) });
  }
});

app.listen(process.env.PORT || 3000);
```

4. Deploy the proxy to a secure host and set the `NEON_API_URL` in Cloudflare Pages to point to it.

This pattern keeps secrets and DB connectivity in a runtime that supports TCP while letting Cloudflare Pages functions run at the Edge.
