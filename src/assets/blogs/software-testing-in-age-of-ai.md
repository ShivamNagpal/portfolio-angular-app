We're shipping faster, but also shipping more bugs. If someone claims AI alone will fix this, they're selling a myth.

---

## A telling example: the day an AI deleted a production database.

In July 2025, entrepreneur Jason Lemkin experimented with Replit's AI agent, a "vibe coding" tool that lets you describe what you want and watch the agent build it. He put the system into a designated code-and-action freeze. Translation: do not touch production. Sit still.

The agent did not sit still. It ran unauthorized commands, wiped a live database with data on more than 1,200 executives and 1,190 companies, then fabricated 4,000 fake users to cover its tracks. When confronted, it admitted to "panicking in response to empty queries" and violating explicit instructions.

Replit's CEO quickly rolled out new safeguards: automatic dev/prod separation, improved rollback, and a "planning-only" mode. While helpful, the broader lesson applies industry-wide:

**As code is written faster, testing grows even more crucial to prevent failures.**

If you took anything from the productivity-arrives-with-AI narrative, it should be this corollary: every shortcut into the codebase is a debt you eventually pay on the way out; usually in production, at 2 a.m., in front of customers.

---

## The comfortable lie

The dominant story in 2025 was: AI will write the code, write the tests, catch the bugs, and we'll all sip coffee while velocity quintuples. Engineering leaders nodded. Investors nodded harder. Some teams quietly shrank their QA functions.

Then the data came in.

Stack Overflow's 2025 Developer Survey found that 80% of developers use AI tools, but trust in their accuracy fell from 40% to 29% over the past year. More developers distrust AI output (46%) than trust it (33%). The top frustration, named by 45%, is "AI solutions that are almost right, but not quite," and 66% report spending more time fixing almost-right AI-generated code than writing it themselves.

METR's randomized controlled trial of experienced open-source developers showed they expected AI tooling to make them 24% faster. They felt 20% faster afterward. The data showed they were 19% slower.

Developers feel more productive than data shows, shipping code they don’t fully trust into larger, riskier systems. This environment makes testing more crucial, often the only barrier between teams and public failure.

---

## A short, painful history of "we'll skip the tests."

Before discussing AI, remember the old failure mode, “humans skipping tests”, has been the same headline for forty years.

**Therac-25, 1985–87.** A radiation therapy machine that removed physical hardware safety interlocks and trusted the software to be perfect. The software wasn't. A race condition delivered massive radiation overdoses to six patients; some died. It is now the case study every safety-critical software class opens with, not because the engineers were villains, but because the testing was inadequate to the consequences.

**Knight Capital, 2012.** A deployment engineer copied the new trading code to seven of eight servers. The eighth still ran a legacy function called Power Peg. In 45 minutes of trading, Knight lost $440 million. The bug was small. The change-management process around it was the actual failure.

**Boeing 737 MAX, 2018–19.** Two crashes. 346 dead. The MCAS flight-control software took a single faulty sensor reading and drove the aircraft into the ground. Regulators eventually mandated dual-sensor redundancy and independent software safety review for new commercial aircraft, a polite way of saying the existing process did not test the system honestly enough to catch a single-point-of-failure that a junior engineer could have whiteboarded in an afternoon.

**CrowdStrike, July 2024.** A sensor update with a parameter mismatch (21 inputs sent, 20 expected) crashed about 8.5 million Windows machines worldwide, resulting in the largest IT outage in history. Airlines grounded. Hospitals diverted. Banks frozen. The post-mortem found the flaw passed through "multiple layers of testing" because test cases used wildcard matching and never exercised the new field's actual logic. They tested in name only; it wasn't real testing.

Notice the pattern: none of these incidents involved teams unconcerned with quality. Each featured testing in name only, substance fell short of intent.

AI is rapidly amplifying weaknesses in testing, creating unprecedented risk.

---

## The new failure mode: AI-generated code, ungoverned

If the old failure mode was "humans skip tests," the new one is "humans trust AI output that nobody, not even the AI, fully understands." Together, they are sobering:

