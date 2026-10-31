# Three-Minute Evaluator Video Demonstration Script
## Course: BACSE344 — Cloud Infrastructure and Architecture (C2 Slot)
### Student Registration Number: `25BCE5822`
### Platform: Scholarship Discovery Platform
### GitHub Repository Branch: `assignment-3` (https://github.com/kanishka-netizen/scholarship-platform/tree/assignment-3)

---

### Timing Breakdown & Slide/Screen Map:
- **0:00 – 0:45 (45s):** Architecture, Peak Demand & Round-Robin Load Balancing (Question 1a & 1b)
- **0:45 – 1:30 (45s):** Container Failure Simulation & Zero-Downtime Failover Tuning (Question 1c)
- **1:30 – 2:15 (45s):** Security Hardening: bcrypt (Cost 12), TOTP MFA & RBAC (Question 2a & 2b)
- **2:15 – 3:00 (45s):** Container Hardening, Trivy Vulnerability Scan & DPDPA/GDPR Compliance (Question 2c & 2d)

---

### [0:00 – 0:45] Phase 1: Architecture, Peak Demand & Round-Robin Load Balancing

**Screen to Show:**
- Architecture Diagram (`test-results/architecture_diagram.png`) showing Nginx (port 8080), 3 backend instances (ports 3001, 3002, 3003), Supabase PostgreSQL, and the Amber Edge Fog / Cloud Bursting tier.
- Terminal showing `curl -i http://localhost:8080/scholarships` returning circular `X-Backend-Instance` headers.

**Spoken Script:**
> *"Hello everyone and respected evaluator. My name is Kanishka, Registration Number **25BCE5822**. Today I am demonstrating the cloud infrastructure, scalability, and application security implementation for our **Scholarship Discovery Platform**.*
>
> *During annual National Scholarship Portal cutoffs, thousands of students simultaneously search for eligibility criteria. A single backend instance quickly saturates its CPU and connection pool.*
>
> *To solve this, we containerized our NestJS backend into three stateless instances behind an Nginx load balancer connected to our live managed Supabase PostgreSQL cloud database.*
>
> *As you can see in the terminal, our custom middleware injects the `X-Backend-Instance` header, proving perfect circular round-robin distribution across `backend-1`, `backend-2`, and `backend-3`.*
>
> *In our 1,000-request k6 load test under 20 concurrent virtual users, scaling from 1 to 3 instances skyrocketed throughput by **+186.8%**—from 26.56 to **76.17 requests per second**—while slashing average latency by **65.2%**, from 745ms down to **259ms** with 0% errors."*

---

### [0:45 – 1:30] Phase 2: Fault Tolerance & Zero-Downtime Failover Simulation

**Screen to Show:**
- Table comparing Default Nginx vs Hardened Nginx Failover.
- Terminal log from `test-results/screenshot_failover.png` (15 failed requests vs 0 failed requests).

**Spoken Script:**
> *"Next is fault tolerance and high availability. To simulate an unexpected container crash, we executed a 600-request load test while executing `docker stop scholarship-backend-2` mid-flight at second 5.*
>
> *Under the default unhardened Nginx configuration with `proxy_next_upstream off`, in-flight requests on that node were dropped immediately, producing **15 HTTP 502 Bad Gateway errors** (a 2.5% failure rate).*
>
> *We then engineered zero-downtime failover tuning using `proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504`, configured with 3 retries and passive health monitoring using `max_fails=2 fail_timeout=5s`.*
>
> *Rerunning the exact same failure simulation, Nginx transparently caught the failing socket connections and rerouted pending requests to the surviving instances within milliseconds. All **600 out of 600 requests succeeded** with **0% failed requests**—guaranteeing 100% continuous availability for students during exam and portal cutoffs."*

---

### [1:30 – 2:15] Phase 3: Sensitive Data Protection, bcrypt, TOTP MFA & RBAC

**Screen to Show:**
- Database output comparing plaintext vs salted bcrypt hash (`test-results/screenshot_db_passwords.png`).
- Terminal test execution of `test-results/screenshot_security_rbac.png` verifying TOTP code setup, QR URL, invalid code rejection, and RBAC 401/403/200 responses.

**Spoken Script:**
> *"Now let's examine application security. In scholarship discovery, student records contain sensitive personal data including family annual income, caste certificates, disability status, and passwords.*
>
> *As demonstrated in our database query, we eliminated vulnerable plaintext storage and implemented salted bcrypt password hashing with a work factor of 12 (4,096 cryptographic rounds) in Supabase. Even in the event of an SQL dump or database compromise, brute force and rainbow table attacks are rendered computationally unfeasible.*
>
> *For identity assurance, we implemented RFC 6238 TOTP Two-Factor Authentication using Speakeasy and QR codes compatible with Google Authenticator and Microsoft Authenticator. Logins with an invalid TOTP code return HTTP 401, while valid tokens succeed.*
>
> *Finally, our NestJS RBAC Guard enforces strict role authorization on scholarship modification endpoints: unauthenticated calls return 401 Unauthorized, authenticated Student tokens attempting to alter awards receive **403 Forbidden**, and only authenticated Admin tokens are authorized with **200 OK**."*

---

### [2:15 – 3:00] Phase 4: Container Hardening, Trivy Vulnerability Scans & Compliance

**Screen to Show:**
- Trivy scan comparison table (`test-results/screenshot_trivy_scan.png`).
- `docker images scholarship-backend` showing 1.13 GB vs 457 MB.
- Final PDF Report (`BACSE344_DA3_Report.pdf`) and GitHub repository link.

**Spoken Script:**
> *"Lastly, container security hardening. We compared an unhardened baseline image against our hardened production container.*
>
> *Our hardened Dockerfile employs a multi-stage build, replaces the bloated Debian Bookworm base with minimal Alpine Linux 3.24, strips build dependencies and cache, and enforces least-privilege execution under low-privilege `USER node` (UID 1000) instead of root.*
>
> *This achieved a **59.5% reduction** in image size, shrinking it from 1.13 GB down to **457 MB**.*
>
> *Running comprehensive vulnerability scans with **Trivy**, the unhardened Debian image suffered from **479 OS vulnerabilities**, including **20 CRITICAL** and **459 HIGH** CVEs. In stark contrast, our hardened Alpine image recorded **ZERO CRITICAL and ZERO HIGH OS vulnerabilities**—a 100% elimination of operating system risk.*
>
> *These controls satisfy India's **DPDPA 2023 Section 8(5)** for reasonable security safeguards and **GDPR Article 32** for resilient processing of student personal data.*
>
> *All code, genuine logs, and our comprehensive evaluation report `BACSE344_DA3_Report.pdf` are committed and pushed to GitHub. Thank you for your time."*
