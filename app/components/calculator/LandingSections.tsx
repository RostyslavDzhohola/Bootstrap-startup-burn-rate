"use client";

import { WORKFLOW_STEPS, FAQ_ITEMS } from "./constants";

export default function LandingSections() {
  const scrollToCalculator = () => {
    const calculatorElement = document.getElementById("calculator");
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Process section educates visitors on the three-step workflow. */}
      <section
        id="how-it-works"
        className="rounded-3xl bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 p-px shadow-2xl"
      >
        <div className="rounded-[calc(var(--radius-3xl)-1px)] bg-slate-950/95 p-8 sm:p-10">
          <div className="space-y-3 text-center text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-200">
              How it works
            </p>
            <h2 className="text-2xl font-bold">
              Stay ahead of burn in three moves
            </h2>
            <p className="text-sm text-slate-200 max-w-3xl mx-auto">
              Each step nudges you to revisit assumptions regularly, so your
              runway forecast stays living and actionable.
            </p>
          </div>
          <div className="mt-8 space-y-6">
            {WORKFLOW_STEPS.map((step) => (
              <div
                key={step.step}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-slate-100 sm:flex-row sm:items-start sm:gap-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-lg font-bold text-blue-100">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-200">
                    {step.step === "3" ? (
                      <>
                        Based on how long your runway is, decide how to reduce
                        expenses, increase savings, or consider a cheaper city.
                        Recommendation: check cities on{" "}
                        <a
                          href="https://nomads.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 underline"
                        >
                          Nomads.com
                        </a>{" "}
                        to extend your run.
                      </>
                    ) : (
                      step.detail
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for section */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg backdrop-blur">
        <div className="space-y-4 text-center">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Target audience
            </p>
            <h2 className="text-2xl font-bold text-slate-900">Who is this for?</h2>
          </div>
          <p className="text-sm text-slate-600 max-w-3xl mx-auto">
            Aspiring indie developers, people who want to do a startup, people
            who want to start their business. They're trying to make a decision
            between doing it part-time or going all in.
          </p>
          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">
              The questions they're trying to answer:
            </p>
            <div className="grid gap-3 max-w-3xl mx-auto">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-base font-semibold text-slate-700">How much time do I have?</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-base font-semibold text-slate-700">How to extend it?</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-base font-semibold text-slate-700">How to decrease risk?</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-base font-semibold text-slate-700">
                  Do they want to go all in or not?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs lower decision friction by pre-empting common concerns. */}
      <section className="rounded-3xl bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 p-px shadow-2xl">
        <div className="rounded-[calc(var(--radius-3xl)-1px)] bg-slate-950/95 p-8 sm:p-10">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-white">
                Frequently asked
              </h2>
              <p className="text-sm text-slate-300">
                Short answers that help your team feel confident adopting the
                tool.
              </p>
            </div>
            <div className="space-y-4">
              {FAQ_ITEMS.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm transition-shadow open:shadow-md"
                >
                  <summary className="cursor-pointer list-none text-left text-base font-semibold text-white transition-colors hover:text-blue-300">
                    <span className="inline-flex items-center gap-3">
                      <span className="rounded-full bg-blue-500/30 px-2 py-0.5 text-xs font-semibold text-blue-200 group-open:bg-blue-600 group-open:text-white">
                        Answer
                      </span>
                      {faq.question}
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-200 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final call-to-action encourages sign-up after learning the basics. */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 sm:p-10 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Ready to go all in?</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Fill out the Calculator to get your own countdown clock that you
              can save as a home page.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={scrollToCalculator}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:bg-slate-800"
            >
              Create the clock
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

