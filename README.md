# Hao's Output Layer

This blog is built with [AstroPaper](https://github.com/satnaing/astro-paper) on Astro.

## Commands

```bash
npm install
npm run dev
npm run build
npm run new-post -- "My New Post" --tags "LLM,Math" --description "Short summary"
```

Content lives in `src/content/posts` and `src/content/pages`.

## Writing a Post

Create a post with:

```bash
npm run new-post -- "My New Post" --tags "LLM,Math" --description "Short summary"
```

That creates `src/content/posts/my-new-post.md` with AstroPaper frontmatter.
Edit the Markdown body under the frontmatter. Use normal Markdown, fenced code
blocks, and LaTeX math with `$inline$` or `$$block$$`.

To create an unpublished draft:

```bash
npm run new-post -- "Draft Title" --draft
```

Remove `draft: true` when the post is ready to publish.

## Publish to GitHub

Before pushing, verify locally:

```bash
npm run build
npm run lint
npm run format:check
```

Commit and push:

```bash
git status
git add .github .gitignore .prettierignore .prettierrc LICENSE README.md astro-paper.config.ts astro.config.ts eslint.config.js package-lock.json package.json public src scripts tsconfig.json
git commit -m "Migrate blog to AstroPaper"
git push origin main
```

GitHub Pages should be configured to deploy from GitHub Actions.
