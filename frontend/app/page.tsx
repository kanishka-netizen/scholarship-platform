"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dashboard } from "./dashboard";
import { useAuth } from "./auth-provider";
import { apiFetch } from "./lib/api";

type Scholarship = {
  id: string;
  name: string;
  provider: string;
  description?: string | null;
  amount?: number | null;
  deadline?: string | null;
  course?: string | null;
  state?: string | null;
  applicationUrl?: string | null;
  verified?: boolean;
};

type ScholarshipResponse = { data: Scholarship[] };

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function formatAmount(amount?: number | null) {
  return amount ? `INR ${new Intl.NumberFormat("en-IN").format(amount)}` : "Amount varies";
}

function formatDeadline(deadline?: string | null) {
  if (!deadline) return "Deadline not listed";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(deadline));
}

export default function Home() {
  const { session, user, loading: authLoading, configured, signInWithGoogle, signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [course, setCourse] = useState("");
  const [sort, setSort] = useState("deadline");
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selected, setSelected] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ limit: "48" });
    if (search) params.set("search", search);
    if (state) params.set("state", state);
    if (course) params.set("course", course);
    if (sort !== "deadline") params.set("sort", sort);

    fetch(`${apiUrl}/scholarships?${params.toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Scholarships could not be loaded");
        return response.json() as Promise<ScholarshipResponse>;
      })
      .then((response) => {
        setScholarships(Array.isArray(response.data) ? response.data : []);
        setLoadError(null);
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          setScholarships([]);
          setLoadError("Scholarships could not be loaded. Please try again later.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [course, search, sort, state]);

  async function handleAuth() {
    if (user) {
      await signOut();
      return;
    }
    const error = await signInWithGoogle();
    if (error) window.alert(error);
  }

  async function saveScholarship(scholarshipId: string) {
    if (!session) {
      const error = await signInWithGoogle();
      if (error) window.alert(error);
      return;
    }

    try {
      const currentUser = await apiFetch<{ id: string }>("/users/me", session.access_token);
      await apiFetch(`/users/${currentUser.id}/saved/${scholarshipId}`, session.access_token, { method: "POST" });
      window.alert("Scholarship saved to your dashboard.");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not save scholarship");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#183b3b]">
      <header className="border-b border-[#183b3b]/15 bg-[#f5f1e8]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a className="text-lg font-bold tracking-[0.18em]" href="#top">SCHOLARLY</a>
          <nav className="hidden gap-8 text-sm font-medium md:flex" aria-label="Primary navigation">
            <a className="border-b-2 border-[#e36f42] pb-1" href="#explore">Explore</a>
            {user && <a className="opacity-60" href="#dashboard">Dashboard</a>}
            <a className="opacity-60" href="#about">How it works</a>
          </nav>
          <button onClick={() => void handleAuth()} disabled={authLoading} className="rounded-full border border-[#183b3b]/25 px-4 py-2 text-sm font-semibold transition hover:bg-[#183b3b] hover:text-[#f5f1e8]">
            {authLoading ? "Loading..." : user ? "Sign out" : "Continue with Google"}
          </button>
        </div>
      </header>

      <section id="top" className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-16 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pt-24">
        <div><p className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[#e36f42]">A clearer path to funding</p><h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-7xl">Find the support your future deserves.</h1><p className="mt-7 max-w-xl text-lg leading-8 text-[#183b3b]/70">Search verified scholarships by what matters to you: your course, your state, and your next step.</p></div>
        <div className="relative flex min-h-64 items-end overflow-hidden rounded-4xl bg-[#dce8d5] p-8"><div className="absolute right-8 top-8 h-28 w-28 rounded-full border-18 border-[#e36f42]/80" /><div className="absolute -bottom-12 right-24 h-44 w-44 rounded-full bg-[#183b3b]" /><div className="relative max-w-xs text-2xl font-semibold leading-tight">Your next opportunity may be closer than you think.</div></div>
      </section>

      <section id="explore" className="border-y border-[#183b3b]/10 bg-[#fffdf8]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10"><form className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="search">Search scholarships</label><input id="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by scholarship or provider" className="h-12 rounded-xl border border-[#183b3b]/20 bg-white px-4 outline-none transition focus:border-[#e36f42]" />
          <label className="sr-only" htmlFor="state">State</label><input id="state" value={state} onChange={(event) => setState(event.target.value)} placeholder="State" className="h-12 rounded-xl border border-[#183b3b]/20 bg-white px-4 outline-none transition focus:border-[#e36f42]" />
          <label className="sr-only" htmlFor="course">Course</label><input id="course" value={course} onChange={(event) => setCourse(event.target.value)} placeholder="Course" className="h-12 rounded-xl border border-[#183b3b]/20 bg-white px-4 outline-none transition focus:border-[#e36f42]" />
          <label className="sr-only" htmlFor="sort">Sort scholarships</label><select id="sort" value={sort} onChange={(event) => setSort(event.target.value)} className="h-12 rounded-xl border border-[#183b3b]/20 bg-white px-4 outline-none focus:border-[#e36f42]"><option value="deadline">Deadline soonest</option><option value="amount">Highest amount</option><option value="recent">Recently added</option></select>
          <button className="h-12 rounded-xl bg-[#e36f42] px-6 font-semibold text-white transition hover:bg-[#c8552c]" type="submit">Search</button>
        </form></div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e36f42]">Open opportunities</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">Scholarships worth a closer look</h2></div><p className="text-sm text-[#183b3b]/60">{loading ? "Refreshing listings..." : `${scholarships.length} opportunities shown`}</p></div>
        {loadError && <p className="mb-6 rounded-xl bg-[#f6d8c9] px-4 py-3 text-sm text-[#183b3b]/75">{loadError}</p>}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((scholarship) => <article key={scholarship.id} className="flex min-h-72 flex-col justify-between rounded-2xl border border-[#183b3b]/12 bg-white p-6 shadow-[0_12px_30px_rgba(24,59,59,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(24,59,59,0.12)]"><div><div className="mb-5 flex items-start justify-between gap-4"><span className="rounded-full bg-[#dce8d5] px-3 py-1 text-xs font-bold uppercase tracking-wider">{scholarship.verified ? "Verified" : "Listing"}</span><span className="text-sm font-semibold text-[#e36f42]">{formatAmount(scholarship.amount)}</span></div><h3 className="text-xl font-semibold leading-tight">{scholarship.name}</h3><p className="mt-2 text-sm font-medium text-[#183b3b]/55">{scholarship.provider}</p><p className="mt-5 line-clamp-3 text-sm leading-6 text-[#183b3b]/70">{scholarship.description ?? "Explore this opportunity and review its full eligibility details."}</p></div><div className="mt-7 flex items-end justify-between gap-4 border-t border-[#183b3b]/10 pt-4 text-xs text-[#183b3b]/60"><span>Deadline<br /><strong className="text-sm text-[#183b3b]">{formatDeadline(scholarship.deadline)}</strong></span><div className="flex gap-3"><button onClick={() => void saveScholarship(scholarship.id)} className="font-bold text-[#183b3b]/60 hover:underline">Save</button><button onClick={() => setSelected(scholarship)} className="font-bold text-[#e36f42] hover:underline">View details</button></div></div></article>)}
        </div>
        {!loading && scholarships.length === 0 && <p className="py-16 text-center text-[#183b3b]/60">No scholarships matched those filters.</p>}
      </section>

      {user && <Dashboard />}
      {!configured && <p className="mx-auto max-w-7xl px-6 pb-8 text-sm text-[#183b3b]/55 lg:px-10">Add the public Supabase variables from <code>frontend/.env.local.example</code> to enable Google sign-in.</p>}
      <footer id="about" className="border-t border-[#183b3b]/10 px-6 py-8 text-sm text-[#183b3b]/60 lg:px-10"><div className="mx-auto flex max-w-7xl justify-between gap-5"><span>Scholarships, made easier to find.</span><span>Built for students.</span></div></footer>

      {selected && <div className="fixed inset-0 z-10 flex items-end justify-center bg-[#183b3b]/40 p-4 sm:items-center" role="presentation" onClick={() => setSelected(null)}><div role="dialog" aria-modal="true" aria-labelledby="scholarship-title" className="w-full max-w-lg rounded-2xl bg-[#fffdf8] p-7 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-5"><div><p className="text-sm font-semibold text-[#e36f42]">{selected.provider}</p><h2 id="scholarship-title" className="mt-2 text-3xl font-semibold">{selected.name}</h2></div><button aria-label="Close details" onClick={() => setSelected(null)} className="text-2xl leading-none text-[#183b3b]/50 hover:text-[#183b3b]">&times;</button></div><p className="mt-6 leading-7 text-[#183b3b]/75">{selected.description}</p><dl className="mt-7 grid grid-cols-2 gap-5 border-y border-[#183b3b]/10 py-5 text-sm"><div><dt className="text-[#183b3b]/50">Award</dt><dd className="mt-1 font-semibold">{formatAmount(selected.amount)}</dd></div><div><dt className="text-[#183b3b]/50">Deadline</dt><dd className="mt-1 font-semibold">{formatDeadline(selected.deadline)}</dd></div><div><dt className="text-[#183b3b]/50">Course</dt><dd className="mt-1 font-semibold">{selected.course ?? "All courses"}</dd></div><div><dt className="text-[#183b3b]/50">Location</dt><dd className="mt-1 font-semibold">{selected.state ?? "All states"}</dd></div></dl>{selected.applicationUrl && <a className="mt-6 inline-flex rounded-xl bg-[#e36f42] px-5 py-3 font-semibold text-white hover:bg-[#c8552c]" href={selected.applicationUrl} target="_blank" rel="noreferrer">Visit application site</a>}</div></div>}
    </main>
  );
}
