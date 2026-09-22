# The Observatory

Student-led analysis across economics, finance, politics and ideas.

Built with [Eleventy](https://www.11ty.dev/). Articles are Markdown files — there is no database
and no login. Writing an article means adding a file.

---

## Running it locally

```bash
npm start
```

Opens at http://localhost:8080 and reloads as you edit.

---

## Adding an article

There are two ways. Use whichever suits you.

### Option A — in the browser (no terminal)

Click this link, which opens GitHub's editor with the template already filled in:

**[Write a new article](https://github.com/xavierkhan1217-dev/the-observatory/new/main?filename=src/articles/new-article.md&value=---%0Atitle%3A%20Your%20headline%20here%0Asubtitle%3A%20One%20or%20two%20sentences%20shown%20under%20the%20headline%20and%20on%20article%20cards.%0Aauthor%3A%20xavier-khan%0Acategory%3A%20economics%0Asubcategory%3A%20Macroeconomics%0Adate%3A%202026-09-22%0Afeatured%3A%20true%0Atopics%3A%20%5B%5D%0A---%0A%0AWrite%20your%20article%20here.%0A)**

Then:

1. Change `new-article.md` in the filename box to something matching your headline,
   e.g. `productivity-growth.md`. **Lowercase, hyphens instead of spaces, keep the `.md`** —
   the filename becomes the article's web address.
2. Edit the fields at the top and write the article below them.
3. Click **Commit changes…**, then **Commit changes** again.

The site rebuilds and publishes itself within a minute or two. Bookmark that link.

### Option B — on your laptop

```bash
npm run new -- "Your headline here"
```

This creates `src/articles/your-headline-here.md`, already filled in, and opens it.
When you have finished writing, run `npm run publish`.

**2. Fill in the front matter** — the block at the top between `---` lines:

```yaml
---
title: Why Productivity Growth Has Become So Difficult
subtitle: One or two sentences shown under the headline and on article cards.
author: xavier-khan
category: economics
subcategory: Macroeconomics
date: 2026-09-19
featured: true
topics: ["Productivity", "Growth"]
---
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | The headline |
| `subtitle` | yes | Standfirst — also used on cards and for search engines |
| `author` | yes | An author slug: `xavier-khan`, `giorgio-montecelli` |
| `category` | yes | `economics`, `finance`, `politics`, `ideas`, `technology`, `society` |
| `subcategory` | no | Any of the subcategories listed in `src/_data/categories.js` |
| `date` | yes | `YYYY-MM-DD`. Newest articles appear first |
| `featured` | no | `true` puts it in the homepage Featured block |
| `topics` | no | Tags shown at the end of the article and used by search |
| `image` | no | Path like `/images/my-photo.jpg`. Defaults to the section graphic |
| `math` | no | `true` enables LaTeX, e.g. `$Y = A K^{\alpha} L^{1-\alpha}$` |
| `references` | no | A list of sources, rendered at the end |

**3. Write the body** below the front matter in Markdown.

Supported in the body: headings (`##`), **bold**, *italic*, links, lists, tables, blockquotes
(rendered as pull quotes), images, footnotes (`[^1]`), inline SVG charts, and equations when
`math: true` is set.

**4. That's it.** Save the file. The article appears automatically on the homepage, on `/articles/`,
on its category page, and on the author's profile. Related articles and reading time are worked
out for you.

Full worked examples live in [`examples/articles/`](examples/articles/) — copy one into
`src/articles/` if you want a starting point.

---

## Adding a contributor

Edit `src/_data/authors.js` and add an entry. They get a profile page at
`/contributors/<slug>/` automatically, and any article using that slug links to them.

## Changing the sections

Edit `src/_data/categories.js`. Adding an entry creates the section page, adds it to the archive
filters and the footer. Set `inNav: true` to put it in the top navigation.

## Changing the name, tagline or contact email

All in `src/_data/site.js`.

---

## Publishing it (making it live)

The site is a folder of static files, so hosting is free.

**One-time setup:**

1. Put the project on GitHub:
   ```bash
   git init && git add -A && git commit -m "Initial site"
   ```
   Then create an empty repo on GitHub and follow its "push an existing repository" instructions.

2. Go to [netlify.com](https://netlify.com), sign in with GitHub, and choose
   **Add new site → Import an existing project**. Pick the repo. `netlify.toml` already tells it
   what to do, so accept the defaults.

3. You get a live URL immediately (e.g. `the-observatory.netlify.app`). A custom domain
   (`theobservatory.co.uk`) can be added in Netlify under **Domain settings** — expect roughly
   £10–15/year from a registrar.

**From then on, publishing is:**

```bash
git add -A && git commit -m "New article: headline" && git push
```

Netlify rebuilds and the article is live in about a minute.

---

## Being found on Google

Already handled in the build: a `sitemap.xml`, a `robots.txt`, canonical URLs, page titles,
meta descriptions and social preview tags.

Two things you must do yourself:

1. **Set the real domain.** In `src/_data/site.js`, change `url` from `https://example.com` to your
   actual address. Search engines use it for canonical URLs and the sitemap, so this matters.

2. **Register with Google.** Go to
   [Google Search Console](https://search.google.com/search-console), add your domain, verify
   ownership (Netlify makes this straightforward via DNS), then submit `https://yourdomain/sitemap.xml`.

Realistic expectation: indexing takes days to weeks, and a new site with few pages ranks for
almost nothing at first. What moves the needle is published articles that people link to and
share. The technical setup only ensures Google *can* find you — it cannot make you rank.
