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

The page has these sections, in order: About, What Our Students Learn, Learning Resources (Greek123 and Ellinopoula), Registration & Tuition, School Calendar, Photos, Contact (with map), and the footer.

## Files

```
index.html                        The whole website (HTML, CSS and JavaScript)
academic-calendar-2026-2027.pdf   Original academic calendar (linked from the Calendar section)
registration-form.pdf             Enrollment form (linked from the Registration section)
images/
  logo.png                        School seal, blue (browser tab icon)
  logo-color.png                  School seal, color (hero)
  logo-white.png                  School seal, white (header and footer)
  church-logo.png                 St. George church logo, white (footer)
  metropolis-logo.png             Metropolis of Chicago logo, white (footer)
  hero.jpg                        Church photo behind the hero
  gallery/photo-NN.jpg            Web-sized gallery photos (max 1600px)
  gallery/thumbs/photo-NN.jpg     Gallery thumbnails (max 700px)
  Photos/                         Full-size originals (not published, see .gitignore)
```

## Updating the site

All edits are made in `index.html`.

- **New school year.** Update the dates in the Registration section and the list in the Calendar section. Then replace `registration-form.pdf` and the calendar PDF, and update the PDF link if the file name changes.
- **Tuition.** Edit the prices in the Registration & Tuition section.
- **Photos.**
  1. Put the original in `images/Photos/`.
  2. Make a web copy (about 1600px wide) in `images/gallery/` and a thumbnail (about 700px) in `images/gallery/thumbs/`, both with the same file name.
  3. Add a line for the photo inside `<div class="gallery">` in `index.html`.

  The first 12 photos show by default, and lines with `class="more"` appear after "Show all". Update the photo count on the button.
- **Accessibility widget.** Replace `YOUR_USERWAY_ACCOUNT_ID` near the bottom of `index.html` with the account ID from [userway.org](https://userway.org).

## Hosting

Upload `index.html`, the two PDFs and the `images/` folder, without `images/Photos/`, to any static web host. Options include GitHub Pages, Netlify, or the church's existing web host.

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
