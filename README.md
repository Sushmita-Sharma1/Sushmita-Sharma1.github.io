# Sushmita Sharma — Data Analyst Portfolio

A static portfolio site with a small in-browser admin panel. No framework, no build step,
no runtime dependencies: plain HTML, CSS and JavaScript, hosted on GitHub Pages.

## Structure

```text
index.html, about.html, work.html, work-detail.html, blog.html, blog-post.html   public pages
admin.html      admin panel (sign in, then connect to GitHub or a local file)
setup.html      one-time generator for the admin login (data/auth.js)
favicon.svg, robots.txt, sitemap.xml

css/   style.css (design tokens + shared UI), home.css, about.css, detail.css, admin.css
js/    app.js      content store, escaping, URL safety, markdown, cards  (window.App)
       home.js     home page grid + starts the scroll story
       story.js    scroll-driven dot animation (transform-based)
       list.js     work / blog list pages
       detail.js   case-study and blog-post pages
       auth.js     PBKDF2 hashing used by admin sign-in and setup
       setup.js    credential generator page
       admin.js    the admin panel
data/  content.js  ALL case studies and blog posts (edited by the admin panel)
       auth.js     admin username + salted password hash
media/ docs/ images/ videos/   files attached to entries
```

## How content works

Everything on the site comes from `data/content.js`. The admin panel edits that file and
saves it either to GitHub (a commit) or to a local copy. GitHub Pages then republishes
the site — allow about a minute.

## Using the admin panel

1. Open `admin.html` and sign in.
2. Choose **one** way to save:
   - **GitHub** — enter the site URL (e.g. `https://yourname.github.io/` or
     `https://yourname.github.io/portfolio`) and a fine-grained access token limited to
     this repository with **Contents: Read and write**. The panel works out the repository
     and branch itself. If your site files sit inside a folder of the repository
     (for example the repo contains a `Portfolio/` folder), type that folder name in the
     folder box.
   - **Local file** (Chrome / Edge) — click *Use a local file instead* and pick
     `data/content.js`.
3. Add, edit or delete entries. Uploaded images, documents and videos go to `media/`.

### If connecting fails

| Message | Fix |
| --- | --- |
| `content.js was not found. Tried: …` | Wrong repo, branch, or folder. Fill the **folder** box if the site lives in a sub-folder. A private repo also reads as "not found" when the token cannot see it. |
| `GitHub rejected the access token` | Token is wrong, expired or revoked. Create a new one. |
| `The token is not allowed to do this` | Give the token access to this repository with Contents = Read and write. |
| `file changed since you connected` | Click **Disconnect**, connect again, repeat the change. |

## Performance notes

- No web fonts and no third-party requests: pages use the system font stack.
- Scripts are `defer`red; the about page no longer loads the content store.
- The home-page animation moves dots with `transform`, so it never forces layout.
- Keep videos small: re-encode with `ffmpeg -i in.mp4 -c:v libx264 -crf 30 -preset slow -c:a aac -b:a 64k -movflags +faststart out.mp4`.
  `faststart` lets playback begin before the whole file has downloaded.

## Security notes (read this)

- The admin sign-in is a **convenience gate, not real security**. `data/auth.js` is public
  (it is served with the site), so anyone can download the salted hash and try to guess the
  password offline. Use a long passphrase. What actually protects your content is the
  **GitHub token**: nobody can change the site without it.
- The GitHub token is kept in `sessionStorage` only, and is removed on sign-out or when the
  tab is closed.
- All user-entered text is HTML-escaped before display, and every link/media URL is checked
  (`App.sanitizeUrl`): `javascript:`, `data:` and protocol-relative `//` URLs are rejected.
- The Content-Security-Policy `<meta>` tag on each page blocks inline scripts and third-party
  hosts. A meta tag cannot set `frame-ancestors` or `X-Frame-Options`; to prevent other sites
  framing yours you would need real HTTP headers (not available on GitHub Pages).
