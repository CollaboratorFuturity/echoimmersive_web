# Getting Started — Immersive ECHO

Welcome to the project! This guide will get the website running on your computer step by step. You don't need any prior coding experience to follow it.

The whole process takes about 10–15 minutes, most of which is waiting for things to download.

---

## What you're installing and why

| Tool | What it is | Why you need it |
|------|-----------|-----------------|
| **Node.js** | A program that runs JavaScript on your computer | Powers the development server that lets you preview the site |
| **Git** | A tool for downloading and syncing code | Downloads the project from the shared repository |

You only do this setup once.

---

## Step 1 — Install Node.js

1. Go to **[nodejs.org](https://nodejs.org)**
2. Click the big **LTS** button (stands for "Long Term Support" — it's the stable version)
3. Run the installer and click through with all the default settings
4. When it's done, leave everything as-is and move to Step 2

---

## Step 2 — Install Git

1. Go to **[git-scm.com/downloads](https://git-scm.com/downloads)**
2. Download the version for your operating system (Mac or Windows)
3. Run the installer — all default settings are fine, just keep clicking Next/Continue

---

## Step 3 — Open your Terminal

The terminal is a text-based window where you type commands. It sounds scary but you'll only be typing a few things.

**On Mac:**
- Press `Cmd + Space`, type `Terminal`, press Enter

**On Windows:**
- Press the Windows key, type `cmd`, press Enter

---

## Step 4 — Download the project

Type this into the terminal and press Enter (replace the URL with the one you were given):

```
git clone https://github.com/CollaboratorFuturity/echoimmersive_web.git
```

Then navigate into the project folder:

```
cd echoimmersive_web
```

---

## Step 5 — Install project dependencies

This downloads all the code libraries the project needs. Type this and press Enter:

```
npm install
```

You'll see a lot of text scrolling by — that's normal. Wait for it to finish (it can take a minute or two).

---

## Step 6 — Start the development server

```
npm run dev
```

You'll see something like this:

```
  VITE  ready in 300ms

  ➜  Local:   http://localhost:5173/
```

---

## Step 7 — Open the site

Open your browser and go to:

**[http://localhost:5173](http://localhost:5173)**

The website is now running on your computer. Any changes you or a developer makes to the files will appear instantly in the browser without needing to refresh.

---

## Stopping the server

When you're done, go back to the terminal and press:

```
Ctrl + C
```

That stops the server. Next time you want to start it again, just open the terminal, navigate to the folder, and run `npm run dev` again.

---

## Starting again after closing the terminal

You don't need to run `npm install` again — just:

```
cd echoimmersive_web
npm run dev
```

---

## Getting the latest changes from the team

Whenever a developer tells you there are updates, run this before starting the server:

```
git pull
npm install
```

`git pull` downloads the latest version. `npm install` makes sure any new libraries are installed. Then `npm run dev` as usual.

---

## Something went wrong?

**The terminal says "command not found: npm"**
Node.js didn't install correctly. Go back to Step 1 and try the installer again, making sure to restart your computer after.

**The terminal says "command not found: git"**
Git didn't install correctly. Go back to Step 2.

**The browser says "This site can't be reached"**
The server isn't running. Make sure you ran `npm run dev` and the terminal is still open.

**Something else broke**
Don't panic. Screenshot the terminal and send it to the developer. Don't delete any files.
