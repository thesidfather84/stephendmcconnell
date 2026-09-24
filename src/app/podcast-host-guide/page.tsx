import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

// Help page for the presenter (host). Not indexed by search engines.
export const metadata: Metadata = {
  title: "How to Create a Podcast Episode",
  robots: { index: false, follow: false },
};

const PILL = "inline-block rounded-full px-3 font-bold";
const Go = ({ children }: { children: ReactNode }) => (
  <span className={`${PILL} bg-medical text-white`}>{children}</span>
);
const Plain = ({ children }: { children: ReactNode }) => (
  <span className={`${PILL} bg-white text-navy ring-2 ring-inset ring-slate-500`}>{children}</span>
);
const Stop = ({ children }: { children: ReactNode }) => (
  <span className={`${PILL} bg-red-700 text-white`}>{children}</span>
);

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-300 bg-white p-5">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-medical text-2xl font-bold text-white">
          {n}
        </span>
        <h2 className="text-2xl font-bold text-navy">{title}</h2>
      </div>
      <div className="flex flex-col gap-3 text-lg text-slate-800">{children}</div>
    </section>
  );
}

const Tip = ({ children }: { children: ReactNode }) => (
  <p className="rounded-xl bg-amber-50 p-4 font-bold text-amber-900">{children}</p>
);

const FIXES: [string, string][] = [
  [
    "A red message appears above the buttons",
    "Read it. It says what went wrong. Fix that one thing, then press the same button again. Your recording is safe.",
  ],
  [
    "You pressed the wrong button, or you don’t like the recording",
    "Before publishing, press Start Over and then confirm. It deletes the recording so you can make a new one. After you press Publish Episode, Start Over does not delete it.",
  ],
  ["The studio asks for the code again", "It signs you out when the browser closes, and after 4 hours. Type the 4-digit code again."],
  ["Publish Episode is gray", "It turns on after the recording finishes saving and you have typed a title."],
  ["You hear an echo", "Use headphones. Only one microphone should be on."],
  ["A guest cannot get in", "Make a new guest link. Each link works for one person on one device."],
];

export default function PodcastHostGuidePage() {
  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">How to create a podcast episode</h1>
          <p className="text-xl text-slate-700">
            For the presenter. Do the steps in order. You use five buttons in the studio, and each one has a job.
          </p>
        </header>

        <section className="flex flex-col gap-3 rounded-2xl border-2 border-navy bg-white p-5 text-lg">
          <strong className="text-xl text-navy">The five buttons, in the order you use them</strong>
          <ol className="list-decimal space-y-2 pl-6">
            <li><Plain>Test Camera &amp; Microphone</Plain> checks your equipment.</li>
            <li><Go>Start Podcast</Go> starts recording.</li>
            <li><Stop>Stop Podcast</Stop> ends the recording.</li>
            <li><Go>Publish Episode</Go> puts the episode on the website.</li>
            <li><Plain>Start Over</Plain> throws the recording away. Use it only if you want to redo it.</li>
          </ol>
        </section>

        <Step n={1} title="Sign in">
          <p>Open the studio and type your 4-digit code. The studio signs you out when you close the browser.</p>
        </Step>

        <Step n={2} title="Test your camera and microphone">
          <p>
            Put on headphones. Press <Plain>Test Camera &amp; Microphone</Plain>. When your device asks, press <b>Allow</b>.
          </p>
          <p>You should see yourself. When you talk, the green bar moves. To hear yourself, press <Plain>Hear myself</Plain>. Turn it off again before you go on.</p>
          <p>Then the studio room opens. You are in it alone until a guest joins.</p>
        </Step>

        <Step n={3} title="Add the title and description">
          <p>Type the <b>Episode title</b>. You need a title to publish. The <b>Description</b> is optional but helps people find the episode.</p>
        </Step>

        <Step n={4} title="Invite your guests (optional)">
          <p>
            Press <Plain>Invite Guest</Plain>. A private link appears. Press <b>Copy Link</b>, <b>Text It</b>, or <b>Email It</b>.
          </p>
          <p>Each guest needs their own link. You can invite up to four guests.</p>
          <p>
            Guests can open the picture guide at <b>stephendmcconnell.com/podcast-guide</b> if they need help.
          </p>
          <Tip>A link works for one person on one device, and stops working when the recording is over.</Tip>
        </Step>

        <Step n={5} title="Start the recording">
          <p>Wait until every guest is in the room. Then press <Go>Start Podcast</Go>. The status changes to Recording.</p>
          <Tip>Wait for the word Recording before you begin talking.</Tip>
        </Step>

        <Step n={6} title="Stop the recording">
          <p>
            When you are finished, press <Stop>Stop Podcast</Stop>. Wait while it says &ldquo;Stopping and saving.&rdquo;
            Do not close the page. Guests are removed from the room and their links stop working.
          </p>
        </Step>

        <Step n={7} title="Watch the private draft">
          <p>
            After the recording finishes saving, a <b>Private draft</b> appears. Only you can see it. This can take a few
            minutes for a long episode. Watch it to make sure it sounds right.
          </p>
        </Step>

        <Step n={8} title="Publish, or start over">
          <p>
            Happy with it? Type the title if you have not, then press <Go>Publish Episode</Go> and confirm. When it says
            &ldquo;Your episode is published,&rdquo; it is done. It shows on the <b>Media</b> page in the Podcast Episodes section.
          </p>
          <p>
            Do not like it? Press <Plain>Start Over</Plain> and confirm <b>before</b> you publish. The recording is deleted
            for good.
          </p>
          <Tip>Publishing puts the episode on the public website. Start Over cannot delete it afterward.</Tip>
        </Step>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-navy">If something goes wrong</h2>
          {FIXES.map(([q, a]) => (
            <div key={q} className="rounded-xl border border-slate-300 bg-white p-4 text-lg text-slate-800">
              <b className="block text-navy">{q}</b>
              {a}
            </div>
          ))}
        </section>
      </div>
    </Container>
  );
}
