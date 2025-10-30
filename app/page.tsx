export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          Colors
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          A design tool to help you pick color palettes and see how colors interact with each other.
          Create beautiful, accessible color schemes for your projects.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="h-32 w-32 rounded-lg bg-primary transition-transform hover:scale-105" />
          <div className="h-32 w-32 rounded-lg bg-secondary transition-transform hover:scale-105" />
          <div className="h-32 w-32 rounded-lg bg-accent transition-transform hover:scale-105" />
          <div className="h-32 w-32 rounded-lg bg-muted transition-transform hover:scale-105" />
        </div>
      </section>

      <section className="py-24">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Scroll down to see the navbar expand
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="mb-2 text-xl font-semibold">Feature {i + 1}</h3>
              <p className="text-muted-foreground">
                Explore color palettes and combinations with our intuitive design tools.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-8 text-center text-muted-foreground"
            >
              Additional content section {i + 1} - Keep scrolling to see navbar transform
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
