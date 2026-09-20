#!/usr/bin/env node
// Usage: npm run new -- "Your headline here"
const fs = require("fs");
const path = require("path");

const categories = require("../src/_data/categories.js");
const authors = require("../src/_data/authors.js");

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Give the article a title, e.g.  npm run new -- "Why rates stayed high"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^\w\s-]/g, "")
  .replace(/\s+/g, "-")
  .slice(0, 60);

const target = path.join(__dirname, "..", "src", "articles", `${slug}.md`);

if (fs.existsSync(target)) {
  console.error(`Already exists: ${path.relative(process.cwd(), target)}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const body = `---
title: ${title}
subtitle: One or two sentences that appear under the headline and on article cards.
author: ${authors[0].slug}
category: ${categories[0].slug}
subcategory: ${categories[0].subcategories[0]}
date: ${today}
featured: false
topics: []
# Optional: set math: true to render LaTeX, e.g. $Y = A K^{\\alpha} L^{1-\\alpha}$
# Optional: references: ["Author (2026). Title. Journal."]
---

Write the article here in Markdown.

## A subheading

Normal paragraphs, **bold**, *italic* and [links](https://example.com) all work.

> A pull quote renders like this.

Categories available: ${categories.map((c) => c.slug).join(", ")}
Authors available: ${authors.map((a) => a.slug).join(", ")}
`;

fs.writeFileSync(target, body);
console.log(`Created src/articles/${slug}.md`);
console.log("Run `npm start` and it appears at /articles/" + slug + "/");
