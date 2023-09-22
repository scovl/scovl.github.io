+++
title = "FreeBSD"
description = "FreeBSD for developers"
date = 2023-06-01T17:31:45-03:00
tags = ["freebsd"]
draft = true
weight = 1
author = "Vitor Lobo Ramos"
+++


# Table of Contents

* **[DEMYSTIFYING FREEBSD FOR DEVELOPERS](#demystifying-freebsd-for-developers)**
* **[SPEAKING YOUR LANGUAGE](#speaking-your-language)**
* **[SETTING UP YOUR DEV ENVIRONMENT](#setting-up-your-dev-environment)**
* **[THE ULTIMATE DEV TOOLS](#the-ultimate-dev-tools)**
* **[CONTAINERS AND VIRTUALIZATION](#containers-and-virtualization)**
* **[FREEBSD COMMUNITY](#freebsd-community)**
* **[CONCLUSION](#conclusion)**

## Demystifying FreeBSD for Developers

Every time someone drops the name FreeBSD, your mind automatically drifts to servers and Network-Attached Storage (NAS). But guess what? That's only one side of the story. FreeBSD is a robust OS, capable of meeting the needs of everyone - from system admins to, yes, software developers. Time to shatter those myths and see why FreeBSD could be your next dev playground!

## Speaking your language

Alright, first things first: Can FreeBSD undestand and work with yourt favorite programming language? The answer is a big YES!

* Mainstream Web dev? No worries! Node.js, PHP, Python... - they're got you.
* Low-level programming? C, C++, Rust, Go, Java, you name it!
* Old-school charm? clang, gcc, Java thought OpenJDK, or even C# through Mono, all available.

And here's the sweet: the native FreeBSD package manager `pkg`, often lets you install the needed compiler. Like, want pygame for Python? Just punch in:

```bash
pkg install py{27,36}-game
```

Or, if you prefer, you can use it like this: 

```bash
pkg ins -y py{27,36}-game
```

## Setting up your dev environment

Nope, Unix isn't just about vim and emacs (althought they're awesome and totally available). FreeBSD has got your back with modern IDEs. Try it:

```bash
pkg search editors/
```

And boom! It's yours.

Worried your IDE doesn’t jive with FreeBSD? The Linuxulator, a Linux compatibility layer in FreeBSD, might help. Version control? All your faves are here. FreeBSD is deeply committed to the security of its applications. When installing packages, FreeBSD provides a clear summary of the actions that will be taken, ensuring you're always informed. Additionally, the OS often releases security advisories pertaining to software packages. Always ensure you're using the latest and most secure versions by regularly updating your package repository and software. 

## The Ultimate Dev Tools

FreeBSD has a lot of tools to make your life easier. Here are some of my favorites:

* `DTrace` - If you haven't used it, you're missing out. This dynamic tracing framework lets you visualize and analyze your software in real-time. Imagine identifying bottlenecks in your PostgreSQL database or seeing the most frequent code paths with flame graphs (Shoutout to Brendan Gregg’s scripts!). And all of this without stopping or recompiling your software. Below how to use:

```bash
dtrace -n 'syscall:::entry { @[execname] = count(); }'
```

* `procstat` - Amazing for process info.
* `ktrace/kdump` - Like strace, but better.
* `pmccontrol and pmcstat` - For performance analysis.

## Containers and Virtualization

## FreeBSD Community

## Conclusion













