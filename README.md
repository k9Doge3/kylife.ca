INTEGRATED APPS  
Build v0.3

BOTNET CONTROL MATRIX

All  
Core  
Ops  
Business  
Entertainment

QT314 NODE  
ONLINE  
Qt314.ca live feed — kawaii-zone front-end relay.

[ entertainment ]

HALF-LIFE GRID  
SECURE  
Main kylife.ca deployment controls and console uplink.

[ core ]

WHITE LAPTOP  
ONLINE  
Remote desktop uplink via rdp.kylife.ca.

[ core ]

CLOUDFLARE TUNNEL  
MAINTENANCE  
Inspect tunnel routes and active ingress rules.

[ ops ]

CRM NODE  
ONLINE  
EspoCRM operations node for wildrosepainters.ca.

[ business ]

< BACK TO MAIN MENU  
[ use ↑ / ↓ or W / S to cycle nodes // enter ]

## Docker & Cloudflare mapping

| Domain / Endpoint             | Host Binding        | Container          | How to run                                                                                 |
| ----------------------------- | ------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `https://kylife.ca`           | `0.0.0.0:3002`    | `kylife-web`       | `cd "c:\project 1\kylife.ca" && docker compose up --build -d`                            |
| `https://www.kygroup.ca`      | `0.0.0.0:3100`    | `kygroup-web`      | `cd "c:\project 1\kylife.ca\www.kygroup.ca" && docker build -t kygroup-web . && docker run -d --name kygroup-web -p 0.0.0.0:3100:3000 kygroup-web` |
| `https://www.dashboard.kygroup.ca` | `0.0.0.0:3200` | `dashboard-web` | `cd "c:\project 1\karimportfoliowebsitemain1" && docker build -f Dockerfile.web -t dashboard-web . && docker run -d --name dashboard-web -p 0.0.0.0:3200:3000 dashboard-web` |
| `https://photos.kylife.ca`    | `0.0.0.0:2342`    | `photoprism-public` | `cd "c:\project 1\kylife.ca" && docker compose -f docker-compose.photoprism.yml up -d`   |
| `https://ops.kylife.ca/photos`| `0.0.0.0:2343`    | `photoprism-private`| Same as above (stack starts db + both front-ends)                                          |
| `https://admin.kylife.ca`     | `0.0.0.0:2344`    | `dev-dashboard`     | `cd "c:\project 1\dev-dashboard" && docker build -t dev-dashboard . && docker run -d --name dev-dashboard -p 0.0.0.0:2344:4500 dev-dashboard` |

Point Cloudflare tunnels (or origin rules) at the `http://127.0.0.1:<port>` targets above. `photoprism-db` stays internal on the Docker network and does not need a tunnel entry. A full tunnel runbook now lives in `../cloudflared/README.md` with per-hostname details.

## Cloudflare tunnel setup

- Existing config + credentials already live under `C:\Users\ky\.cloudflared`:
  - `config.yml` (tunnel `e75936f1-2a7e-4101-90a1-3023a051b07d` mapping all kylife / qt314 / photo hosts)
  - `cert.pem` (Cloudflare-issued cert for authenticating the tunnel)
- Reuse them as-is by running `cloudflared` locally:

```powershell
cd "C:\project 1\kylife.ca"
cloudflared tunnel --config "$env:USERPROFILE\.cloudflared\config.yml" run
```

- If you prefer to run `cloudflared` via Docker, mount the same directory into the container so the existing config & cert are used:

```yaml
# docker-compose.cloudflare.yml
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared-tunnel
    command: tunnel --config /etc/cloudflared/config.yml run
    volumes:
      - ${USERPROFILE:-C:/Users/ky}/.cloudflared:/etc/cloudflared:ro
    restart: unless-stopped
```

> Note: When running inside Docker Desktop on Windows, keep using the existing config values that point to `http://localhost:<port>`; they continue to work because all exposed services publish those ports on the host.

### PhotoPrism stack

The new `docker-compose.photoprism.yml` brings up:

- `photoprism-db` (MariaDB 10.11) persisted in `database/mysql`
- `photoprism-public` on port `2342`
- `photoprism-private` on port `2343`

Persistent media lives under `storage/photoprism/<public|private>/{originals,storage}` and is ignored by git. Copy `.env.example` to `.env` and fill in the `PHOTOPRISM_*` secrets before exposing the services publicly.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
