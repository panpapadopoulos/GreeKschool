# St. George Greek School Website

The website of the **St. George Greek School** (Ελληνικό Σχολείο Αγίου Γεωργίου) of St. George Greek Orthodox Church in Schererville, Indiana.

It is a single, static page with no build step and no server code. Open `index.html` in a browser to view it.

## School information

| | |
|---|---|
| **Program** | Greek language, culture and faith, Kindergarten through 6th grade level |
| **Classes** | Tuesday evenings, 6:00 – 7:45 pm, September – May |
| **2026–27 school year** | September 15, 2026 – May 18, 2027 |
| **Director** | Dr. Angela Fauth, [greekschool@stgeorgenwi.org](mailto:greekschool@stgeorgenwi.org) |
| **Address** | 528 West 77th Avenue, Schererville, Indiana 46375 |
| **Church office** | (219) 322-6165 |
| **Church website** | [stgeorgenwi.org](https://stgeorgenwi.org) |
| **Tuition payment** | [Square online payment](https://stgeorgedonation.square.site/product/greek-school-tuition/15?cs=true&cst=custom) |

## Page sections

In order: News & Announcements (shown only when there is a current announcement), About, What Our Students Learn, Learning Resources, Registration & Tuition, School Calendar (interactive month/week/year calendar and the academic calendar list with PDF), Documents & Forms, Photos, Contact (with map), and the footer.

## How the site works

The site is plain HTML, CSS and JavaScript. GitHub Pages builds it with Jekyll automatically, so there is no build step to run and no server code.

- `index.html` is the page template. It reads its content from the YAML files in `_data/`.
- Content is edited in **[Pages CMS](https://app.pagescms.org)**. Each save is a commit to `main`, and GitHub Pages republishes the site in 1–2 minutes.
- **One source of truth for dates.** The interactive calendar, the "Coming up" boxes and the Academic calendar list all read the same data files.
- **Dates are calendar dates** (`YYYY-MM-DD`) in **America/Chicago**. "Today" is always worked out for Schererville, whatever the visitor's time zone. Dates are compared as whole days, never as times, so nothing shifts at midnight or when daylight saving time starts or ends.
- **Testing a date:** add `?date=YYYY-MM-DD` to the address to see the site as it will look on that day. This affects only your own browser.

```
index.html                   Page template (Jekyll/Liquid)
_config.yml                  Jekyll settings (site URL, excluded files)
.pages.yml                   Pages CMS configuration (editing forms, upload rules)
_data/
  announcements.yml          News & announcements
  calendar.yml               Calendar settings + academic calendar PDF
  class_schedule.yml         Regular classes (weekdays between a first and last day)
  closures.yml               No-class days (override classes) and extra classes
  events.yml                 Programs, feasts, celebrations, meetings, trips
  deadlines.yml              Deadlines
  registration.yml           Registration status, tuition, steps, form
  documents.yml              Documents & Forms library
  gallery.yml                Photo gallery (order, captions, show/hide)
  school.yml                 School information, contact, descriptions
  season.yml                 Seasonal theme settings and schedule
assets/
  css/site.css               Styles
  js/site.js                 Menu, gallery viewer, announcements, "today" in Chicago
  js/calendar.js             Interactive calendar (month/week/year) + Coming up
  js/seasonal.js             Seasonal presets, SVG decorations, particle effects, preview panel
  uploads/                   Images uploaded through the CMS (public)
  documents/                 Documents uploaded through the CMS (public)
.github/workflows/
  optimize-images.yml        Resizes CMS photo uploads, strips EXIF/GPS
  check-uploads.yml          Fails if a non-allowed file type appears in the upload folders
docs/ADMIN-GUIDE.md          How-to guide for the school director
```

## Content editing (Pages CMS)

### One-time setup

1. Sign in at **https://app.pagescms.org** with the GitHub account that owns this repository.
2. Install the **Pages CMS GitHub App**. When GitHub asks, choose **Only select repositories** and pick `GreeKschool` only.
3. Open the repository on the `main` branch.
4. To add school staff, use **Collaborators** in Pages CMS and invite them by email. They do not need a GitHub account.

### Security (checked against the Pages CMS docs and source code, November 2026)

**Sign-in**
- Collaborators sign in with a 6-digit code sent to their email, valid for 5 minutes.
- GitHub users sign in with GitHub.

**What collaborators can do**
- They can edit content and upload media in the repository they were invited to.
- They cannot change `.pages.yml`, manage collaborators or use admin features.
- Their access covers the whole repository. Pages CMS cannot yet limit a collaborator to one branch.

**Commits**
- Every save is a direct commit to `main` and is published within about 2 minutes.
- `.pages.yml` sets `commit.identity: user`, so each commit records the editor's name and email.

**GitHub App permissions**
- The Pages CMS app requests Contents (read/write), Administration (read/write), Actions (read/write), Checks, Statuses, Metadata (read) and Email addresses (read). This is more than editing needs, and the hosted app's permissions cannot be reduced.
- Mitigation: install it on this one repository only.
- For full control of the permissions, Pages CMS can be self-hosted. That means running a server, so it is not recommended here.

**Credentials**
- No tokens or passwords are stored in this repository or on the website.
- Pages CMS keeps GitHub tokens on its own servers.

**Uploads**
- Pages CMS enforces the file types listed in `.pages.yml` on its server, and uploads can only go into `assets/uploads` and `assets/documents`.
- Allowed images: jpg, jpeg, png, webp. SVG is excluded because it can contain scripts.
- Allowed documents: pdf, docx, xlsx.
- `check-uploads.yml` flags anything else that appears in those folders.

**Revoking access**
- Remove a collaborator in Pages CMS → Collaborators.
- Or uninstall the app under GitHub → Settings → Applications → Installed GitHub Apps.
- To remove a person's GitHub access, remove them under the repository's Settings → Collaborators.

### Publishing workflow options

Pages CMS has **no built-in review or approval step**: it commits directly to the branch being edited. The options are:

1. **Publish directly** (current setup). Simple and immediate. Any mistake can be undone from the Git history.
2. **Draft branch + approval.** Editors work on a `drafts` branch in Pages CMS. You open a pull request from `drafts` to `main` on GitHub and merge it after review.
   - To make this binding, add a GitHub rule on `main` that requires pull requests. Without that rule it is only a convention, because collaborators can still choose `main`.
   - Cost: every change waits for you, and the director needs to see previews (for example, a second GitHub Pages site or a preview host for `drafts`).

### Privacy and Git history

- The repository and the website are **public**. Every uploaded file is publicly reachable, whether or not the gallery shows it.
- A deleted file **remains in the Git history**. Removing it completely needs a history rewrite, which changes every later commit.
- Photos are optimised after they are committed, so the **original file stays in the history**, location data included. Upload only approved, blurred photos, with location turned off.
- `images/Photos/` was committed before it was added to `.gitignore`. It is no longer tracked, but the old copies (blurred, 1600 px) remain in the history.

### Previewing locally

```
docker run --rm -p 4000:4000 -v "$PWD:/site" -w /site ruby:3.3   bash -c "gem install github-pages webrick && jekyll serve --host 0.0.0.0"
```

Add `?season=christmas` (any occasion name from the admin guide) to the address to preview a seasonal theme. A preview panel also lets you try `anim`, `intensity`, `show` and `deco`.

## Updating the site

Use Pages CMS for everyday changes (see the guide). Code changes, such as layout and styles, are made in `index.html` and `assets/`.

- **Accessibility widget.** Replace `YOUR_USERWAY_ACCOUNT_ID` near the bottom of `index.html` with the account ID from [userway.org](https://userway.org). The widget does not load until this is set.

## Hosting

GitHub Pages serves the site from the `main` branch with the custom domain in `CNAME`. Pages must stay in **Deploy from a branch** mode, which builds with Jekyll. Do not add a `.nojekyll` file.

## Permissions and credits

- **Content.** © St. George Greek Orthodox Church, Schererville, Indiana. All rights reserved. The text, photos, school seal and documents may not be reused without permission from the church.
- **Photos of students.** Children's faces are blurred before publishing. Publish only photos of students whose parents or guardians have given consent. Remove any photo promptly if a family asks. Do not add names or other identifying details to photos.
- **Logos.**
  - The St. George Greek School seal and the St. George church logo belong to the parish.
  - The Metropolis of Chicago emblem belongs to the Greek Orthodox Metropolis of Chicago and is shown only to identify the parish's affiliation. It links to [chicago.goarch.org](https://chicago.goarch.org/).
- **Learning resources.** Greek123 and Ellinopoula are named and linked as the programs used in class. Their names belong to their respective owners, and the school has no other affiliation with them.
- **Third-party services.**
  - Fonts: [Google Fonts](https://fonts.google.com) (Libre Baskerville and Open Sans, SIL Open Font License).
  - Map: Google Maps embed.
  - Accessibility widget: [UserWay](https://userway.org), subject to UserWay's terms.
  - Payments: handled entirely by Square on the church's Square site. No payment or personal data is collected by this website.
