const markdownItFootnote = require("markdown-it-footnote");
const categories = require("./src/_data/categories.js");
const authors = require("./src/_data/authors.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");

  eleventyConfig.amendLibrary("md", (md) => md.use(markdownItFootnote));

  eleventyConfig.addFilter("readableDate", (value) =>
    new Date(value).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
  );

  eleventyConfig.addFilter("monthYear", (value) =>
    new Date(value).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      timeZone: "UTC",
    })
  );

  eleventyConfig.addFilter("isoDate", (value) =>
    new Date(value).toISOString().slice(0, 10)
  );

  eleventyConfig.addFilter("readingTime", (content) => {
    const words = String(content).replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean);
    return Math.max(1, Math.round(words.length / 200));
  });

  eleventyConfig.addFilter("category", (slug) =>
    categories.find((entry) => entry.slug === slug)
  );

  eleventyConfig.addFilter("author", (slug) =>
    authors.find((entry) => entry.slug === slug)
  );

  eleventyConfig.addFilter("byCategory", (posts, slug) =>
    posts.filter((post) => post.data.category === slug)
  );

  eleventyConfig.addFilter("byAuthor", (posts, slug) =>
    posts.filter((post) => post.data.author === slug)
  );

  eleventyConfig.addFilter("exclude", (posts, url) =>
    posts.filter((post) => post.url !== url)
  );

  eleventyConfig.addFilter("limit", (posts, count) => posts.slice(0, count));

  // Related: same category first, then anything else recent.
  eleventyConfig.addFilter("related", (posts, current) => {
    const others = posts.filter((post) => post.url !== current.url);
    const sameCategory = others.filter(
      (post) => post.data.category === current.data.category
    );
    const rest = others.filter(
      (post) => post.data.category !== current.data.category
    );
    return [...sameCategory, ...rest].slice(0, 3);
  });

  eleventyConfig.addCollection("articles", (collectionApi) =>
    collectionApi.getFilteredByTag("articles").reverse()
  );

  eleventyConfig.addCollection("projects", (collectionApi) =>
    collectionApi.getFilteredByTag("projects").reverse()
  );

  eleventyConfig.addCollection("featured", (collectionApi) =>
    collectionApi
      .getFilteredByTag("articles")
      .reverse()
      .filter((post) => post.data.featured)
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
