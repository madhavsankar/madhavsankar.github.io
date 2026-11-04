# Madhav Sankar — Personal Website

This portfolio is built with Gatsby and React and deployed to GitHub Pages. It keeps the animated black constellation hero and organizes experience, featured case studies, archive projects, education, and publications as React components backed by Markdown content.

The layout and interaction patterns are adapted from [Brittany Chiang’s v4 portfolio](https://github.com/bchiang7/v4) (MIT licensed). This repository retains the upstream copyright and license in [`LICENSE.bchiang7-v4`](LICENSE.bchiang7-v4). Personal data, imagery, and project content in this site are Madhav’s.

## Local development

Use Node.js 20 or newer:

```sh
npm ci
npm run develop
```

The development server is available at `http://localhost:8000`. Create and verify a production build with:

```sh
npm run build
npm run serve
```

Portfolio content is stored in `content/jobs/`, `content/featured/`, and `content/projects/`. The React components and Gatsby configuration are in `src/` and the repository root.

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` builds pull requests and deploys commits to `master`. In repository settings, configure **Settings → Pages → Build and deployment → Source: GitHub Actions** before relying on the workflow for production deployment. The custom domain is configured by `static/CNAME`.

The site does not include analytics or third-party tracking scripts.
