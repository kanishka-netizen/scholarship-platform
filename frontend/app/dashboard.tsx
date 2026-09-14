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
  source?: string | null;
  verified?: boolean;
  active?: boolean;
};

type ScholarshipResponse = {
  data: Scholarship[];
};

type SavedScholarship = {
  id: string;
  notes?: string | null;
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
  referenceNo?: string | null;
  submissionDate?: string | null;
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
  failedReasons?: string[];
};

type DocumentRecord = {
  id: string;
  name: string;
  type: string;
  url: string;
  expiryDate?: string | null;
};

type ScholarshipForm = {
  name: string;
  provider: string;
  description: string;
  amount: string;
  deadline: string;
  course: string;
  state: string;
  applicationUrl: string;
  verified: boolean;
  active: boolean;
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

const emptyScholarshipForm: ScholarshipForm = {
  name: "",
  provider: "",
  description: "",
  amount: "",
  deadline: "",
  course: "",
  state: "",
  applicationUrl: "",
  verified: false,
  active: true,
};

const applicationStatuses = [
  "NOT_STARTED",
  "APPLICATION_STARTED",
  "DOCUMENTS_PENDING",
  "READY_TO_SUBMIT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
] as const;

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

function toDateInput(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

function toOptionalNumber(value: unknown) {
  if (value === "" || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function optionalNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

function optionalText(value: string) {
  return value.trim() === "" ? undefined : value.trim();
}

export function Dashboard() {
  const { session, prismaUser, refreshPrismaUser } = useAuth();

  const [tab, setTab] = useState<Tab>("scholarships");

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [eligible, setEligible] = useState<EligibleScholarship[]>([]);
  const [eligibilityReady, setEligibilityReady] = useState(true);
  const [saved, setSaved] = useState<SavedScholarship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  const [profile, setProfile] = useState<StudentProfile>({
    ...emptyProfile,
    ...prismaUser?.profile,
  });

  const [scholarshipForm, setScholarshipForm] = useState(emptyScholarshipForm);
  const [editingScholarshipId, setEditingScholarshipId] = useState<string | null>(
    null,
  );
  const [saveScholarshipId, setSaveScholarshipId] = useState("");
  const [saveNotes, setSaveNotes] = useState("");
  const [applicationScholarshipId, setApplicationScholarshipId] = useState("");
  const [applicationNotes, setApplicationNotes] = useState("");
  const [documentType, setDocumentType] = useState("Identity document");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const token = session?.access_token;
  const userId = prismaUser?.id;
  const isAdmin = prismaUser?.role === "ADMIN";

  async function loadTab(nextTab = tab) {
    if (!token || !userId) return;

    const path = `/users/${userId}`;

    try {
      if (nextTab === "scholarships" || nextTab === "saved" || nextTab === "applications") {
        const result = await apiFetch<ScholarshipResponse>(
          "/scholarships?limit=48",
          token,
        );
        setScholarships(result.data);
      }

      if (nextTab === "eligibility") {
        const result = await apiFetch<{
          data: EligibleScholarship[];
          profileComplete?: boolean;
        }>(`${path}/eligible-scholarships`, token);
        setEligible(result.data);
        setEligibilityReady(result.profileComplete !== false);
      }

      if (nextTab === "saved" || nextTab === "scholarships") {
        setSaved(await apiFetch<SavedScholarship[]>(`${path}/saved`, token));
      }

      if (nextTab === "applications") {
        setApplications(
          await apiFetch<Application[]>(`${path}/applications`, token),
        );
      }

      if (nextTab === "documents") {
        setDocuments(
          await apiFetch<DocumentRecord[]>(`${path}/documents`, token),
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load this section",
      );
    }
  }

  useEffect(() => {
    if (!token || !userId) return;
    void loadTab(tab);
  }, [tab, token, userId]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !userId) return;

    setBusy(true);

    try {
      const numericProfile = {
        ...profile,
        yearOfStudy: toOptionalNumber(profile.yearOfStudy),
        semester: toOptionalNumber(profile.semester),
        currentPercentage: toOptionalNumber(profile.currentPercentage),
        currentCGPA: toOptionalNumber(profile.currentCGPA),
        annualFamilyIncome: toOptionalNumber(profile.annualFamilyIncome),
      };

      await apiFetch(`/users/${userId}/profile`, token, {
        method: "POST",
        body: JSON.stringify(numericProfile),
      });
      await refreshPrismaUser();
      setMessage("Profile saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save profile");
    } finally {
      setBusy(false);
    }
  }

  function scholarshipPayload() {
    return {
      name: scholarshipForm.name.trim(),
      provider: scholarshipForm.provider.trim(),
      description: optionalText(scholarshipForm.description),
      amount: optionalNumber(scholarshipForm.amount),
      deadline: optionalText(scholarshipForm.deadline),
      course: optionalText(scholarshipForm.course),
      state: optionalText(scholarshipForm.state),
      applicationUrl: optionalText(scholarshipForm.applicationUrl),
      verified: scholarshipForm.verified,
      active: scholarshipForm.active,
    };
  }

  async function submitScholarship(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    setBusy(true);

    try {
      if (editingScholarshipId) {
        await apiFetch(`/scholarships/${editingScholarshipId}`, token, {
          method: "PATCH",
          body: JSON.stringify(scholarshipPayload()),
        });
        setMessage("Scholarship updated.");
      } else {
        await apiFetch("/scholarships", token, {
          method: "POST",
          body: JSON.stringify(scholarshipPayload()),
        });
        setMessage("Scholarship created.");
      }

      setScholarshipForm(emptyScholarshipForm);
      setEditingScholarshipId(null);
      await loadTab("scholarships");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save scholarship",
      );
    } finally {
      setBusy(false);
    }
  }

  function editScholarship(scholarship: Scholarship) {
    setEditingScholarshipId(scholarship.id);
    setScholarshipForm({
      name: scholarship.name,
      provider: scholarship.provider,
      description: scholarship.description ?? "",
      amount: scholarship.amount == null ? "" : String(scholarship.amount),
      deadline: toDateInput(scholarship.deadline),
      course: scholarship.course ?? "",
      state: scholarship.state ?? "",
      applicationUrl: scholarship.applicationUrl ?? "",
      verified: Boolean(scholarship.verified),
      active: scholarship.active !== false,
    });
  }

  async function deleteScholarship(id: string) {
    if (!token) return;

    try {
      await apiFetch(`/scholarships/${id}`, token, { method: "DELETE" });
      if (editingScholarshipId === id) {
        setEditingScholarshipId(null);
        setScholarshipForm(emptyScholarshipForm);
      }
      setMessage("Scholarship deleted.");
      await loadTab("scholarships");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not delete scholarship",
      );
    }
  }

  async function saveScholarship(id: string, notes?: string) {
    if (!token || !userId) return;

    try {
      const record = await apiFetch<SavedScholarship>(
        `/users/${userId}/saved/${id}`,
        token,
        {
          method: "POST",
          body: JSON.stringify(notes !== undefined ? { notes } : {}),
        },
      );
      setSaved((items) => {
        const without = items.filter((item) => item.scholarship.id !== id);
        return [record, ...without];
      });
      setMessage("Scholarship saved.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save scholarship",
      );
    }
  }

  async function addSaved(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!saveScholarshipId) return;
    await saveScholarship(saveScholarshipId, saveNotes);
    setSaveScholarshipId("");
    setSaveNotes("");
    setTab("saved");
  }

  async function updateSavedNotes(id: string, notes: string) {
    if (!token || !userId) return;

    try {
      const updated = await apiFetch<SavedScholarship>(
        `/users/${userId}/saved/${id}`,
        token,
        {
          method: "PATCH",
          body: JSON.stringify({ notes }),
        },
      );
      setSaved((items) =>
        items.map((item) =>
          item.scholarship.id === id ? updated : item,
        ),
      );
      setMessage("Saved scholarship updated.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update saved scholarship",
      );
    }
  }

  async function removeSaved(id: string) {
    if (!token || !userId) return;

    try {
      await apiFetch(`/users/${userId}/saved/${id}`, token, {
        method: "DELETE",
      });
      setSaved((items) => items.filter((item) => item.scholarship.id !== id));
      setMessage("Saved scholarship removed.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not remove saved scholarship",
      );
    }
  }

  async function startApplication(
    event?: FormEvent<HTMLFormElement>,
    scholarshipId = applicationScholarshipId,
    notes = applicationNotes,
  ) {
    event?.preventDefault();
    if (!token || !userId || !scholarshipId) return;

    setBusy(true);

    try {
      const record = await apiFetch<Application>(
        `/users/${userId}/applications`,
        token,
        {
          method: "POST",
          body: JSON.stringify({
            scholarshipId,
            notes: optionalText(notes),
          }),
        },
      );
      setApplications((items) => [record, ...items]);
      setApplicationScholarshipId("");
      setApplicationNotes("");
      setMessage("Application tracker entry created.");
      setTab("applications");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not create application",
      );
    } finally {
      setBusy(false);
    }
  }

  async function updateApplication(
    id: string,
    data: { status?: string; notes?: string; referenceNo?: string },
  ) {
    if (!token || !userId) return;

    try {
      const updated = await apiFetch<Application>(
        `/users/${userId}/applications/${id}`,
        token,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
      );
      setApplications((items) =>
        items.map((item) => (item.id === id ? updated : item)),
      );
      setMessage("Application updated.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update application",
      );
    }
  }

  async function deleteApplication(id: string) {
    if (!token || !userId) return;

    try {
      await apiFetch(`/users/${userId}/applications/${id}`, token, {
        method: "DELETE",
      });
      setApplications((items) => items.filter((item) => item.id !== id));
      setMessage("Application deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not delete application",
      );
    }
  }

  async function uploadDocument(event: FormEvent<HTMLFormElement>) {
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
        { method: "POST", body: formData },
      );
      setDocuments((items) => [record, ...items]);
      setDocumentFile(null);
      setMessage("Document uploaded.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not upload document",
      );
    } finally {
      setBusy(false);
    }
  }

  async function deleteDocument(id: string) {
    if (!token || !userId) return;

    await apiFetch(`/users/${userId}/documents/${id}`, token, {
      method: "DELETE",
    });
    setDocuments((items) => items.filter((item) => item.id !== id));
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

  const savedIds = new Set(saved.map((item) => item.scholarship.id));
  const fieldClass =
    "mt-2 h-11 w-full rounded-xl border border-[#183b3b]/20 bg-white px-3 font-normal outline-none focus:border-[#e36f42]";

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
            {isAdmin ? "Admin dashboard" : "Private student dashboard"}
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
            {isAdmin && (
              <form
                onSubmit={submitScholarship}
                className="mb-8 grid gap-4 rounded-2xl border border-[#183b3b]/12 bg-white p-5 md:grid-cols-2"
              >
                <h3 className="text-lg font-semibold md:col-span-2">
                  {editingScholarshipId ? "Edit scholarship" : "Create scholarship"}
                </h3>
                {(
                  [
                    ["name", "Name"],
                    ["provider", "Provider"],
                    ["amount", "Amount"],
                    ["deadline", "Deadline"],
                    ["course", "Course"],
                    ["state", "State"],
                    ["applicationUrl", "Application URL"],
                  ] as const
                ).map(([field, label]) => (
                  <label key={field} className="text-sm font-semibold">
                    {label}
                    <input
                      required={field === "name" || field === "provider"}
                      type={
                        field === "amount"
                          ? "number"
                          : field === "deadline"
                            ? "date"
                            : "text"
                      }
                      value={scholarshipForm[field]}
                      onChange={(event) =>
                        setScholarshipForm({
                          ...scholarshipForm,
                          [field]: event.target.value,
                        })
                      }
                      className={fieldClass}
                    />
                  </label>
                ))}
                <label className="text-sm font-semibold md:col-span-2">
                  Description
                  <textarea
                    value={scholarshipForm.description}
                    onChange={(event) =>
                      setScholarshipForm({
                        ...scholarshipForm,
                        description: event.target.value,
                      })
                    }
                    className="mt-2 min-h-24 w-full rounded-xl border border-[#183b3b]/20 bg-white p-3 font-normal outline-none focus:border-[#e36f42]"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={scholarshipForm.verified}
                    onChange={(event) =>
                      setScholarshipForm({
                        ...scholarshipForm,
                        verified: event.target.checked,
                      })
                    }
                  />
                  Verified
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={scholarshipForm.active}
                    onChange={(event) =>
                      setScholarshipForm({
                        ...scholarshipForm,
                        active: event.target.checked,
                      })
                    }
                  />
                  Active
                </label>
                <div className="flex gap-3 md:col-span-2">
                  <button
                    disabled={busy}
                    className="rounded-xl bg-[#e36f42] px-5 py-3 font-semibold text-white disabled:opacity-50"
                    type="submit"
                  >
                    {editingScholarshipId ? "Update scholarship" : "Create scholarship"}
                  </button>
                  {editingScholarshipId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingScholarshipId(null);
                        setScholarshipForm(emptyScholarshipForm);
                      }}
                      className="rounded-xl border border-[#183b3b]/20 px-5 py-3 font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            {scholarships.length === 0 ? (
              <p className="text-[#183b3b]/60">No scholarships found.</p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {scholarships.map((scholarship) => (
                  <article
                    key={scholarship.id}
                    className="flex flex-col rounded-2xl border border-[#183b3b]/12 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{scholarship.name}</h3>
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
                      <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#183b3b]/70">
                        {scholarship.description}
                      </p>
                    )}
                    <div className="mt-5 space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Amount:</span>{" "}
                        {amountLabel(scholarship.amount)}
                      </p>
                      <p>
                        <span className="font-semibold">Deadline:</span>{" "}
                        {dateLabel(scholarship.deadline)}
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          void saveScholarship(scholarship.id)
                        }
                        className="rounded-xl border border-[#183b3b]/20 px-4 py-2 text-sm font-semibold"
                      >
                        {savedIds.has(scholarship.id) ? "Saved" : "Save"}
                      </button>
                      <button
                        onClick={() =>
                          void startApplication(undefined, scholarship.id)
                        }
                        className="rounded-xl border border-[#183b3b]/20 px-4 py-2 text-sm font-semibold"
                      >
                        Track
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => editScholarship(scholarship)}
                            className="rounded-xl border border-[#183b3b]/20 px-4 py-2 text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => void deleteScholarship(scholarship.id)}
                            className="rounded-xl px-4 py-2 text-sm font-semibold text-[#e36f42]"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "profile" && (
          <form onSubmit={saveProfile} className="grid gap-4 md:grid-cols-2">
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
              <label key={field} className="text-sm font-semibold capitalize">
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
                        event.target.value === "" ? null : event.target.value,
                    })
                  }
                  className={fieldClass}
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
          <div>
            {!eligibilityReady ? (
              <p className="text-[#183b3b]/60">
                Save your profile first so we can match scholarships to your
                state, course, and family income.
              </p>
            ) : eligible.length === 0 ? (
              <p className="text-[#183b3b]/60">
                No eligible scholarships found yet. Add more profile details to
                improve matching.
              </p>
            ) : (
              <>
                <p className="mb-5 text-sm text-[#183b3b]/60">
                  {eligible.length} scholarship
                  {eligible.length === 1 ? "" : "s"} match your profile.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {eligible.map((item) => (
                    <article
                      key={item.scholarship.id}
                      className="rounded-2xl border border-[#183b3b]/12 bg-white p-5"
                    >
                      <div className="flex justify-between gap-4">
                        <h3 className="font-semibold">{item.scholarship.name}</h3>
                        <span className="text-sm font-bold text-[#e36f42]">
                          Eligible
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#183b3b]/60">
                        {item.scholarship.provider} ·{" "}
                        {amountLabel(item.scholarship.amount)} · Deadline{" "}
                        {dateLabel(item.scholarship.deadline)}
                      </p>
                      <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-[#183b3b]/70">
                        {item.reasons.map((reason, index) => (
                          <li key={`${reason}-${index}`}>{reason}</li>
                        ))}
                      </ul>
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() =>
                            void saveScholarship(item.scholarship.id)
                          }
                          className="text-sm font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() =>
                            void startApplication(
                              undefined,
                              item.scholarship.id,
                            )
                          }
                          className="text-sm font-semibold text-[#e36f42]"
                        >
                          Track
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === "saved" && (
          <div>
            <form
              onSubmit={addSaved}
              className="mb-6 grid gap-3 rounded-2xl border border-[#183b3b]/12 bg-white p-5 md:grid-cols-[2fr_2fr_auto]"
            >
              <label className="text-sm font-semibold">
                Scholarship
                <select
                  required
                  value={saveScholarshipId}
                  onChange={(event) => setSaveScholarshipId(event.target.value)}
                  className={fieldClass}
                >
                  <option value="">Select a scholarship</option>
                  {scholarships.map((scholarship) => (
                    <option key={scholarship.id} value={scholarship.id}>
                      {scholarship.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Notes
                <input
                  value={saveNotes}
                  onChange={(event) => setSaveNotes(event.target.value)}
                  placeholder="Why you saved this"
                  className={fieldClass}
                />
              </label>
              <button
                className="self-end rounded-xl bg-[#e36f42] px-5 py-3 font-semibold text-white"
                type="submit"
              >
                Save
              </button>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
              {saved.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#183b3b]/12 bg-white p-5"
                >
                  <h3 className="font-semibold">{item.scholarship.name}</h3>
                  <p className="mt-1 text-sm text-[#183b3b]/60">
                    {item.scholarship.provider} · {dateLabel(item.scholarship.deadline)}
                  </p>
                  <label className="mt-4 block text-sm font-semibold">
                    Notes
                    <textarea
                      defaultValue={item.notes ?? ""}
                      onBlur={(event) => {
                        if (event.target.value !== (item.notes ?? "")) {
                          void updateSavedNotes(item.scholarship.id, event.target.value);
                        }
                      }}
                      className="mt-2 min-h-20 w-full rounded-xl border border-[#183b3b]/20 bg-white p-3 font-normal"
                    />
                  </label>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() =>
                        void startApplication(undefined, item.scholarship.id, item.notes ?? "")
                      }
                      className="text-sm font-semibold"
                    >
                      Track
                    </button>
                    <button
                      onClick={() => void removeSaved(item.scholarship.id)}
                      className="text-sm font-semibold text-[#e36f42]"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {saved.length === 0 && (
              <p className="text-[#183b3b]/60">You have not saved any scholarships yet.</p>
            )}
          </div>
        )}

        {tab === "applications" && (
          <div>
            <form
              onSubmit={startApplication}
              className="mb-6 grid gap-3 rounded-2xl border border-[#183b3b]/12 bg-white p-5 md:grid-cols-[2fr_2fr_auto]"
            >
              <label className="text-sm font-semibold">
                Scholarship
                <select
                  required
                  value={applicationScholarshipId}
                  onChange={(event) =>
                    setApplicationScholarshipId(event.target.value)
                  }
                  className={fieldClass}
                >
                  <option value="">Select a scholarship to track</option>
                  {scholarships.map((scholarship) => (
                    <option key={scholarship.id} value={scholarship.id}>
                      {scholarship.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Notes
                <input
                  value={applicationNotes}
                  onChange={(event) => setApplicationNotes(event.target.value)}
                  placeholder="Documents needed, portal login, ..."
                  className={fieldClass}
                />
              </label>
              <button
                disabled={busy}
                className="self-end rounded-xl bg-[#e36f42] px-5 py-3 font-semibold text-white disabled:opacity-50"
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
                  <h3 className="font-semibold">{item.scholarship.name}</h3>
                  <p className="mt-1 text-sm text-[#183b3b]/60">
                    {item.scholarship.provider}
                  </p>
                  <label className="mt-4 block text-sm font-semibold">
                    Status
                    <select
                      value={item.status}
                      onChange={(event) =>
                        void updateApplication(item.id, {
                          status: event.target.value,
                        })
                      }
                      className="mt-2 h-10 w-full rounded-xl border border-[#183b3b]/20 bg-white px-3 font-normal"
                    >
                      {applicationStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                  <label className="mt-4 block text-sm font-semibold">
                    Reference number
                    <input
                      defaultValue={item.referenceNo ?? ""}
                      onBlur={(event) => {
                        if (event.target.value !== (item.referenceNo ?? "")) {
                          void updateApplication(item.id, {
                            referenceNo: event.target.value,
                          });
                        }
                      }}
                      className={fieldClass}
                    />
                  </label>
                  <label className="mt-4 block text-sm font-semibold">
                    Notes
                    <textarea
                      defaultValue={item.notes ?? ""}
                      onBlur={(event) => {
                        if (event.target.value !== (item.notes ?? "")) {
                          void updateApplication(item.id, {
                            notes: event.target.value,
                          });
                        }
                      }}
                      className="mt-2 min-h-20 w-full rounded-xl border border-[#183b3b]/20 bg-white p-3 font-normal"
                    />
                  </label>
                  <button
                    onClick={() => void deleteApplication(item.id)}
                    className="mt-4 text-sm font-semibold text-[#e36f42]"
                  >
                    Delete
                  </button>
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
                  onChange={(event) => setDocumentType(event.target.value)}
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
                    setDocumentFile(event.target.files?.[0] ?? null)
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
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-1 text-sm text-[#183b3b]/60">
                      {item.type} · Expires {dateLabel(item.expiryDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => void deleteDocument(item.id)}
                    className="text-sm font-semibold text-[#e36f42]"
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
            {documents.length === 0 && (
              <p className="text-[#183b3b]/60">No documents uploaded yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
