# bibleexplorer

Personal Bible study tool. The current version is a self-contained static prototype for an interactive, verse-by-verse Isaiah commentary. The first pass implements Isaiah 1 and provides:

- KJV base text in a four-column verse layout.
- A per-verse alternate translation dropdown for NLT, The Living Bible, NRSV, Greek LXX lexical anchors, and Hebrew MT lexical anchors.
- Hover glosses for the included Greek and Hebrew word anchors.
- Links into Book of Mormon, Doctrine and Covenants, and Pearl of Great Price scripture pages where relevant.
- Links to related Church leader teaching and a clearly labeled “Temple theology lens” informed by the Margaret Barker conversation.
- Search, responsive layout, and source notes.

Open `index.html` in a browser. No build step is required.

## YouVersion integration

The `worker/` directory contains a Cloudflare Worker proxy for the YouVersion Platform API. It keeps the App Key out of the public GitHub Pages bundle. See [worker/README.md](worker/README.md) for deployment instructions.

## Content and translation note

The KJV is the base text for the prototype. NLT, The Living Bible, and NRSV are linked to licensed reading pages rather than reproduced in this repository. The Hebrew and Greek controls are compact lexical anchors for study, not a substitute for a critical edition or full morphological parsing.
