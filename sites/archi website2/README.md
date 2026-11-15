# Decode interior design concept

React + Vite + GSAP recreation of https://korda.framer.media/, with Decode branding, replacement stock photography/video, wider Services, and the requested larger desktop hero composition.

## Run

From this folder, with the workspace dependencies available:

```powershell
node ..\..\node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5178
```

Open http://127.0.0.1:5178. Run in the foreground and use Ctrl+C when finished.

```powershell
node verify.mjs
node ..\..\node_modules\vite\bin\vite.js build
```

## Coverage

19 routes: home, projects, articles, about, nine project details, six article details. Forms are explicitly local demonstrations and send nothing. Stock photography depicts concept spaces and people; see ASSET-CREDITS.md. Original reference fonts are retained; displayed photos and videos are replaced.

See reference/QA.md for browser observations, intentional differences, and verification limitations.
