---
title: "rustyWings, twice"
description: "An evolution simulation in Rust and WebAssembly: first a tutorial port, then a deterministic ecosystem whose learning is tested in CI."
date: 2026-09-13 # planned publish date
draft: true
period: "2024–2026"
order: 4
repo: https://github.com/mahim37/rustyWings
demo: https://rusty-wings-iota.vercel.app
# Every number in the essay was reproduced on 2026-09-06 at rustyWings commit a40c2bc with the
# CI arena command (`rustywings arena --seeds 3 --ticks 30000 --samples 24 --arena-ticks 1500
# --threshold 1.3`), `rustywings bench --agents 5000 --ticks 200` and
# `rustywings run --seed 1 --ticks 60000`. If the defaults or the golden checksum change, re-run
# and update the arena block, the seed-1 paragraph and the ms-per-tick line. When milestone 2
# ships, update the figure caption, the Outcome paragraph and the Links.
---

<figure class="embed wide">
  <div class="frame">
    <iframe src="https://rusty-wings-iota.vercel.app" title="rustyWings, a live evolution simulation" loading="lazy"></iframe>
  </div>
  <figcaption>The 2024 build, which is still what is deployed. Type <code>t</code> and press enter to fast-forward a generation. <a href="https://rusty-wings-iota.vercel.app">Open it full size.</a></figcaption>
</figure>

## Context

rustyWings is a small artificial-life simulation. Birds with neural-network brains live on a torus and evolve, and the whole thing runs in the browser as WebAssembly. I have built it twice.

The first time was June 2024, as my way of learning Rust. I followed Patryk Wychowaniec's [Learning to Fly](https://pwy.io/posts/learning-to-fly-pt1/) series closely: a triangular bird with an eye of nine angular cells, nine hidden neurons, two outputs for speed and turn, roulette-wheel selection, uniform crossover, Gaussian mutation, and a new generation every 2,500 turns. Forty birds, sixty foods, a terminal on the left and a canvas on the right. The port taught me the borrow checker, `wasm-bindgen`, and how a genetic algorithm actually loops. It is what the embed above is running. Until this month it was also what my CV meant by "developed an advanced evolution simulation".

The second time was September 2026, when I put the project on this site and read it again with two years of production work behind me.

## Problem

Judged honestly, the port had two problems. The design was not mine, so writing it up as mine would have been the kind of lie a good interviewer catches with one question. And its architecture could not be pushed anywhere interesting. Every frame, the JavaScript side asked for the world and got a deep copy of every bird, vision array included. The canvas was resized, and therefore cleared, every frame. Collision was every bird against every food. Randomness came from `thread_rng`, so no run could be reproduced, and nothing ran in CI. None of that matters for forty birds. All of it matters for four thousand.

The generational algorithm had a subtler problem. It decides what "good" means (food eaten in 2,500 turns), resets the world every generation, and can only ever show birds getting better at the one thing the fitness function names. I wanted an ecosystem where selection is whatever survives, and I wanted "it learns" to be a measurement rather than something you take on faith from a canvas.

So the first decision record in the repo says: rebuild the core rather than extend the port, keep the old app deployed until a new frontend replaces it, and credit the tutorial as the lineage.

## Design and trade-offs

The new core is a library crate with no I/O and no threads, compiled both natively and to `wasm32`. It differs from the port on almost every axis.

| | 2024 port | 2026 core |
|---|---|---|
| Selection | Fitness is food eaten; a new generation every 2,500 turns | No fitness function and no generations. Energy, reproduction above a threshold, death by starvation or age |
| World | 40 birds, 60 foods | Sparrows eat seeds, hawks eat sparrows. Seeds regrow logistically around ten drifting patches |
| Genome | Network weights | Weights plus four body traits: field of view, sight range, top speed, size. Each costs energy |
| Senses | One channel, food only | Three channels (seeds, sparrows, hawks) of nine cells, plus own energy and speed. 29 inputs, 8 hidden, 2 outputs |
| Randomness | `thread_rng` | Owned xoshiro256++. A seed is a world |
| Layout | Vec of structs, copied per frame | Struct of arrays, for zero-copy reads from wasm memory |
| Neighbours | All pairs | Counting-sort spatial hash, rebuilt every tick |
| Proof | A canvas | A golden checksum on three operating systems and a learning test, both in CI |

Three of those choices were the expensive ones.

**Energy instead of fitness.** A bird pays a basal cost each tick, a movement cost that scales with speed squared and body size, and a sensing cost that scales with field of view and range. Eating restores energy. Enough energy plus enough age makes a child with a mutated genome. Because eyes are not free, "how much should a sparrow see?" is a question the simulation answers rather than one the config sets. In a 60,000-tick run from seed 1, the sparrows' mean field of view widened from 179° to 321° while their sight range shrank by about a fifth, and they got faster and bigger. Hawks finished near where they started, around 110°. Four in five sparrow deaths were hawks. None of that was programmed.

**Determinism as a constraint.** A seed in a shared URL should replay the same world years later, and the native CLI should produce the same checksum as the browser so CI can vouch for the wasm build. That rules out the `rand` crate, whose distributions may change across versions, and platform math libraries, which differ in the last bit for `sin`, `cos` and `tanh`. In a chaotic many-body system one ulp diverges the trajectory within a few hundred ticks. So the crate carries its own small xoshiro256++ with reference-vector tests, routes transcendentals through the pure-Rust `libm` crate, takes `sqrt` from `std` because IEEE 754 requires it to be correctly rounded, and forbids hash maps and threads inside a step. The cost is speed. `libm`'s `atan2` dominated the per-tick profile until the retina switched to a polynomial approximation accurate to a tenth of a degree, still pure arithmetic and still deterministic.

