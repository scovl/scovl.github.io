+++
title = "#100DaysOfCode"
description = "100DaysOfCode with Golang"
date = 2019-07-19T18:30:33-03:00
tags = ["golang"]
draft = true
weight = 1
+++

Hello everybody!

<p align="center">
  <img width="250" height="250" src="../images/golang/gopher.png">
</p>

For some time I have been looking for some motivation to start programming in Golang. But why Golang? Golang allows me to focus on solving problems without so much difficulty understanding what is encoded. Golang is simple, performative and powerful. I currently work with Shellscript and Python (which are also fantastic languages). 

Taking advantage of Twitter's hashtag **[#100DaysOfCode](https://twitter.com/hashtag/100DaysOfCode?src=hashtag_click)**, I decided to participate in this stream independently. I say independent because originally this proposal follows a roadmap proposed by **[freeCodeCamp](https://www.freecodecamp.org/news/join-the-100daysofcode-556ddb4579e4/)**. At the bottom of this article, I will leave the references I used to this challenge that proposes me to do.

For various reasons I couldn't post all my routine day after day in these hundred days. However, this was not an impediment for me. This article synthesizes this whole experience. Both official documentation and any book that teaches the basics of Go, one of the first steps is to install it. In this case, I decided to automate Golang installation and upgrade with shellscript below:

> Oh! I would like to apologize at the outset because my English is still evolving!

```bash
#! /bin/bash

# Download latest Golang release for AMD64

set -euf -o pipefail

#Download Latest Go
echo -e "\n Finding latest version of Go for AMD64... \n"
_GOurl="$(wget -qO- https://golang.org/dl/ | grep -oP 'https:\/\/dl\.google\.com\/go\/go([0-9\.]+)\.linux-amd64\.tar\.gz' | head -n 1 )"
latest="$(echo $_GOurl | grep -oP 'go[0-9\.]+' | grep -oP '[0-9\.]+' | head -c -2 )"
echo -e "\n Downloading latest Go for AMD64: ${latest} \n"

wget -c "${_GOurl}"

# Remove vars
unset _GOurl

# Remove Old Go
echo -e "\n Removing the old version \n"
sudo rm -rf /usr/local/go

# Install new Go
sudo tar -C /usr/local -xzf go"${latest}".linux-amd64.tar.gz
mkdir -p ~/go/{bin,pkg,src}
echo -e "\n Setting up GOPATH \n"
echo -e "\n export GOPATH=~/go \n" >> ~/.profile && source ~/.profile
echo -e "\n Setting PATH to include golang binaries \n"
echo -e "\n export PATH='$PATH':/usr/local/go/bin:$GOPATH/bin \n" >> ~/.profile && source ~/.profile
echo -e "\n Installing dep for dependency management \n"
go get -u github.com/golang/dep/cmd/dep

# Remove Download
echo -e "\nRemoving junk file\n"
rm go"${latest}".linux-amd64.tar.gz

# Print Go Version
echo -e "\n Check GO version \n"
/usr/local/go/bin/go version

```

A practical way to use it:

```bash
curl -s https://raw.githubusercontent.com/lobocode/gotools/master/goinstall/goinstall.sh | bash
```

After configuring the golang workspace, to create the first project it's recommended to use the `go mod init projectName` command. However, I would like Golang to create a default folder structure (src, pkg, vendor, bin, etc.). There are some projects with this proposal on the web, such as **[https://flaviocopes.com/go-filesystem-structure/](https://flaviocopes.com/go-filesystem-structure/)**. Then, I decided to create an even simpler solution with shellscript:

Put this into the your `~/.bashrc` or `~/.zshrc`:

```bash
# Create go project
goproject () { mkdir -p $1/{src,bin,pkg,vendor} && touch $1/main.go }
```

Now use this command anywhere:
```bash
$ goproject projectName
```

> Everything I did above may be useless. Surely I will find this out later.

---

Before I begin, I would like to describe my work environment. I'm using a Thinkpad e470 with Linux (CentOs) and VIM. Vim is quite powerful by default. Then I added **[some plugins to make my life easier](https://github.com/lobocode/vimfiles)**. To try my customization, follow the steps below:

