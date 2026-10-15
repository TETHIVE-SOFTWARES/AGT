import Link from "next/link";

export default function EventNotFound() {
  return (
    <main className="bg-ink px-5 py-40">
      <p className="eyebrow mb-5">07 — Record</p>
      <h1 className="display text-4xl text-bone md:text-6xl">This record is not on file.</h1>
      <Link href="/events" className="btn btn-ghost mt-8">
        All events
      </Link>
    </main>
  );
}
