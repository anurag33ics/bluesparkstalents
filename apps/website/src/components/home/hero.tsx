import Image from "next/image";

export function Hero() {
  return (
  <section className="relative isolate overflow-hidden bg-brand-50">
  {/* Background Image */}
  <div className="absolute inset-0 -z-10">
    <Image
      src="/assets/images/sky-wash.png"
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover object-center"
    />

    {/* Soft white wash for readability */}
    <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/35 to-transparent" />

    {/* Blue glow */}
    <div className="absolute -right-40 top-20 h-[450px] w-[450px] rounded-full bg-brand-300/30 blur-[120px]" />

    {/* White glow */}
    <div className="absolute -left-40 bottom-0 h-[350px] w-[350px] rounded-full bg-white/60 blur-[100px]" />
  </div>

  <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
    <div className="grid items-center gap-14 lg:grid-cols-2">

      {/* LEFT */}
      <div className="max-w-3xl">

        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-2 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-brand-500" />

          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            Building Better Teams
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-5xl font-medium leading-[0.98] tracking-tight text-brand-950 sm:text-6xl lg:text-7xl">
          Find Talent
          <br />
          You Can{" "}
          <span className="text-brand-600">
            Trust.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-7 max-w-xl text-base leading-7 text-[#536888] sm:text-lg">
          We connect companies with screened, verified, and
          interview-ready professionals — helping you discover
          the right talent and hire with confidence.
        </p>

        {/* CTA */}
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">

          <a
            href="#talent"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-500"
          >
            Explore Talent

            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>

          <a
            href="#hire"
            className="inline-flex items-center justify-center rounded-xl border border-brand-200 bg-white/70 px-7 py-4 text-sm font-semibold text-brand-700 backdrop-blur-md transition-all duration-300 hover:border-brand-300 hover:bg-white"
          >
            Hire Top Talent
          </a>

        </div>

        {/* TRUST FEATURES */}
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-brand-200 pt-7">

          <div>
            <p className="text-lg font-bold text-brand-950">
              Screened
            </p>

            <p className="mt-1 text-xs text-[#536888]">
              Every candidate interviewed
            </p>
          </div>

          <div className="hidden h-10 w-px bg-brand-200 sm:block" />

          <div>
            <p className="text-lg font-bold text-brand-950">
              Verified
            </p>

            <p className="mt-1 text-xs text-[#536888]">
              Profiles you can trust
            </p>
          </div>

          <div className="hidden h-10 w-px bg-brand-200 sm:block" />

          <div>
            <p className="text-lg font-bold text-brand-950">
              Interview-Ready
            </p>

            <p className="mt-1 text-xs text-[#536888]">
              Ready for your next opportunity
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT VISUAL */}
      <div className="relative hidden min-h-[500px] lg:block">

        {/* Main card */}
        <div className="absolute right-0 top-1/2 w-[390px] -translate-y-1/2 rounded-3xl border border-white bg-white/70 p-4 shadow-2xl shadow-brand-500/15 backdrop-blur-xl">

          <div className="relative h-[280px] overflow-hidden rounded-2xl">
            <Image
              src="/assets/images/home-banner.jpg"
              alt="Verified professional"
              fill
              sizes="390px"
              className="object-cover"
            />

            {/* Verification badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white bg-white/85 px-4 py-2 shadow-sm backdrop-blur-md">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                ✓
              </span>

              <span className="text-xs font-semibold text-brand-950">
                Verified Professional
              </span>
            </div>
          </div>

          <div className="p-4">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-lg font-bold text-brand-950">
                  Ready to Hire
                </p>

                <p className="mt-1 text-sm text-[#536888]">
                  Screened & verified talent
                </p>
              </div>

              <div className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
                Verified
              </div>

            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">

              <div className="rounded-xl bg-brand-50 p-3">
                <p className="text-xs text-[#536888]">
                  Screening
                </p>
                <p className="mt-1 text-sm font-bold text-brand-950">
                  Complete
                </p>
              </div>

              <div className="rounded-xl bg-brand-50 p-3">
                <p className="text-xs text-[#536888]">
                  Skills
                </p>
                <p className="mt-1 text-sm font-bold text-brand-950">
                  Verified
                </p>
              </div>

              <div className="rounded-xl bg-brand-50 p-3">
                <p className="text-xs text-[#536888]">
                  Status
                </p>
                <p className="mt-1 text-sm font-bold text-brand-600">
                  Ready
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Floating card */}
        <div className="absolute -left-5 top-12 rounded-2xl border border-white bg-white/80 px-5 py-4 shadow-xl shadow-brand-500/10 backdrop-blur-xl">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-lg text-brand-600">
              ✓
            </div>

            <div>
              <p className="text-sm font-bold text-brand-950">
                Verified Talent
              </p>

              <p className="text-xs text-[#536888]">
                Ready for opportunities
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</section>
  );
}
