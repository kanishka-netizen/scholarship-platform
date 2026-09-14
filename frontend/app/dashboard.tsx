
import { FormEvent, useEffect, useState } from "react";
import { useAuth, type StudentProfile } from "./auth-provider";
import { apiFetch } from "./lib/api";

type Tab =
  | "scholarships"
  | "profile"
  | "eligibility"
  | "saved"
  | "applications"
  | "documents";

type Scholarship = {
  id: string;
  name: string;
  provider: string;
  description?: string | null;
  amount?: number | null;
  startDate?: string | null;
  deadline?: string | null;
  educationLevel?: string | null;
  course?: string | null;
  branch?: string | null;
  state?: string | null;
  incomeLimit?: number | null;
  applicationUrl?: string | null;
  verified?: boolean;
};

type ScholarshipResponse = {
  data: Scholarship[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type SavedScholarship = {
  id: string;
  scholarship: {
    id: string;
    name: string;
    provider: string;
    deadline?: string | null;
  };
};

type Application = {
  id: string;
  status: string;
  notes?: string | null;
  scholarship: {
    id: string;
    name: string;
    provider: string;
  };
};

type EligibleScholarship = {
  scholarship: {
    id: string;
    name: string;
    provider: string;
    amount?: number | null;
    deadline?: string | null;
  };
  reasons: string[];
};

type DocumentRecord = {
  id: string;
  name: string;
  type: string;
  url: string;
  expiryDate?: string | null;
};

const emptyProfile: StudentProfile = {
  state: "",
  district: "",
  college: "",
  course: "",
  branch: "",
  yearOfStudy: null,
  semester: null,
  currentPercentage: null,
  currentCGPA: null,
  annualFamilyIncome: null,
  category: "",
  additionalInfo: "",
};

function dateLabel(value?: string | null) {
  return value
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Not listed";
}

function amountLabel(value?: number | null) {
  if (value == null) return "Amount not listed";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function Dashboard() {
  const { session, prismaUser, refreshPrismaUser } = useAuth();

  const [tab, setTab] = useState<Tab>("scholarships");

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [eligible, setEligible] = useState<EligibleScholarship[]>([]);
  const [saved, setSaved] = useState<SavedScholarship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  const [profile, setProfile] = useState<StudentProfile>({
    ...emptyProfile,
    ...prismaUser?.profile,
  });

  const [applicationScholarshipId, setApplicationScholarshipId] =
    useState("");
  const [documentType, setDocumentType] = useState("Identity document");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const token = session?.access_token;
  const userId = prismaUser?.id;

  useEffect(() => {
    if (!token || !userId) return;

    const path = `/users/${userId}`;

    const load = async () => {
      try {
        if (tab === "scholarships") {
          const result = await apiFetch<ScholarshipResponse>(
            "/scholarships",
            token,
          );

          setScholarships(result.data);
        }

        if (tab === "eligibility") {
          const result = await apiFetch<{
            data: EligibleScholarship[];
          }>(`${path}/eligible-scholarships`, token);

          setEligible(result.data);
        }

        if (tab === "saved") {
          setSaved(
            await apiFetch<SavedScholarship[]>(`${path}/saved`, token),
          );
        }

        if (tab === "applications") {
          setApplications(
            await apiFetch<Application[]>(
              `${path}/applications`,
              token,
            ),
          );
        }

        if (tab === "documents") {
          setDocuments(
            await apiFetch<DocumentRecord[]>(
              `${path}/documents`,
              token,
            ),
          );
        }
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Could not load this section",
        );
      }
    };

    void load();
  }, [tab, token, userId]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !userId) return;

    setBusy(true);

    try {
      await apiFetch(`/users/${userId}/profile`, token, {
        method: "POST",
        body: JSON.stringify(profile),
      });

      await refreshPrismaUser();
      setMessage("Profile saved.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save profile",
      );
    } finally {
      setBusy(false);
    }
  }

  async function saveScholarship(id: string) {
    if (!token || !userId) return;

    try {
      await apiFetch(`/users/${userId}/saved/${id}`, token, {
        method: "POST",
      });

      setMessage("Scholarship saved.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save scholarship",
      );
    }
  }

  async function removeSaved(id: string) {
    if (!token || !userId) return;

    await apiFetch(`/users/${userId}/saved/${id}`, token, {
      method: "DELETE",
    });

    setSaved((items) =>
      items.filter((item) => item.scholarship.id !== id),
    );
  }

  async function startApplication(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token || !userId || !applicationScholarshipId) return;

    setBusy(true);

    try {
      await apiFetch(`/users/${userId}/applications`, token, {
        method: "POST",
        body: JSON.stringify({
          scholarshipId: applicationScholarshipId,
        }),
      });

      setApplicationScholarshipId("");
      setMessage("Application tracker entry created.");
      setTab("applications");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not create application",
      );
    } finally {
      setBusy(false);
    }
  }

  async function updateApplication(id: string, status: string) {
    if (!token || !userId) return;

    const updated = await apiFetch<Application>(
      `/users/${userId}/applications/${id}`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    );

    setApplications((items) =>
      items.map((item) => (item.id === id ? updated : item)),
    );
  }

  async function uploadDocument(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token || !userId || !documentFile) return;

    setBusy(true);

    try {
      const formData = new FormData();

      formData.append("file", documentFile);
      formData.append("type", documentType);

      const record = await apiFetch<DocumentRecord>(
        `/users/${userId}/documents/upload`,
        token,
        {
          method: "POST",
          body: formData,
        },
      );

      setDocuments((items) => [record, ...items]);
      setDocumentFile(null);
      setMessage("Document uploaded.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not upload document",
      );
    } finally {
      setBusy(false);
    }
  }

  async function deleteDocument(id: string) {
    if (!token || !userId) return;

    await apiFetch(
      `/users/${userId}/documents/${id}`,
      token,
      { method: "DELETE" },
    );

    setDocuments((items) =>
      items.filter((item) => item.id !== id),
    );
  }

  if (!token || !userId) return null;

  const tabs: Array<[Tab, string]> = [
    ["scholarships", "Scholarships"],
    ["profile", "Profile"],
    ["eligibility", "Eligibility"],
    ["saved", "Saved"],
    ["applications", "Applications"],
    ["documents", "Documents"],
  ];

  return (
    <section
      id="dashboard"
      className="border-t border-[#183b3b]/10 bg-[#fffdf8] px-6 py-14 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e36f42]">
              Your workspace
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              Welcome, {prismaUser.name ?? prismaUser.email}
            </h2>
          </div>

          <p className="text-sm text-[#183b3b]/60">
            Private student dashboard
          </p>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-[#183b3b]/10 pb-px">
          {tabs.map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold ${
                tab === value
                  ? "border-[#e36f42] text-[#e36f42]"
                  : "border-transparent text-[#183b3b]/55"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {message && (
          <p className="mb-6 rounded-xl bg-[#dce8d5] px-4 py-3 text-sm">
            {message}
          </p>
        )}

        {tab === "scholarships" && (
          <div>
            {scholarships.length === 0 ? (
              <p className="text-[#183b3b]/60">
                No scholarships found.
              </p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {scholarships.map((scholarship) => (
                  <article
                    key={scholarship.id}
                    className="flex flex-col rounded-2xl border border-[#183b3b]/12 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {scholarship.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#183b3b]/60">
                          {scholarship.provider}
                        </p>
                      </div>

                      {scholarship.verified && (
                        <span className="rounded-full bg-[#dce8d5] px-2.5 py-1 text-xs font-semibold">
                          Verified
                        </span>
                      )}
                    </div>

                    {scholarship.description && (
                      <p className="mt-4 text-sm leading-6 text-[#183b3b]/70">
                        {scholarship.description}
                      </p>
                    )}

                    <div className="mt-5 space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">
                          Amount:
                        </span>{" "}
                        {amountLabel(scholarship.amount)}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Deadline:
                        </span>{" "}
                        {dateLabel(scholarship.deadline)}
                      </p>

                      {scholarship.course && (
                        <p>
                          <span className="font-semibold">
                            Course:
                          </span>{" "}
                          {scholarship.course}
                        </p>
                      )}

                      {scholarship.branch && (
                        <p>
                          <span className="font-semibold">
                            Branch:
                          </span>{" "}
                          {scholarship.branch}
                        </p>
                      )}

                      {scholarship.state && (
                        <p>
                          <span className="font-semibold">
                            State:
                          </span>{" "}
                          {scholarship.state}
                        </p>
                      )}

                      {scholarship.incomeLimit != null && (
                        <p>
                          <span className="font-semibold">
                            Income limit:
                          </span>{" "}
                          {amountLabel(scholarship.incomeLimit)}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() =>
                          void saveScholarship(scholarship.id)
                        }
                        className="rounded-xl border border-[#183b3b]/20 px-4 py-2 text-sm font-semibold"
                      >
                        Save
                      </button>

                      {scholarship.applicationUrl && (
                        <a
                          href={scholarship.applicationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl bg-[#e36f42] px-4 py-2 text-sm font-semibold text-white"
                        >
                          Apply
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "profile" && (
          <form
            onSubmit={saveProfile}
            className="grid gap-4 md:grid-cols-2"
          >
            {(
              [
                "college",
                "course",
                "branch",
                "state",
                "district",
                "category",
                "yearOfStudy",
                "semester",
                "currentPercentage",
                "currentCGPA",
                "annualFamilyIncome",
              ] as const
            ).map((field) => (
              <label
                key={field}
                className="text-sm font-semibold capitalize"
              >
                {field.replace(/[A-Z]/g, (letter) => ` ${letter}`)}

                <input
                  type={
                    field.includes("year") ||
                    field.includes("semester") ||
                    field.includes("Percentage") ||
                    field.includes("CGPA") ||
                    field.includes("Income")
                      ? "number"
                      : "text"
                  }
                  value={profile[field] ?? ""}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      [field]:
                        event.target.value === ""
                          ? null
                          : event.target.value,
                    })
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-[#183b3b]/20 bg-white px-3 font-normal outline-none focus:border-[#e36f42]"
                />
              </label>
            ))}

            <label className="text-sm font-semibold md:col-span-2">
              Additional information

              <textarea
                value={profile.additionalInfo ?? ""}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    additionalInfo: event.target.value,
                  })
                }
                className="mt-2 min-h-24 w-full rounded-xl border border-[#183b3b]/20 bg-white p-3 font-normal outline-none focus:border-[#e36f42]"
              />
            </label>

            <button
              disabled={busy}
              className="w-fit rounded-xl bg-[#e36f42] px-5 py-3 font-semibold text-white disabled:opacity-50"
              type="submit"
            >
              {busy ? "Saving..." : "Save profile"}
            </button>
          </form>
        )}

        {tab === "eligibility" && (
          <div className="grid gap-4 md:grid-cols-2">
            {eligible.map((item) => (
              <article
                key={item.scholarship.id}
                className="rounded-2xl border border-[#183b3b]/12 bg-white p-5"
              >
                <div className="flex justify-between gap-4">
                  <h3 className="font-semibold">
                    {item.scholarship.name}
                  </h3>

                  <span className="text-sm font-bold text-[#e36f42]">
                    Eligible
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#183b3b]/60">
                  {item.scholarship.provider} · Deadline{" "}
                  {dateLabel(item.scholarship.deadline)}
                </p>

                <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-[#183b3b]/70">
                  {item.reasons.map((reason, index) => (
                    <li key={`${reason}-${index}`}>
                      {reason}
                    </li>
                  ))}
                </ul>
              </article>
            ))}

            {eligible.length === 0 && (
              <p className="text-[#183b3b]/60">
                No eligible scholarships found. Complete your
                profile to improve matching.
              </p>
            )}
          </div>
        )}

        {tab === "saved" && (
          <div className="grid gap-4 md:grid-cols-2">
            {saved.map((item) => (
              <article
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#183b3b]/12 bg-white p-5"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.scholarship.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#183b3b]/60">
                    {item.scholarship.provider} ·{" "}
                    {dateLabel(item.scholarship.deadline)}
                  </p>
                </div>

                <button
                  onClick={() =>
                    void removeSaved(item.scholarship.id)
                  }
                  className="text-sm font-semibold text-[#e36f42]"
                >
                  Remove
                </button>
              </article>
            ))}

            {saved.length === 0 && (
              <p className="text-[#183b3b]/60">
                You have not saved any scholarships yet.
              </p>
            )}
          </div>
        )}

        {tab === "applications" && (
          <div>
            <form
              onSubmit={startApplication}
              className="mb-6 flex flex-wrap gap-3"
            >
              <input
                value={applicationScholarshipId}
                onChange={(event) =>
                  setApplicationScholarshipId(event.target.value)
                }
                placeholder="Scholarship ID to track"
                className="h-11 min-w-72 rounded-xl border border-[#183b3b]/20 bg-white px-3 outline-none focus:border-[#e36f42]"
              />

              <button
                disabled={busy}
                className="rounded-xl bg-[#e36f42] px-5 py-2 font-semibold text-white disabled:opacity-50"
                type="submit"
              >
                Track application
              </button>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
              {applications.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#183b3b]/12 bg-white p-5"
                >
                  <h3 className="font-semibold">
                    {item.scholarship.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#183b3b]/60">
                    {item.scholarship.provider}
                  </p>

                  <label className="mt-4 block text-sm font-semibold">
                    Status

                    <select
                      value={item.status}
                      onChange={(event) =>
                        void updateApplication(
                          item.id,
                          event.target.value,
                        )
                      }
                      className="mt-2 h-10 w-full rounded-xl border border-[#183b3b]/20 bg-white px-3 font-normal"
                    >
                      <option>NOT_STARTED</option>
                      <option>APPLICATION_STARTED</option>
                      <option>DOCUMENTS_PENDING</option>
                      <option>READY_TO_SUBMIT</option>
                      <option>SUBMITTED</option>
                      <option>UNDER_REVIEW</option>
                      <option>APPROVED</option>
                      <option>REJECTED</option>
                      <option>EXPIRED</option>
                    </select>
                  </label>
                </article>
              ))}
            </div>

            {applications.length === 0 && (
              <p className="text-[#183b3b]/60">
                No applications are being tracked yet.
              </p>
            )}
          </div>
        )}

        {tab === "documents" && (
          <div>
            <form
              onSubmit={uploadDocument}
              className="mb-8 flex flex-wrap items-end gap-3"
            >
              <label className="text-sm font-semibold">
                Type

                <select
                  value={documentType}
                  onChange={(event) =>
                    setDocumentType(event.target.value)
                  }
                  className="mt-2 block h-11 rounded-xl border border-[#183b3b]/20 bg-white px-3 font-normal"
                >
                  <option>Identity document</option>
                  <option>Income certificate</option>
                  <option>Academic record</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="text-sm font-semibold">
                File

                <input
                  required
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={(event) =>
                    setDocumentFile(
                      event.target.files?.[0] ?? null,
                    )
                  }
                  className="mt-2 block h-11 max-w-full rounded-xl border border-[#183b3b]/20 bg-white px-3 py-2 font-normal"
                />
              </label>

              <button
                disabled={busy || !documentFile}
                className="h-11 rounded-xl bg-[#e36f42] px-5 font-semibold text-white disabled:opacity-50"
                type="submit"
              >
                Upload
              </button>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
              {documents.map((item) => (
                <article
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[#183b3b]/12 bg-white p-5"
                >
                  <div>
                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-[#183b3b]/60">
                      {item.type} · Expires{" "}
                      {dateLabel(item.expiryDate)}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      void deleteDocument(item.id)
                    }
                    className="text-sm font-semibold text-[#e36f42]"
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>

            {documents.length === 0 && (
              <p className="text-[#183b3b]/60">
                No documents uploaded yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}