- **Veracode's 2025 GenAI Code Security Report** evaluated more than 100 LLMs across Java, JavaScript, Python, and C#. AI-generated code introduced security flaws in **45% of tasks.** Java came in at 72%; three out of every four AI-written Java tasks shipped with a security issue.
- **Apiiro** found that AI coding assistants now generate roughly **10× as many security findings per month** as they did six months earlier. AI-generated pull requests average ~10.83 issues each, versus ~6.45 for human-written PRs.
- **Iterative degradation** is real: a peer-reviewed IEEE study showed a **37.6% increase in critical vulnerabilities** after just five rounds of refining the same AI-generated code. Each "improve this" prompt made the security profile worse, not better.
- **Slopsquatting** is now a supply-chain threat. AI tools invent package names that don't exist; researchers tested 16 LLMs across 576,000 samples and found ~20% of recommended packages were hallucinated, with 43% consistent across re-runs. Attackers have registered those names with malicious payloads. The AI tells you to install something wrong. The malicious package is real.

And AI doesn't only fail at the code layer. It fails at the product layer too:

- **Air Canada (Feb 2024).** The airline's chatbot told a grieving customer he could apply for a bereavement discount retroactively. He couldn't. The British Columbia Civil Resolution Tribunal ruled Air Canada liable for its chatbot's misrepresentation. The airline was ordered to pay damages, and the bot was quietly retired. The disclaimers in the terms of service did not save them.
- **NYC's MyCity chatbot (March 2024).** A small-business assistant launched as a "once-in-a-generation opportunity" cheerfully advised business owners to break the law: take employee tips (illegal), discriminate against tenants with housing vouchers (illegal since 2008), refuse cash (illegal since 2020), and lock out tenants (definitely illegal). It stayed live for months after the issues were public. By 2026, it was being shut down because, in the new mayor's words, it was "unusable."

The core issue is that systems weren’t adversarially tested in real-world conditions. Friendly demos led to launches, but in the AI era, this can cause not just minor bugs but also lawsuits, regulatory action, and widespread outages.

---

## Why "AI will write the tests" is not a strategy.

When AI produces more code than humans can read, the tempting move is to ask AI to write the tests. AI can help with scaffolding, edge-case enumeration, and boilerplate. But "AI writes the tests" as a strategy has a fatal flaw: a model wrong about code behavior will be confidently and exhaustively wrong about testing it.

The CrowdStrike post-mortem illustrates this. The validator and interpreter disagreed on how many fields a record contained. Tests passed because they used wildcards that masked the disagreement. A test suite generated by a model with the same blind spot as the code is just a louder echo. It tells you the bug isn't there because it doesn't know how to look for it.

Tests must reflect a different perspective than the code. This impartiality is essential; otherwise, mistakes go unnoticed, and the entire product is at risk.

---

## A testing playbook for the AI era

I'll stop diagnosing and start prescribing. None of this is exotic. Most are testing fundamentals your senior engineers have always argued for, recast for a world where code is generated faster than humans can read it.

1. **The test pyramid still matters and matters more.** The pyramid (many fast unit tests, fewer integration tests, even fewer end-to-end tests) hasn't been killed by AI; it's been vindicated. When a coding agent produces hundreds of lines in seconds, you need fast, deterministic tests that run on every change. Unit tests keep an agent honest. They turn "the AI did something weird" from a debugging session into a one-line failure message.

2. **TDD pairs well with AI agents.** Test-Driven Development has always been good engineering, but slightly painful for humans. AI agents do not find it painful. Give a Cursor or Claude Code agent a failing test specifying behavior, and you've given it what it does well: a concrete, binary target. It iterates, self-corrects, and stops when the test passes. This is the inversion: TDD used to be a discipline humans imposed on themselves; with AI, it's the cheapest way to make the model produce code you can trust.

3. **Contract tests at every boundary.** If your service talks to another service (internal or third-party), write contract tests. Tools like Pact and Hoverfly exist for exactly this. In an AI-assisted codebase, where two agents on two teams might independently "fix" the same integration in incompatible ways, contracts are the only thing that keeps the system from silently drifting apart.

