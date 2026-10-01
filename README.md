# CF88

**A web platform for browsing Brazilian legal reference content, with a spreadsheet-powered editorial workflow.**

CF88 brings STF and STJ reference material into dedicated web pages and gives administrators tools to manage that content. Google Sheets provides an import source, MongoDB stores the application data, and Next.js delivers the public site and API routes.

The interface and legal content are in Portuguese.

## Highlights

- Dedicated pages for legal entries at `/stf/[sheet]/[title]`.
- Five content categories covering STF theses and STF/STJ súmulas.
- An administration panel with content creation, editing, deletion, filtering, and pagination.
- Google Sheets import and XLSX backup generation, with Google Drive integration code.
- Email/password accounts using Passport and bcrypt, with MongoDB-backed sessions.
- Lead collection and a most-viewed content listing.

## Stack

| Layer | Technologies |
| --- | --- |
| Application | Next.js 10, React 17 |
| Interface | React Bootstrap, styled-components |
| Data | MongoDB, SWR |
| Authentication | Passport Local, bcryptjs, next-session |
| Integrations | google-spreadsheet, Google APIs, ExcelJS |

## Getting started

You will need Node.js, npm, a reachable MongoDB instance, and Google credentials for the integrations you intend to use. This project uses an older dependency stack; installation and builds may require compatibility work on newer Node.js versions.

```bash
git clone https://github.com/mateustalles/cf88.git
cd cf88
npm install
```

### Environment configuration

Create `.env.local` in the project root:

```dotenv
MONGODB_URI=mongodb://localhost:27017
DB_NAME=cf88
SESSION_SECRET=replace-with-a-long-random-secret

GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
SHEET_ID=your-spreadsheet-id

# Google Drive OAuth integration
OAUTH_CLIENT_ID=your-oauth-client-id
PROJECT_ID=your-google-cloud-project-id
CLIENT_SECRET=your-oauth-client-secret
```

Keep credentials out of version control and preserve the private key's line breaks. Enable the Google Sheets and Drive APIs as needed, and share your source spreadsheet with the service account.

For local Drive OAuth, register `http://localhost:3000/oauth2callback` as an authorized redirect URI. Review the deployment callback in `pages/api/google/google-auth.js` when hosting under a different domain.

### Start the application

Start MongoDB separately, then run:

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). MongoDB must be available: several pages query it during server rendering or static generation.

### Create an administrator

1. Register an account at `/signup`.
2. In your configured database, promote that account using `mongosh`:

   ```js
   use cf88
   db.users.updateOne(
     { email: "you@example.com" },
     { $set: { role: "admin" } }
   )
   ```

3. Log in at `/login`, then open `/admin/cp`.

Use your configured `DB_NAME` instead of `cf88` if different. Registration handles password hashing with bcrypt; no manual password hash is needed.

## Spreadsheet content

The importer expects these exact worksheet names:

| Worksheet | Route category |
| --- | --- |
| `TESE SEM REPERCUSSÃO GERAL` | `teses-sem-repercussao-geral` |
| `TESE COM REPERCUSSÃO GERAL` | `teses-com-repercussao-geral` |
| `SÚMULA VINCULANTE` | `sumula-vinculante` |
| `SÚMULA STJ` | `sumula-stj` |
| `SÚMULA STF` | `sumula-stf` |

Each worksheet needs a header row and at least one data row. The importer uses the first column as the page title and the second as the text used to derive `verbatimSlug`. Remaining columns become named content fields. See [`lib/fetchData.js`](lib/fetchData.js) for the transformation logic and the workbook in `files/` for an existing example.

An authenticated administrator can import the configured `SHEET_ID` through `GET /api/update-stf`, or submit a different spreadsheet through `POST /api/update-stf` with a JSON body:

```json
{ "sheetId": "your-spreadsheet-id" }
```

Import replaces the stored pages collection. Back up existing content before importing a new source. Generated content URLs currently use the hardcoded `https://www.cf88.com.br` domain in `lib/fetchData.js`.

## Useful routes

| Route | Purpose |
| --- | --- |
| `/` | Public landing page and featured content |
| `/stf/[sheet]/[title]` | Individual legal reference entry |
| `/signup`, `/login` | Account registration and sign-in |
| `/admin/cp` | Content management |
| `/admin/leads` | Lead management interface |
| `/admin/settings` | Settings and integration interface |

## Commands

```bash
npm run dev     # Development server
npm run build   # Production build
npm start       # Serve the production build
```

The production build also needs database access. The `startdb` script contains a deployment-specific MongoDB path and requires PM2; configure it for your environment before using it. No automated test script is defined.

## Project structure

```text
components/   Public interface and administration components
context/      Shared interface state
db/           Database operations used by API handlers
hooks/        User, viewport, and page tracking hooks
lib/          Sheets import, Drive integration, XLSX export, helpers
middlewares/  Database, session, and authentication middleware
models/       Content and lead persistence helpers
pages/        Next.js pages and API routes
styles/       Global styles and CSS modules
files/        XLSX backups
```

## Integration status

The repository includes integration scaffolding that requires configuration and validation. The contact email handler still contains placeholder mail credentials. Google Drive workflows depend on OAuth setup, and the administration interface's role checks should be accompanied by a review of authorization in API handlers before public deployment.

## License

[GNU GPL v3](LICENSE).
