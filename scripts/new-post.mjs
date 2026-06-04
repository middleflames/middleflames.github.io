import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");
const DEFAULT_AUTHOR = "Hao Wang";
const DEFAULT_TIMEZONE = "America/New_York";

function usage() {
  process.stdout.write(`
Usage:
  npm run new-post -- "Post Title" [options]

Options:
  --description "Short summary"  SEO/listing description
  --tags "LLM,Math"              Comma-separated tags
  --slug "custom-slug"           Override generated filename slug
  --date "2026-06-04T10:00:00-04:00"
  --draft                        Mark the post as draft
`);
}

function parseArgs(args) {
  const options = {};
  const titleParts = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--draft") {
      options.draft = true;
      continue;
    }

    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = args[i + 1];

      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for --${key}`);
      }

      options[key] = value;
      i += 1;
      continue;
    }

    titleParts.push(arg);
  }

  return { title: titleParts.join(" ").trim(), options };
}

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pad(number) {
  return String(number).padStart(2, "0");
}

function toLocalIsoWithOffset(date) {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const offsetHours = Math.floor(absoluteOffset / 60);
  const offsetRemainder = absoluteOffset % 60;

  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
    ":",
    pad(date.getSeconds()),
    sign,
    pad(offsetHours),
    ":",
    pad(offsetRemainder),
  ].join("");
}

function yamlString(value) {
  return JSON.stringify(value);
}

function buildPost({ title, description, tags, date, draft }) {
  const tagLines = tags.map(tag => `  - ${yamlString(tag)}`).join("\n");
  const draftLine = draft ? "draft: true\n" : "";

  return `---
author: ${DEFAULT_AUTHOR}
pubDatetime: ${date}
title: ${yamlString(title)}
tags:
${tagLines}
description: ${yamlString(description)}
timezone: ${DEFAULT_TIMEZONE}
${draftLine}---

Start writing here.
`;
}

async function main() {
  const { title, options } = parseArgs(process.argv.slice(2));

  if (options.help) {
    usage();
    return;
  }

  if (!title) {
    usage();
    throw new Error("Post title is required.");
  }

  const slug = slugify(options.slug ?? title);
  if (!slug) {
    throw new Error("Could not generate a valid slug from the title.");
  }

  const tags =
    options.tags
      ?.split(",")
      .map(tag => tag.trim())
      .filter(Boolean) ?? ["notes"];

  const description =
    options.description ?? `TODO: Add a short description for ${title}.`;
  const date = options.date ?? toLocalIsoWithOffset(new Date());
  const filePath = path.join(POSTS_DIR, `${slug}.md`);

  if (existsSync(filePath)) {
    throw new Error(`Post already exists: ${filePath}`);
  }

  await mkdir(POSTS_DIR, { recursive: true });
  await writeFile(
    filePath,
    buildPost({
      title,
      description,
      tags,
      date,
      draft: Boolean(options.draft),
    }),
    "utf8"
  );

  process.stdout.write(`Created ${path.relative(process.cwd(), filePath)}\n`);
}

main().catch(error => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
