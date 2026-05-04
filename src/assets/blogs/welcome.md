# Welcome to the Blog

I'm starting this blog as a place to write down what I learn while building backend systems -- specifically the kind that need to stay correct and fast under real-world load. Distributed schedulers, streaming pipelines, durable execution, the cost-vs-throughput tradeoffs that show up the moment you push past "it works on a single instance."

## What to expect

Short, focused posts. No 5,000-word essays on Kafka internals -- there are better resources for that. What you'll find here is closer to **field notes**:

- Bugs that taught me something non-obvious
- Design decisions and the reasoning behind them
- Performance numbers from real systems
- Ideas I'm exploring in my open source work (mostly [LogPlay](https://github.com/logplay-dev/logplay-server) right now)

## A small example

Here's the kind of code-level detail you might see in posts here:

```kotlin
// Idempotent processing via a checkpoint table
fun process(event: Event) = transaction {
  if (Checkpoint.exists(event.id)) return@transaction
  doWork(event)
  Checkpoint.insert(event.id)
}
```

That's it. New posts will land here. If something resonates -- or if you want to push back -- [reach out](/contact).
