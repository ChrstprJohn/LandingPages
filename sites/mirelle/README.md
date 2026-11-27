# decodestudio portfolio

Run `pnpm --filter mirelle dev --host localhost` from the workspace root. You can also start Vite directly with the installed workspace dependencies:

```powershell
node node_modules/vite/bin/vite.js sites/mirelle --host localhost --port 5191
node node_modules/vite/bin/vite.js build sites/mirelle
```

The site includes Home, About, Works and 18 fictional case studies. The founder, studio timeline and project names are concept copy. Contact details are reserved placeholders for the preview. Photography is stored locally and listed in the [photo credits](public/photo-credits.txt). Font licenses ship alongside the webfonts. The layout and interactions follow the [Mirelle reference](https://mirelle.framer.media/).

| Interaction | Observed behavior |
| --- | --- |
| Homepage load | Four square images appear in sequence on black. The black layer lifts as the final photo fades and the gallery fans out. A full refresh replays the loader. |
| Gallery | Wheel, horizontal drag and arrow keys rotate the seven cards. Tablet and phone layouts add previous and next buttons. The outgoing caption wipes upward and the new caption opens from the top. |
| Card and navigation hover | The photo scales inside its frame. Navigation characters roll upward in sequence and reverse on pointer-out. |
| Mobile menu | The dark panel opens below the four-dot toggle and staggers its links. The local menu also supports Escape and outside dismissal. |
| Works | Photos and their borders wipe down once about 80 pixels of the frame enter the viewport. The first four photos load eagerly so they can reveal on opening. Photos reach 130% on hover. Category changes fade outgoing cards and move retained cards into their new positions. |
| About | The theme crossfades around Experience and Services and reverses on upward scrolling. Experience rows open independently. The desktop services rail tracks vertical scroll. |
| Case studies | The title, intro, project facts and All Works link rise into view on black. The cover wipes in from the left after the text becomes readable. Summary words brighten during downward scrolling and dim as the user scrolls back. Story headings, photos and related cards have separate entrances. |
| Footer | The headline phrases roll out and in. Contact and social link letters roll upward on hover and focus. |
