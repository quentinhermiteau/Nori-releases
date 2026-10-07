# Nori

**A fast, native Git client for Mac.** Written in Swift for Apple silicon, with
every update included in a single purchase.

[Website](https://meetnori.app) · [Download](https://meetnori.app/download) · [Pricing](https://meetnori.app/pricing) · [Compared with other clients](https://meetnori.app/compare) · [Release notes](https://github.com/quentinhermiteau/Nori-releases/releases)

[![Nori on macOS: a multi-branch commit graph, the sidebar with the current branch, and the working copy with a commit message ready](https://meetnori.app/assets/nori-app-demo.webp)](https://meetnori.app)

## What it does

- **See every branch at once.** A commit graph with each branch in its own colour. Drag a branch onto another to merge, rebase or cherry-pick; drop a commit to revert or push it.
- **Take Git back.** ⌘Z right after a commit, a branch deletion, a stash drop or a discard, with a 30-day operations log.
- **Stage what you mean.** Files, folders, hunks or single lines.
- **Resolve conflicts with the result in view.** A three-way resolver for merges, rebases and cherry-picks.
- **Review pull requests without the browser.** GitHub and GitLab: read the conversation, comment on lines, approve, follow and re-run CI checks, and merge.
- **Find any commit.** ⌘K searches the whole history with `author:`, `path:`, `content:`, `regex:` and date filters. File history and blame are one shortcut away.
- **Use your own AI tools.** Commit messages, explanations and conflict suggestions run through the agent CLI already on your Mac (Claude Code, Codex, Gemini CLI, Cursor). No API key, nothing sent to Nori, and every action can be switched off.

## Fast, because it is native

With git/git or microsoft/vscode open, Nori holds 83 to 99 MB at rest and loads
in 1.7 s on an M4 Pro. It is 31 MB installed. The method and the figures for
Fork, Sublime Merge, Sourcetree, GitKraken and GitHub Desktop are on
[the comparison page](https://meetnori.app/compare).

## Requirements

- macOS 26 or later, on Apple silicon
- Git 2.36 or later (Nori uses the `git` already on your Mac)

## Installing

Download Nori from [meetnori.app](https://meetnori.app/download), or
`Nori-arm64.zip` from the [latest release](https://github.com/quentinhermiteau/Nori-releases/releases/latest).
Unzip it and move `Nori.app` to Applications.

Nori isn't notarized by Apple yet, so the first time you open it macOS says it can't verify the developer. Open **System Settings ▸ Privacy & Security**, scroll down and click **Open Anyway**. You only do this once: updates install normally.

Nori starts a 14-day free trial on first launch, with no card. After that, a
licence is US$40 once for two Macs, with every update included. See
[pricing](https://meetnori.app/pricing).

## Privacy

The app has no product analytics and needs no account: an email starts the
trial and holds the licence. See the [privacy policy](https://meetnori.app/privacy).

## Reporting an issue

Use **Help ▸ Report an Issue** in Nori, or [open an issue](https://github.com/quentinhermiteau/Nori-releases/issues/new) here.

## About this repository

This repository distributes Nori's macOS release archives, their release notes
and the signed update feed. The Nori source code is maintained separately and
is not published here.
