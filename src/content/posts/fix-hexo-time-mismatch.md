---
author: Hao Wang
pubDatetime: 2026-02-07T17:35:02-05:00
modDatetime: 2026-02-07T17:35:02-05:00
title: Hexo Time mismatch
tags:
  - bug
description: Notes on fixing Hexo post timestamps when GitHub Actions updates Markdown file metadata.
---

# Hexo Post time doesn't match

I found a bug that when I use GitHub Actions to push a new post, it updates all posts with the latest date.
The reason behind that is the GitHub Action updates the metadata for the Markdown files.
It seems Hexo uses the metadata as the creation date.

The solution is to change the `updated_option` in `_config.yaml` to `date`.

Reference: https://hexo.io/docs/configuration#Date-Time-format
