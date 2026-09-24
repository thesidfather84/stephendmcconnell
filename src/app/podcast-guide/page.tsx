import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

// Help page for podcast guests. Not linked from the main menu and not indexed by search engines.
export const metadata: Metadata = {
  title: "How to Join the Podcast",
  robots: { index: false, follow: false },
};

const PILL = "inline-block rounded-full px-3 font-bold";
const Btn = ({ children }: { children: ReactNode }) => (
  <span className={`${PILL} bg-medical text-white`}>{children}</span>
);
const Plain = ({ children }: { children: ReactNode }) => (
  <span className={`${PILL} bg-white text-navy ring-2 ring-inset ring-slate-500`}>{children}</span>
);

function Step({ n, title, children, art }: { n: number; title: string; children: ReactNode; art: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-300 bg-white p-5">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-medical text-2xl font-bold text-white">
          {n}
        </span>
        <h2 className="text-2xl font-bold text-navy">{title}</h2>
      </div>
      <div className="flex flex-col gap-3 text-lg text-slate-800">{children}</div>
      <div className="overflow-hidden rounded-xl">{art}</div>
    </section>
  );
}

const Red = ({ x, y, w, h, r }: { x: number; y: number; w: number; h: number; r: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke="#b3261e" strokeWidth={4} strokeDasharray="10 6" />
);

const FIXES: [string, string][] = [
  [
    "A red message says the camera or microphone is blocked",
    "Tap the lock or camera icon next to the web address, choose Allow for Camera and Microphone, then press the Test button again.",
  ],
  ["The green bar does not move", "Check that your headphones or microphone are plugged in. Then press the Test button again."],
  ["“This link was already used by someone else”", "Your link works on one device only. Ask Stephen for a new link."],
  ["The picture freezes", "Move closer to your Wi-Fi."],
  ["You hear an echo or squeal", "Put on headphones, and make sure Hear myself is turned off."],
];

export default function PodcastGuidePage() {
  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">How to join the podcast</h1>
          <p className="text-xl text-slate-700">
            Six easy steps. It takes about five minutes. You can use a computer, an iPhone, or an iPad.
          </p>
        </header>

        <section className="flex flex-col gap-2 rounded-2xl border-2 border-navy bg-white p-5 text-lg">
          <strong className="text-xl text-navy">Before you start, have these ready</strong>
          <ul className="list-disc space-y-1 pl-6">
            <li>The link Stephen sent you (by text or email)</li>
            <li>Headphones or earbuds, if you have them. They stop echo.</li>
            <li>A quiet room with the light in front of you</li>
          </ul>
        </section>

        <Step
          n={1}
          title="Open your link"
          art={
            <svg viewBox="0 0 600 150" role="img" aria-label="A text message from Stephen with a blue link" className="block h-auto w-full">
              <rect width="600" height="150" fill="#dde6ee" />
              <rect x="40" y="26" width="440" height="98" rx="20" fill="#fff" />
              <text x="64" y="62" fontSize="19" fill="#44546a">Stephen: Here is your podcast link</text>
              <text x="64" y="102" fontSize="21" fontWeight="700" fill="#0b57d0" textDecoration="underline">stephendmcconnell.com/podcast-studio/join/...</text>
              <path d="M470 108 l14 -34 l10 12 l14 -6 z" fill="#b3261e" />
              <text x="500" y="128" fontSize="18" fontWeight="700" fill="#b3261e">Tap here</text>
            </svg>
          }
        >
          <p>Tap or click the link Stephen sent. A page opens with a box for your name.</p>
        </Step>

        <Step
          n={2}
          title="Type your name"
          art={
            <svg viewBox="0 0 600 150" role="img" aria-label="A box labeled Your name with a name typed in" className="block h-auto w-full">
              <rect width="600" height="150" fill="#eef3f6" />
              <text x="40" y="44" fontSize="22" fontWeight="700" fill="#0f2a4a">Your name</text>
              <rect x="40" y="58" width="520" height="56" rx="10" fill="#fff" stroke="#44546a" strokeWidth="3" />
              <text x="60" y="95" fontSize="26" fill="#14243a">Frank|</text>
            </svg>
          }
        >
          <p>Click the box under <b>Your name</b> and type your first name.</p>
        </Step>

        <Step
          n={3}
          title="Press the Test button"
          art={
            <svg viewBox="0 0 600 130" role="img" aria-label="The Test Camera and Microphone button, highlighted" className="block h-auto w-full">
              <rect width="600" height="130" fill="#eef3f6" />
              <rect x="40" y="30" width="520" height="62" rx="31" fill="#fff" stroke="#44546a" strokeWidth="3" />
              <text x="300" y="70" textAnchor="middle" fontSize="24" fontWeight="700" fill="#0f2a4a">Test Camera &amp; Microphone</text>
              <Red x={32} y={22} w={536} h={78} r={38} />
            </svg>
          }
        >
          <p>Put on your headphones. Then press <Plain>Test Camera &amp; Microphone</Plain></p>
        </Step>

        <Step
          n={4}
          title="Say Allow"
          art={
            <svg viewBox="0 0 600 190" role="img" aria-label="A permission box with an Allow button highlighted" className="block h-auto w-full">
              <rect width="600" height="190" fill="#dde6ee" />
              <rect x="110" y="20" width="380" height="150" rx="16" fill="#fff" stroke="#8a99a8" strokeWidth="2" />
              <text x="300" y="62" textAnchor="middle" fontSize="20" fontWeight="700" fill="#14243a">Use your camera and microphone?</text>
              <rect x="150" y="100" width="130" height="46" rx="23" fill="#fff" stroke="#8a99a8" strokeWidth="2" />
              <text x="215" y="130" textAnchor="middle" fontSize="20" fill="#44546a">Block</text>
              <rect x="320" y="100" width="130" height="46" rx="23" fill="#0b7a75" />
              <text x="385" y="130" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">Allow</text>
              <Red x={312} y={92} w={146} h={62} r={31} />
            </svg>
          }
        >
          <p>Your device asks to use the camera and microphone. Press <b>Allow</b>. The show cannot work without it.</p>
        </Step>

        <Step
          n={5}
          title="Check yourself"
          art={
            <svg viewBox="0 0 600 260" role="img" aria-label="Camera picture, a moving green sound bar, and the Hear myself button" className="block h-auto w-full">
              <rect width="600" height="260" fill="#eef3f6" />
              <rect x="40" y="16" width="520" height="150" rx="14" fill="#0f2a4a" />
              <circle cx="300" cy="74" r="28" fill="#8fb1cf" />
              <path d="M240 150 q60 -60 120 0 z" fill="#8fb1cf" />
              <rect x="40" y="180" width="520" height="20" rx="10" fill="#d3dce4" />
              <rect x="40" y="180" width="300" height="20" rx="10" fill="#16803c" />
              <text x="40" y="224" fontSize="17" fill="#44546a">Green bar moves when you talk</text>
              <rect x="380" y="208" width="180" height="40" rx="20" fill="#fff" stroke="#44546a" strokeWidth="2" />
              <text x="470" y="234" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0f2a4a">Hear myself</text>
            </svg>
          }
        >
          <p>You should see your face. Say hello. The <b>green bar</b> moves when you talk. That means the microphone works.</p>
          <p>
            Want to hear your own voice? Put headphones on first, then press <Plain>Hear myself</Plain>. Press{" "}
            <Plain>Stop hearing myself</Plain> when you are done.
          </p>
          <p className="rounded-xl bg-amber-50 p-4 font-bold text-amber-900">
            No headphones? Do not press Hear myself. It will squeal.
          </p>
        </Step>

        <Step
          n={6}
          title="Press Join Episode"
          art={
            <svg viewBox="0 0 600 130" role="img" aria-label="The Join Episode button, highlighted" className="block h-auto w-full">
              <rect width="600" height="130" fill="#eef3f6" />
              <rect x="40" y="30" width="520" height="62" rx="31" fill="#0b7a75" />
              <text x="300" y="70" textAnchor="middle" fontSize="26" fontWeight="700" fill="#fff">Join Episode</text>
              <Red x={32} y={22} w={536} h={78} r={38} />
            </svg>
          }
        >
          <p>
            Wait for Stephen to say he is ready. Then press <Btn>Join Episode</Btn>. You will see Stephen and the
            others. The recording is already running, so just talk.
          </p>
        </Step>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-navy">When you are finished</h2>
          <p className="text-lg text-slate-800">
            Stephen will end the show. You can then close the page. If you leave by accident, open your link again.
          </p>
        </section>

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
