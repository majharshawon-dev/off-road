# Off Road

A motorcycle log that runs in Chrome and installs on your phone like an app:
live GPS ride tracking, Google Timeline import, mileage (km/L), refuels, fuel left and range,
bike costs, and monthly and yearly reports in ৳ and km.

## Put it on GitHub Pages (no coding, about 5 minutes)

1. Sign in at **github.com** and click **New repository**.
   - Name: `off-road`
   - Visibility: **Public** (free accounts need a public repository for Pages; your ride data is *not* in it, see below)
   - Click **Create repository**.
2. On the new repository page, click **uploading an existing file**.
3. Drag in **everything from this folder**: `index.html`, `manifest.webmanifest`, `sw.js`, `README.md` and the whole `icons` folder. Click **Commit changes**.
4. Open **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**, then **Save**.
5. Wait 1 to 2 minutes and refresh that page. Your link appears at the top:
   `https://YOUR-USERNAME.github.io/off-road/`

## Install it on your phone

1. Open the link in **Chrome** on your phone.
2. Tap **⋮ → Add to Home screen → Install**. (Or Settings in the app → *Install Off Road on this phone*.)
3. Open it from the home-screen icon. It runs full-screen and works offline.
4. Tap **Start ride**. Chrome asks for location the first time; choose **Allow**.

## Move your data from the Claude version

In the Claude version: **Settings (top right) → Backup (.json)**.
In the new app: **Settings → Restore from a backup** and pick that file.

## Things to know

- **Your data lives on your phone**, in Chrome's storage for this site. Nothing is uploaded to GitHub. Clearing Chrome's site data or uninstalling deletes it, so use **Settings → Backup (.json)** now and then and keep the file in Google Drive.
- **Keep the screen on while tracking a ride.** Phone browsers pause GPS for web apps when the screen locks or you switch apps. The app keeps the screen awake while recording. If the app gets closed mid-ride, the next time you open it you can **Save** or **Continue** the unfinished ride.
- **Google Timeline:** in Google Maps on your phone go to **Settings → Personal content → Export Timeline data**, then in the app go to **Rides → Import Google Timeline**.

## Updating the app later

Upload the new files over the old ones (same names), then open `sw.js` on GitHub, change `off-road-v1` to `off-road-v2`, and commit. Phones pick up the new version the next time the app is opened with internet.
