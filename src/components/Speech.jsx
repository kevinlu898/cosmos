// A speech bubble that points down toward the animal underneath it.
// Width grows with the text (up to a readable max) so the full question shows.
// `tone` tints the bubble for answer feedback: "correct" | "wrong".
const TONE_BORDER = {
  correct: "border-green-400",
  wrong: "border-rose-400",
};

export function Speech(props) {
  const border = TONE_BORDER[props.tone] || "border-white";
  return (
    <div className="relative w-fit max-w-2xl shrink-0">
      <div
        className={`rounded-[1.75rem] border-4 ${border} bg-white/95 px-6 py-3 text-center shadow-[0_12px_30px_rgba(80,60,140,0.35)] backdrop-blur-sm transition-colors`}
      >
        <p className="text-base font-bold leading-snug text-purple-900 sm:text-lg md:text-xl">
          {props.text}
        </p>
      </div>
      {/* tail pointing down to the animal */}
      <div
        className={`absolute left-1/2 top-full h-6 w-6 -translate-x-1/2 -translate-y-3 rotate-45 border-b-4 border-r-4 ${border} bg-white/95`}
      />
    </div>
  );
}
