# web

This site is hosted on GitHub pages. It uses 11ty (Eleventy) to build static
web pages, in a GitHub workflow. Most pages are entirely static, but events are
fetched from a spreadsheet during build time.

The contact form uses Basin for handling any contact requests.

## Development

Install dependencies:

    npm install

Build the site:

    SHEET_CSV_URL=<Spreadsheet URL> npx eleventy

Run the site in dev mode:

    npx eleventy-dev-server --dir=_site
