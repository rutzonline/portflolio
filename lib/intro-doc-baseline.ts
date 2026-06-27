/** Polaroid shown to the left of the readme window (not inside it). */
export const INTRO_README_POLAROID_PATH = "/readme-polaroid.png";
/** Bump when replacing readme-polaroid.png so browsers pick up the new file. */
export const INTRO_README_POLAROID_VERSION = "15";

export type IntroReadmeTabId = "about" | "the-site" | "about-the-site";

export interface IntroReadmeTab {
  id: IntroReadmeTabId;
  label: string;
  content: string;
}

/**
 * Readme tab content — edit labels and copy here.
 *
 * Formatting in `content` strings (Markdown):
 * - **bold** and _italic_
 * - > blockquote for callouts
 * - blank line between paragraphs
 * - --- or ───── for a horizontal rule
 * - - bullet lists (sitemap tab)
 * - emojis: paste unicode directly (e.g. ✨ 💙)
 * - polaroid: public/readme-polaroid.png — floats left of the readme window (about tab only)
 */
export const INTRO_README_TABS: IntroReadmeTab[] = [
  {
    id: "about",
    label: "about",
    content: `
>>
**hi, i'm rutuja**

ever since i was a little girl i knew i wanted to have a website of my own to attract pre-pmf fable (rip) 5-coded b2b disruptive ai saas stanford dropout startup founders in the valley in order to revenuemaxx so they can continue posting about some 'day 4752831 of building [highkey another llm wrapper].ai' on x. 

ok, that's a stretch. but you might look around and go, "what the fork does this person actually do?"

marketing & growth. that's the job.

more specifically, 

- i'm a marketing generalist with a love for storytelling.  
- i've worked on all things content & creative across platforms (social, email, ads, offline etc.)
- i've worked from strategy to execution, and have built 0-1 growth systems from scratch.
- i have been a part of early stage growth teams across d2c f&b, fintech and b2b saas.

also a semi-profesh vibe coder and ai curious person. hoping this website acts as a testament to that.

that's about the work. as for the details and site navigation, we'll get to that in the next tab.

contrary to popular belief, i am not a yapper irl so consider this website an extensive documentation of me and my work. (and no, i don't send this link to my dates... that's weird)

in case you were wondering... my favorite color is #0c121f`,
  },
  {
    id: "the-site",
    label: "the site",
    content: `anyway, here is a quick tour so you know exactly what you're looking at
------------

---------------

so first up, the dock as it appears: 

- **finder**, where you can browse the files and projects i've worked on.

- **notes**, which is a true reflection of me and my very intellectual thoughts.

- **messages**, a sample of how i write and communicate — curated threads, not private DMs.

- **photos**, you'll find a video introduction of me, along with a few pictures.

- **resume**, where you'll find my work timeline, skills, educations, yada yada.

- the **calendar** like icon? that's where you'll find a log of things i've read, watched, listened to, etc.

- what is **misc**? well, it's kinda like a curation of all things marketing that i loveee.

- **settings**, where you can change the appearance of the site and other settings.

finally, there's **trash**... you know? for the trash files...

- on the desktop, you'll find a sticky note that you can use to take notes while you're here 

- and also listentome with covers of the songs i've listened to lately.

- oh and there's also the **notification center**, where you'll find the widgets to help you navigate.

that's about it. 

to know more about the site build, check out the next tab.`,
  },
  {
    id: "about-the-site",
    label: "about the site",
    content: `
    

**technical stack**

-  framework - next.js 15 
-  language - typescript 
-  database - supabase 
-  animations - framer motion 
-  deployment - vercel 
-  logic & labor - cursor & claude 
-------

- a massive thank you to apple and alana for the solid architecture that made this project possible.
- design language: inspired by apple's sierra macOS.
- built with: littlebird (context-aware logic), claude (structural architecture), and cursor/vs code.
- couldn't have done it without the girls - canva, pinterest and spotify :)
- putting it all together with github and vercel <3
`,
  },
];

/** Legacy single-string baseline (tabs joined) for Finder / storage compatibility. */
export const INTRO_DOC_BASELINE = INTRO_README_TABS.map((tab) => tab.content).join("\n\n---\n\n");