```bash
$ git clone https://github.com/lobocode/vimfiles
$ cp vimfiles/.vimrc ~/

# Then, execute vim or neovim
$ vim
```

It’s of utmost importance that the work environment is pleasant and comfortable. Particularly I like quiet, clean environments, and the weather is slightly cold. Sometimes I also like to go to an airier outdoor environment to write. If possBoth official documentation and any book that teaches the basics of Go, one of the first steps is to install it. In this case, I decided to automate Golang installation and upgrade with shellscript below.
<p align="center">
  <img width="250" height="250" src="../images/golang/coffee.png">
</p>

With a strong coffee and a **[good Pomodoro](https://tomato-timer.com/)** to help you focus. Within open source projects, I often pay close attention to the official documentation. When official documentation is not of good quality, it becomes a reason to contribute to better documentation in the community. In Golang's case, the documentation is very good! Therefore, I strongly recommend studying the official documentation extensively.

For this challenge I decided to organize and map my study plan. To illustrate how I did this, I will outline the walkthrough of my study roadmap:

<p align="center">
  <img width="250" height="250" src="../images/golang/golang-roadmap1.svg">
</p>


The **[devdocs.io/go/](https://devdocs.io/go/)** is very good for consulting the official documentation. With the environment ready, let's go to the projects started and some completed during the challenge:

# :: My personal blog

This blog was written in Golang with the **[HUGO](https://gohugo.io/)** web framework. Hugo has a short learning curve which makes it quite simple to learn and understand. But don't confuse simple with bad. It is an excellent web platform.

---

# :: Saitama

<p align="center">
  <img width="250" height="250" src="https://raw.githubusercontent.com/lobocode/saitama/master/img/saitama.png">
</p>

**[Saitama](https://github.com/lobocode/saitama)** - This was the second project I started writing in Golang, not yet well aware of its structure. That is, certainly there are many problems in this code (although functional).
Within open source projects, I often pay close attention to the official documentation. When official documentation is not of good quality, it becomes a reason to contribute to better documentation in the community. In Golang's case, the documentation is very good! Therefore, I strongly recommend studying the official documentation extensively.

---

# :: JumboPG

<p align="center">
  <img width="250" height="250" src="../images/golang/jumbopg.png">
</p>

**[JumboPG](https://github.com/lobocode/jumbopg)** - JumboPG is my third project written in Golang. JumboPG is a tool that assists in configuring postgresql (based in **[pgtune](https://github.com/gregs1104/pgtune)**). 

In the JumboPG project I had the challenge of building a basic frontEnd and putting together a coherent logic behind it. Also, to differentiate from the original proposal, this tool configures postgresql.conf by both web interface and command line interface.

From JumboPG I felt the need to go deeper into the language because I had a lot of difficulty in performing several steps. Thinking about it, I decided to try to understand how the community develops some technologies. That's when I decided to collaborate with the **[Gitea](https://github.com/go-gitea/gitea)** project. Gitea is a community managed lightweight code hosting solution written in Go.

<p align="center">
  <img width="150" height="150" src="../images/golang/gitea.png">
</p>

# :: Knowledge Base System

This system I began to develop to meet an internal need where I currently work. I based myself on the stackoverflow idea.


---

These were the books I used to study Golang:

1. **[Head First Go](https://www.amazon.com.br/Head-First-Go-Jay-Mcgavren/dp/1491969555)** - This is a fun and very interesting book to start.
2. **[Go in Action](https://www.manning.com/liveaudio/go-in-action)** - This book is just amazing!
3. **[Go in Practice: Includes 70 Techniques](https://www.amazon.com/Go-Practice-Techniques-Matt-Butcher/dp/1633430073)** - This book is amazing. I also recommend it.
4. **[Pragmatic Guide to Git](https://pragprog.com/book/pg_git/pragmatic-guide-to-git)** - I needed to reinforce some concepts about git, gitflow and best practices. So this book helped a lot.
5. **[Pratical Vim](https://pragprog.com/book/dnvim/practical-vim)** - For those who have come and\or want to learn Vim, is a good read. 