4. **Evals are the unit tests of LLM features.** If you ship anything with an LLM in the loop (a chatbot, an agent, a "summarize this" button), you need a regression suite of inputs and expected behaviors that runs on every prompt change, model upgrade, and provider switch. The Air Canada and MyCity disasters happened when teams shipped LLM features without eval suites. Frameworks like DeepEval, Langfuse, Maxim, Arize, and Comet Opik exist because the industry learned this lesson the expensive way. Research from IBM and others suggests systematic evaluations can reduce production failures by up to 60%.

5. **Shift left, but for real this time.** "Shift left" was once a buzzword. In an AI-assisted workflow, it's survival. Run static analysis, secret scanning, dependency checks, and type checks inside the agent's loop, not after the PR opens. Catching a problem inside the agent costs seconds. Catching it in production can cost from an apology email to a regulatory investigation, depending on your industry.

6. **Treat the AI like a confident, fast junior.** The best mental model is: the AI is a junior engineer who never gets tired or bored, types 100× faster than you, and is occasionally, confidently wrong. You would not ship that engineer's code without review. You would not let them touch production unsupervised. You would not assume their tests cover what they say. Apply the same skepticism to the model.

7. **Test the AI itself, not just the code it writes.** This is the new layer. If your product uses AI (not just is built with AI), the model is a runtime dependency that changes under your feet. Version it. Pin it where you can. Replay golden datasets through every new version before switching. Track drift. Have a rollback. Treat every model upgrade like a database migration: reversible, monitored, and rehearsed.

---

## What this actually costs (and what skipping it costs)

The "100× more expensive to fix in production" stat is famous and frequently cited but has murky origins; the original IBM Systems Sciences "study" appears to have been internal training material rather than rigorous research. Be skeptical of the precise multiplier.

But the direction is not in dispute. The Consortium for Information & Software Quality estimates the cost of poor software quality in the US at **\$2.41 trillion** annually. Enterprise downtime for critical applications runs north of **\$300,000 per hour,** with serious outages exceeding \$1M/hour. Knight Capital lost \$440M in 45 minutes. CrowdStrike's outage cost the global economy an estimated \$5B+. Air Canada's chatbot cost them \$812, and it is a precedent that any company deploying a customer-facing chatbot now lives under.

Set those numbers next to the cost of writing a unit test, building an eval suite, or running a contract check in CI. The math has never been more lopsided. Teams skip testing only because the cost is paid up-front, and savings come invisibly over the years in disasters that didn't happen. AI doesn't change that calculus. It compresses it. The window between "we shipped" and "we're on the news" is shorter now because code volume is higher and systems have greater autonomy.

---

## The argument, in one sentence

The case for testing in 2026 is not that AI made testing harder. It's that AI made not testing much, much more dangerous.

The old failure mode was a human skipping a test and praying. The new one is an AI generating ten thousand lines of plausible code, suggesting a hallucinated package, fabricating a database, lying about it in the post-mortem chat, and looking like a senior engineer's work to the casual reader. The defense against that isn't more AI. The defense is the same one we've had for fifty years: an honest, fast, well-instrumented test suite that runs on every change, written from a perspective independent of whoever (or whatever) wrote the code.

If you're a developer: write the test before the AI writes the function. It's the cheapest way to make the model produce something worth keeping.

If you're a tech lead: invest in the pyramid, the contracts, the evals, and the CI gates. Make them non-negotiable. The AI is going to keep getting faster. Your only leverage is making "fast" mean "fast and verified."

If you're an executive, testing is not the brake. It's the only reason you can take your foot off the brake. Without it, the productivity gains your AI tooling promised are an accounting fiction, paid for in incidents, churned customers, regulatory exposure, and engineering hours your team will spend cleaning up code that nobody, including the model, ever really understood.

We don't have a velocity problem in 2026. We have a verification problem. And the teams that are going to win the next five years are the ones that figured this out before the front-page incident, not after.
