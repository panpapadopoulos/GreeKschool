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

In order: News & Announcements (shown only when there is a current announcement), About, What Our Students Learn, Learning Resources, Registration & Tuition, School Calendar, Documents & Forms, Photos, Contact (with map), and the footer.

## How the site works

The site is plain HTML, CSS and JavaScript. GitHub Pages builds it with Jekyll automatically, so there is no build step to run and no server code.

- `index.html` is the page template. It reads its content from the YAML files in `_data/`.
- Content is edited in **[Pages CMS](https://app.pagescms.org)**. Each save is a commit to `main`, and GitHub Pages republishes the site in 1–2 minutes.
- Some content depends on the date: announcement publish and expiry dates, the "next event" marker, the registration badge, and the seasonal schedule. These are checked in the visitor's browser, so they change on the right day without a rebuild.

```
index.html                   Page template (Jekyll/Liquid)
_config.yml                  Jekyll settings (site URL, excluded files)
.pages.yml                   Pages CMS configuration (editing forms)
_data/
  announcements.yml          News & announcements
  events.yml                 School calendar events
  registration.yml           Registration status, tuition, steps, form PDF
  documents.yml              Documents & Forms library
  gallery.yml                Photo gallery (order, captions, approval)
  school.yml                 School information, contact, descriptions
  season.yml                 Seasonal theme settings and schedule
assets/
  css/site.css               Styles
  js/site.js                 Menu, gallery viewer, date-based content
  js/seasonal.js             Seasonal themes and snow/leaf/petal effects
  uploads/                   Images uploaded through the CMS
  documents/                 PDFs uploaded through the CMS
images/                      Logos, hero photo, original gallery photos
academic-calendar-2026-2027.pdf, registration-form.pdf   Original PDFs
.github/workflows/optimize-images.yml   Resizes CMS photo uploads, strips EXIF/GPS
scripts/optimize_images.py   Used by the workflow above
docs/ADMIN-GUIDE.md          How-to guide for the school director
```

`images/Photos/` holds local full-size copies and is not committed (see `.gitignore`).

## Content editing (Pages CMS)

### One-time setup

1. Sign in at **https://app.pagescms.org** with the GitHub account that owns this repository.
2. When asked, install the **Pages CMS GitHub App** and grant it access to **only** the `GreeKschool` repository.
3. Open the repository and choose the `main` branch. The editing sections from `.pages.yml` appear.
4. To add school staff, use the collaborator settings in Pages CMS and invite them by email. They do not need a GitHub account. They can edit content and media, but not the configuration.

### Security

- Visitors never see any editing tools. Editing happens only on app.pagescms.org, after signing in.
- No tokens or passwords are stored in this repository or on the website. Pages CMS uses the GitHub App's short-lived tokens on its own servers.
- Access can be removed at any time. Remove a collaborator in Pages CMS, or uninstall the app under GitHub → Settings → Applications.

Staff instructions are in **[docs/ADMIN-GUIDE.md](docs/ADMIN-GUIDE.md)**.

### Previewing locally

```
docker run --rm -p 4000:4000 -v "$PWD:/site" -w /site ruby:3.3   bash -c "gem install github-pages webrick && jekyll serve --host 0.0.0.0"
```

Add `?season=christmas` (or `autumn`, `independence`, `oxi`, `easter`, `backtoschool`) to the address to preview a seasonal theme.

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
