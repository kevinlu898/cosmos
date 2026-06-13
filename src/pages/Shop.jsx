import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const shopCards = [
  {
    title: "Nebula Pack",
    description: "Starter bundle with a few boosts for a smooth launch.",
    price: "$12",
    highlight: "Best value for first-time explorers",
  },
  {
    title: "Star Core",
    description: "Upgrade your loadout with a compact set of rare items.",
    price: "$7",
    highlight: "Fast unlock",
  },
  {
    title: "Moon Dust",
    description: "A small stash of currency for quick in-game buys.",
    price: "$4",
    highlight: "Instant delivery",
  },
  {
    title: "Galaxy Vault",
    description: "Large bundle for players who want the full cosmic set.",
    price: "$24",
    highlight: "Includes bonus rewards",
    span: true,
  },
];

export default function Shop() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.35),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_28%),linear-gradient(180deg,#12071f_0%,#090312_50%,#05010a_100%)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] bg-size-[28px_28px] opacity-70 mask-[linear-gradient(to_bottom,rgba(0,0,0,0.9),transparent_92%)]" />
      <div className="absolute left-10 top-12 h-36 w-36 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute right-12 top-32 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />

      <main className="relative mx-auto flex h-screen w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:gap-5 lg:px-6 lg:py-5">
        <aside className="flex w-full flex-col justify-between rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-left shadow-[0_12px_36px_rgba(17,8,38,0.45)] backdrop-blur-xl lg:w-[30%] lg:min-h-0">
          <div className="space-y-2.5">
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-fuchsia-200/80">
              Cosmic Shop
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-2xl">
              Equip your next run.
            </h1>
            <p className="max-w-xl text-[0.8rem] leading-5 text-slate-300 sm:text-sm lg:text-[0.78rem]">
              A darker, space-themed storefront built around a clean split
              layout. The left side explains the shop while the right side keeps
              the featured items in a balanced 2x2 square grid.
            </p>
          </div>

          <div className="mt-4 grid gap-2 border-t border-white/10 pt-3 text-[0.7rem] text-slate-300">
            <div className="flex items-center justify-between gap-2">
              <span>Featured drops</span>
              <span className="text-white">4</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span>Layout ratio</span>
              <span className="text-white">30 / 70</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span>Card shape</span>
              <span className="text-white">Square</span>
            </div>
          </div>
        </aside>

        <section className="grid w-full gap-3 md:grid-cols-2 lg:w-[70%] lg:min-h-0">
          {shopCards.map((card) => (
            <Card
              key={card.title}
              className="aspect-square h-full border-white/10 bg-white/8 text-white shadow-[0_12px_36px_rgba(17,8,38,0.65)] backdrop-blur-xl"
            >
              <CardHeader className="space-y-1.5 px-3 pt-3">
                <div className="flex items-start justify-between gap-2.5">
                  <div>
                    <CardTitle className="text-lg text-white">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="mt-1 max-w-xl text-[0.72rem] text-slate-300">
                      {card.description}
                    </CardDescription>
                  </div>
                  <div className="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-2 py-0.5 text-[0.68rem] font-medium text-fuchsia-100">
                    {card.price}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex h-full flex-col justify-end px-3 pb-3">
                <p className="text-[0.72rem] leading-4 text-slate-300">
                  {card.highlight}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
