# Nori

**A fast, free Git client for Mac, Windows and Linux.** Native Swift on Apple
silicon, light beside your IDE and your agents. Pro adds pull requests and
issues, bought once.

[Website](https://meetnori.app) · [Download](https://meetnori.app/download) · [Features](https://meetnori.app/features) · [Pricing](https://meetnori.app/pricing) · [Compared with other clients](https://meetnori.app/compare) · [Release notes](https://meetnori.app/changelog)

[![Nori on macOS: a multi-branch commit graph, the sidebar with the current branch, and the working copy with a commit message ready](https://meetnori.app/assets/nori-app-demo.webp)](https://meetnori.app)

## What it does

Free, on public and private repositories, with no account:

- **See every branch at once.** A commit graph with each branch in its own colour. Drag a branch onto another to merge, rebase or cherry-pick; drop a commit to revert or push it. Interactive rebase from one list.
- **Take Git back.** ⌘Z right after a commit, a branch deletion, a stash drop or a discard, with a 30-day operations log.
- **Stage what you mean.** Files, folders, hunks or single lines.
- **Resolve conflicts with the result in view.** A three-way resolver for merges, rebases and cherry-picks.
- **Find any commit.** ⌘K searches the whole history with `author:`, `path:`, `content:`, `regex:` and date filters. File history and blame are one shortcut away.
- **Stack branches, manage remotes and submodules.** *Restack* and *Push stack* keep a stack in order; worktrees show their agent, branch and changes.
- **Use your own AI tools.** Commit messages, explanations and conflict suggestions run through the agent CLI already on your computer (Claude Code, Codex, Gemini CLI, Cursor). No API key, nothing sent to Nori, and every action can be switched off.

With Pro:

- **Review pull requests without the browser.** Create, review and merge pull and merge requests on GitHub, GitLab, Gitea, Forgejo, Bitbucket Cloud and Azure DevOps, with threads, approvals and stacked requests.
- **Follow and control CI.** Read a job's log, re-run or cancel it, start a workflow, approve a deployment.
- **Work on issues.** Create, comment, label and assign on the same forges except Bitbucket, then *Start work* on a branch named after the issue.
- **Get notified.** System notifications for a review asked of you, your checks, an assigned issue or a new comment.

## Fast, because it is native

On a Mac with an Apple M4 Pro, Nori 1.14.0 held 72 to 76 MB at rest with
git/git or microsoft/vscode open, and loaded them in 0.8 s and 1.1 s. It is
49 MB installed. The method and the figures for Fork, Sublime Merge,
Sourcetree, GitKraken and GitHub Desktop are on
[the comparison page](https://meetnori.app/compare).

## Requirements

- **Mac:** macOS 26 or later, on Apple silicon
- **Windows:** Windows 10 or 11, x64
- **Linux:** x86-64, with Ubuntu 22.04 or Debian 12 and newer, or a current Fedora
- **Git 2.30 or later**, on every system: Nori uses the `git` already installed and bundles none

## Installing

Download Nori from [meetnori.app](https://meetnori.app/download), or pick the
file for your system from the [latest release](https://github.com/quentinhermiteau/Nori-releases/releases/latest):

| System | File |
| --- | --- |
| Mac | `Nori-arm64.dmg`: open it and drag `Nori.app` to Applications |
| Windows | `Nori_<version>_x64-setup.exe` |
| Ubuntu, Debian | `Nori_<version>_amd64.deb` |
| Fedora, openSUSE | `Nori-<version>-1.x86_64.rpm` |
| Other Linux | `Nori_<version>_amd64.AppImage` |

The Mac app is signed and notarized by Apple. The Windows installer is not
signed yet: if SmartScreen warns on the first run, choose **More info ▸ Run
anyway**. Every build then updates itself from this repository.

## Pricing

Nori is free, and the free app never expires. Pro, for pull requests and
issues, is US$20 once for two devices, any mix of Mac, Windows and Linux,
with every update included. Try it free for 14 days from the app, no card
needed. See [pricing](https://meetnori.app/pricing).

## Privacy

The app has no telemetry, analytics or crash reporting, and needs no account.
Your code goes only to the Git remotes, forges and AI tools you choose, under
your own accounts. See the [privacy policy](https://meetnori.app/privacy).

## Reporting an issue

Use **Report an Issue** in Nori (the Help menu on Mac), or
[open an issue](https://github.com/quentinhermiteau/Nori-releases/issues/new) here.

## About this repository

This repository distributes Nori's release installers for macOS, Windows and
Linux, their release notes and the signed update feeds (`appcast.xml` for the
Mac, `desktop/releases.json` for Windows and Linux). The Nori source code is
maintained separately and is not published here.