**A learning test.** Population counts cannot prove that brains improved. More sparrows might mean more seeds, fewer hawks, or luck. The arena drops one genome into a fresh fixed-seed world with reproduction and death switched off, runs 1,500 ticks and counts meals. The `arena` command evolves several worlds in parallel, samples genomes from each, scores them against the same number of freshly random genomes in the same arena, and fails if the median ratio is below a threshold. CI runs it on every push. This is a cold run from today:

```
$ rustywings arena --seeds 3 --ticks 30000
  seed   sparrows      evolved       random    ratio
     1        387        77.21        22.88     3.38
     2        382        62.92        39.58     1.59
     3        414       197.04        51.75     3.81
median ratio 3.38 (threshold 1.30) · 42.2s
ok: evolved sparrows out-forage random ones
```

Smaller things I would defend in a review: each phase of a tick borrows exactly the columns it touches, so the borrow checker proves the phases do not alias. Eating resolves against pre-move positions, so the grid built at the start of the tick stays valid. A bad config fails as `herbivore.child_energy` rather than as a panic. A world restored from a snapshot continues bit for bit.

## What broke, and what I would do differently

**I wrote a comment instead of a test.** The 2024 `brain.rs` still says `// CHECK THISSSSS!!!!!!!!!!!!!` above the function that rebuilds a network from a flat chromosome, because I was not sure the weight order matched the topology. A round-trip test that answers exactly that question was already in the neural-network crate. The comment survived two years and several deploys. Now, when I catch myself writing "verify" in a comment, that is the test I write next.

**I committed a binary to make a deploy go green.** Vercel's build image has no Rust toolchain. In October 2024 I spent a day trying to install `wasm-pack` from the build command. In April 2025 I tried installing `rustup` from the install command instead, and that day's log reads `fix: deps issues`, `fix: vercel.json`, `fix: rust missing`. A week later I committed the `wasm-pack` output into `www/pkg` and the deploy passed. Pragmatic, and wrong: for the next sixteen months nothing guaranteed that the deployed wasm matched the source. This month the same deployment broke again, because the Node runtime Vercel had picked in 2025 reached end of life, and I only noticed when the rebuild's preview deploy failed. The fifth decision record: CI builds the wasm, nothing compiled is committed, and the install step installs Rust itself.

**The first defaults collapsed.** The first parameter set produced a predator overshoot: hawks bred until the sparrows crashed to the rescue floor, where an immigration rule kept them alive on fresh random genomes, which is cheating. Tuning needed a headless runner, so the CLI came before the frontend. The adopted defaults came from a sweep judged on 60,000-tick runs against five criteria: no immigrants, sparrows in the hundreds, hawks a fraction of that, seeds still visible, and an arena ratio well above one. That is a target, not a guarantee. Seed 2 still admits two hawk immigrants in 60,000 ticks, and the CLI prints the count so you can see it.

**Report the median, not the best seed.** My first write-up of the arena quoted the range of ratios I had seen, and the top of that range was higher than anything in the block above. Re-running the CI command cold gave a median of 3.4 with one seed at 1.6. The lesson generalises to every performance claim I have made at work: quote the run someone else can reproduce.

**What I have not measured.** The core does 8.3 ms per tick at about 4,000 birds, natively, on a laptop. That says nothing about wasm on a phone, and the browser frontend is the next milestone. Until it exists, every performance decision above is a guess with a test attached. Better than a guess, but not a measurement.

The rebuild was pair-programmed with Claude Code, and the commit trailers say so. The decisions in the decision records are mine, and the CI is what lets me say that with a straight face.

## Outcome

The new core and CLI are in [pull request #1](https://github.com/mahim37/rustyWings/pull/1): 44 tests in the core, 120 across the workspace, and five CI jobs green, including the identical checksum on Linux, macOS and Windows and the learning test. The 2024 app is still what is deployed, and the embed above says so. The next milestone is a TypeScript frontend that reads bird positions straight from wasm memory into WebGL instance buffers, with the simulation on a worker and the seed in the URL. When it ships, the embed changes and so does this paragraph.

What transferred to my day job: determinism is a design constraint, not a feature you add later; "it works" needs an instrument before it needs a demo; and reading your own two-year-old code without flinching is the cheapest code review there is.

## Links

- Source: [github.com/mahim37/rustyWings](https://github.com/mahim37/rustyWings). The rebuild is on the `revamp/m1-core` branch until PR #1 merges.
- Live demo: [rusty-wings-iota.vercel.app](https://rusty-wings-iota.vercel.app), the 2024 build.
- Design notes: [ARCHITECTURE.md](https://github.com/mahim37/rustyWings/blob/revamp/m1-core/docs/ARCHITECTURE.md) and the [decision records](https://github.com/mahim37/rustyWings/tree/revamp/m1-core/docs/decisions).
- Lineage: Patryk Wychowaniec, [Learning to Fly: Let's simulate evolution in Rust](https://pwy.io/posts/learning-to-fly-pt1/).
