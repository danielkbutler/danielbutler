# Daniel Butler — SEO portfolio

Static site for GitHub Pages. No build step: every page is plain HTML sharing `assets/css/site.css`.

## Before publishing
1. Find every placeholder: search the repo for `class="todo"`. They render as dashed vermilion boxes so you can also spot them visually.
2. Site URL is set to https://danielkbutler.github.io/danielbutler (update if you add a custom domain).
3. LinkedIn URL is set.
4. Résumé PDF is at assets/Daniel-Butler-Resume.pdf. Replace it when you update the résumé.
5. On `writing.html`, replace the `#` link on the altitude post card with its real URL.

## Deploy
1. Create a public repo named `<username>.github.io` (serves at the root) and push these files.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Optional custom domain: add it under Settings → Pages, then point your DNS at GitHub.

Paths are relative, so the site also works as a project site (`username.github.io/repo/`), except `404.html`, which links to `/`.
