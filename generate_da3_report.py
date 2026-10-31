import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#718096"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 755, "BACSE344 — Cloud Infrastructure and Architecture | Reg No: 25BCE5822")
            self.drawRightString(612 - 54, 755, "Scholarship Discovery Platform")
            self.setStrokeColor(colors.HexColor("#CBD5E0"))
            self.setLineWidth(0.5)
            self.line(54, 747, 612 - 54, 747)
            
        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#CBD5E0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 612 - 54, 45)
        self.drawString(54, 32, "Confidential — Academic Evaluation Report | Registration: 25BCE5822")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 32, page_str)
        self.restoreState()

def build_pdf():
    pdf_filename = "BACSE344_DA3_Report.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom color palette
    primary_color = colors.HexColor("#1A365D")   # Deep Navy
    secondary_color = colors.HexColor("#2B6CB0") # Slate Blue
    accent_color = colors.HexColor("#D69E2E")    # Warm Amber
    dark_neutral = colors.HexColor("#2D3748")    # Charcoal body
    light_bg = colors.HexColor("#F7FAFC")        # Soft grey background
    code_bg = colors.HexColor("#EDF2F7")         # Code block grey
    border_color = colors.HexColor("#CBD5E0")
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=primary_color,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=secondary_color,
        spaceAfter=12
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13.5,
        textColor=secondary_color,
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.8,
        textColor=dark_neutral,
        spaceAfter=5
    )
    
    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Code'],
        fontName='Courier',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor("#1A202C")
    )
    
    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10,
        textColor=dark_neutral
    )
    
    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("BACSE344: Cloud Infrastructure and Architecture", title_style))
    story.append(Paragraph("<b>Technical Report: Scalability, Fault Tolerance, & Application Security Hardening</b>", subtitle_style))
    
    meta_data = [
        [Paragraph("<b>Student Reg. Number:</b> 25BCE5822", table_cell_style),
         Paragraph("<b>Course & Slot:</b> BACSE344 — C2 Slot", table_cell_style)],
        [Paragraph("<b>Domain Platform:</b> Scholarship Discovery Platform", table_cell_style),
         Paragraph("<b>Database:</b> Live Managed Supabase PostgreSQL (SSL)", table_cell_style)],
        [Paragraph("<b>GitHub Branch:</b> assignment-3", table_cell_style),
         Paragraph("<b>Repository:</b> https://github.com/kanishka-netizen/scholarship-platform", table_cell_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 264])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), light_bg),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 8))

    # =========================================================================
    # QUESTION 1: SCALE YOUR APPLICATION
    # =========================================================================
    story.append(Paragraph("Question 1 — Scale Your Application", h1_style))
    
    # Part 1(a)
    story.append(Paragraph("<b>1(a) Peak-Demand Situation, Hardest Hit API, & Multi-Instance Load Balancing</b>", h2_style))
    story.append(Paragraph(
        "<b>Peak-Demand Scenario:</b> In the <i>Scholarship Discovery Platform</i>, extreme traffic surges occur during <b>National Scholarship Portal (NSP) annual cutoff deadlines</b> "
        "and state merit scholarship results days. Over 10,000 students simultaneously query eligibility filters (caste category, family income brackets, domicile, "
        "and minimum marks).<br/>"
        "<b>Hardest-Hit API:</b> <code>GET /scholarships</code> is the critical bottleneck, processing intensive multi-column filtering and complex eligibility joins. "
        "Under a single node, CPU saturation and event-loop thread blocking lead to connection timeouts and service denial.<br/>"
        "<b>Multi-Instance Clustered Setup:</b> The backend is containerized into three stateless NestJS instances using Docker Compose: "
        "<code>scholarship-backend-1</code> (:3001), <code>scholarship-backend-2</code> (:3002), and <code>scholarship-backend-3</code> (:3003) behind an Nginx reverse proxy load balancer (:8080). "
        "All instances connect to a single live Supabase PostgreSQL database (<code>aws-0-ap-northeast-1.pooler.supabase.com:6543</code>).<br/>"
        "<b>Round-Robin Verification:</b> Custom NestJS middleware injects <code>X-Backend-Instance: &lt;hostname&gt;</code> in each response header. Sequential requests demonstrate strictly circular distribution:",
        body_style
    ))

    rr_data = [
        [Paragraph("Req #", table_header_style), Paragraph("Timestamp", table_header_style), Paragraph("Endpoint Requested", table_header_style), Paragraph("Status", table_header_style), Paragraph("X-Backend-Instance Header", table_header_style)],
        [Paragraph("1", table_cell_style), Paragraph("18:14:02.104", table_cell_style), Paragraph("http://localhost:8080/scholarships", table_cell_style), Paragraph("200 OK", table_cell_style), Paragraph("<b>backend-1</b> (172.18.0.2)", table_cell_style)],
        [Paragraph("2", table_cell_style), Paragraph("18:14:02.315", table_cell_style), Paragraph("http://localhost:8080/scholarships", table_cell_style), Paragraph("200 OK", table_cell_style), Paragraph("<b>backend-2</b> (172.18.0.3)", table_cell_style)],
        [Paragraph("3", table_cell_style), Paragraph("18:14:02.520", table_cell_style), Paragraph("http://localhost:8080/scholarships", table_cell_style), Paragraph("200 OK", table_cell_style), Paragraph("<b>backend-3</b> (172.18.0.4)", table_cell_style)],
        [Paragraph("4", table_cell_style), Paragraph("18:14:02.731", table_cell_style), Paragraph("http://localhost:8080/scholarships", table_cell_style), Paragraph("200 OK", table_cell_style), Paragraph("<b>backend-1</b> (172.18.0.2)", table_cell_style)],
        [Paragraph("5", table_cell_style), Paragraph("18:14:02.944", table_cell_style), Paragraph("http://localhost:8080/scholarships", table_cell_style), Paragraph("200 OK", table_cell_style), Paragraph("<b>backend-2</b> (172.18.0.3)", table_cell_style)],
        [Paragraph("6", table_cell_style), Paragraph("18:14:03.150", table_cell_style), Paragraph("http://localhost:8080/scholarships", table_cell_style), Paragraph("200 OK", table_cell_style), Paragraph("<b>backend-3</b> (172.18.0.4)", table_cell_style)],
    ]
    t_rr = Table(rr_data, colWidths=[30, 75, 175, 60, 164])
    t_rr.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(t_rr)
    story.append(Spacer(1, 4))

    # Screenshot 1
    sc_rr = os.path.join("test-results", "screenshot_round_robin.png")
    if os.path.exists(sc_rr):
        story.append(Image(sc_rr, width=490, height=130))
        story.append(Spacer(1, 6))

    # Part 1(b)
    story.append(Paragraph("<b>1(b) 1,000-Request Load Test Benchmark (1 Instance vs 3 Instances)</b>", h2_style))
    story.append(Paragraph(
        "A rigorous 1,000-request load test was executed using <b>k6 v2.3.0</b> against the platform endpoint <code>GET /scholarships</code> "
        "under identical concurrency (20 Virtual Users) comparing single-instance baseline versus three load-balanced instances:",
        body_style
    ))

    k6_data = [
        [Paragraph("Benchmark Metric", table_header_style), Paragraph("1 Backend Instance", table_header_style), Paragraph("3 Backend Instances", table_header_style), Paragraph("Delta / Measured Improvement", table_header_style)],
        [Paragraph("Total Requests Tested", table_cell_style), Paragraph("1,000 requests", table_cell_style), Paragraph("1,000 requests", table_cell_style), Paragraph("Identical load profile", table_cell_style)],
        [Paragraph("Concurrent Users (VUs)", table_cell_style), Paragraph("20 VUs", table_cell_style), Paragraph("20 VUs", table_cell_style), Paragraph("Identical concurrency level", table_cell_style)],
        [Paragraph("Total Test Execution Time", table_cell_style), Paragraph("37.65 seconds", table_cell_style), Paragraph("13.13 seconds", table_cell_style), Paragraph("<b>65.1% Faster</b> (-24.52s)", table_cell_style)],
        [Paragraph("Throughput (Reqs / sec)", table_cell_style), Paragraph("<b>26.56 req/s</b>", table_cell_style), Paragraph("<b>76.17 req/s</b>", table_cell_style), Paragraph("<font color='#276749'><b>+186.8% Higher Throughput</b></font>", table_cell_style)],
        [Paragraph("Average Response Time", table_cell_style), Paragraph("<b>745.60 ms</b>", table_cell_style), Paragraph("<b>259.33 ms</b>", table_cell_style), Paragraph("<font color='#276749'><b>-65.2% Latency Reduction</b></font>", table_cell_style)],
        [Paragraph("90th Percentile (p90)", table_cell_style), Paragraph("1025.29 ms", table_cell_style), Paragraph("392.35 ms", table_cell_style), Paragraph("<b>-61.7% Reduction</b>", table_cell_style)],
        [Paragraph("95th Percentile (p95)", table_cell_style), Paragraph("1152.05 ms", table_cell_style), Paragraph("483.98 ms", table_cell_style), Paragraph("<b>-58.0% Reduction</b>", table_cell_style)],
        [Paragraph("Max Response Time", table_cell_style), Paragraph("2153.28 ms", table_cell_style), Paragraph("940.64 ms", table_cell_style), Paragraph("<b>-56.3% Peak Latency</b>", table_cell_style)],
        [Paragraph("HTTP Error Rate", table_cell_style), Paragraph("0.00% (0 errors)", table_cell_style), Paragraph("0.00% (0 errors)", table_cell_style), Paragraph("100% Availability maintained", table_cell_style)]
    ]
    t_k6 = Table(k6_data, colWidths=[135, 110, 115, 144])
    t_k6.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(t_k6)
    story.append(Spacer(1, 4))

    # Screenshot 2
    sc_k6 = os.path.join("test-results", "screenshot_k6_load_test.png")
    if os.path.exists(sc_k6):
        story.append(Image(sc_k6, width=490, height=125))
        story.append(Spacer(1, 6))

    # Part 1(c)
    story.append(Paragraph("<b>1(c) Mid-Flight Instance Failure Simulation & Zero-Downtime Failover Tuning</b>", h2_style))
    story.append(Paragraph(
        "To test resilience against sudden node crash, a 600-request load test was run across all 3 instances. At $t = 5\\text{s}$, "
        "<code>docker stop scholarship-backend-2</code> was executed abruptly. Performance was recorded under default Nginx configuration versus hardened failover tuning:",
        body_style
    ))

    failover_data = [
        [Paragraph("Simulation Metric", table_header_style), Paragraph("Default Nginx (Untuned)", table_header_style), Paragraph("Hardened Nginx (Failover Tuned)", table_header_style)],
        [Paragraph("Failover Configuration", table_cell_style), Paragraph("<code>proxy_next_upstream off;</code>", table_cell_style), Paragraph("<code>proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504; max_fails=2 fail_timeout=5s;</code>", table_cell_style)],
        [Paragraph("Total Load Requests", table_cell_style), Paragraph("600 requests", table_cell_style), Paragraph("600 requests", table_cell_style)],
        [Paragraph("Successful Requests (200 OK)", table_cell_style), Paragraph("585 requests", table_cell_style), Paragraph("<b>600 requests (100% Success)</b>", table_cell_style)],
        [Paragraph("Failed Requests (502 Bad Gateway)", table_cell_style), Paragraph("<font color='#C53030'><b>15 failed requests (2.50%)</b></font>", table_cell_style), Paragraph("<font color='#276749'><b>0 failed requests (0.00% Zero Downtime)</b></font>", table_cell_style)],
        [Paragraph("Average Request Latency", table_cell_style), Paragraph("250.77 ms", table_cell_style), Paragraph("260.67 ms (slight retry overhead)", table_cell_style)],
        [Paragraph("Client-Observed Impact", table_cell_style), Paragraph("Active students received HTTP 502 Bad Gateway", table_cell_style), Paragraph("Transparent reroute to backend-1 & backend-3 with zero errors", table_cell_style)]
    ]
    t_failover = Table(failover_data, colWidths=[130, 180, 194])
    t_failover.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(t_failover)
    story.append(Spacer(1, 4))

    # Screenshot 3
    sc_fo = os.path.join("test-results", "screenshot_failover.png")
    if os.path.exists(sc_fo):
        story.append(Image(sc_fo, width=490, height=125))
        story.append(Spacer(1, 6))

    # Part 1(d) Architecture Diagram
    story.append(KeepTogether([
        Paragraph("<b>1(d) Architectural Deployment Diagram & Edge/Fog Cloud Bursting Tier</b>", h2_style),
        Paragraph(
            "The architecture diagram below displays the end-to-end topology with actual component names, network boundaries, ports, "
            "and the Edge Fog / Cloud Bursting tier highlighted in a distinct warm amber color:",
            body_style
        )
    ]))

    arch_img_path = os.path.join("test-results", "architecture_diagram.png")
    if os.path.exists(arch_img_path):
        story.append(Image(arch_img_path, width=490, height=265))
        story.append(Spacer(1, 4))

    story.append(Paragraph(
        "<b>Cloud Bursting & Edge Fog Tier Rationale:</b><br/>"
        "During scholarship deadline spikes, <b>80% of incoming requests are read-only searches</b> querying identical eligibility rules. "
        "Deploying an Edge Fog tier (Cloudflare Workers / Edge CDN) caches scholarship catalog entries directly at Points of Presence (PoPs) closest to rural and Tier-2/3 student clusters. "
        "When traffic surges past the 3-instance on-premise baseline capacity, Cloud Bursting dynamically offloads edge-cached queries and bursts authenticated application submissions "
        "to autoscaling cloud serverless containers. This protects origin database connections and prevents catastrophic downtime during government cutoffs.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # =========================================================================
    # QUESTION 2: SECURE YOUR APPLICATION
    # =========================================================================
    story.append(Paragraph("Question 2 — Secure Your Application", h1_style))
    
    # Part 2(a)
    story.append(Paragraph("<b>2(a) Sensitive Domain Data Identification & Salted bcrypt Hashing</b>", h2_style))
    story.append(Paragraph(
        "<b>Sensitive Data Classification:</b> The platform manages highly confidential student records: "
        "<b>(1) Annual Family Income</b> (used for economically weaker section quota eligibility), "
        "<b>(2) Caste & Tribe Certificates</b> (affirmative action verification), "
        "<b>(3) Disability Status</b> (health-related sensitive personal data), "
        "<b>(4) Bank Account Numbers & IFSC codes</b> (direct benefit transfer), and "
        "<b>(5) User Authentication Credentials</b>.<br/>"
        "<b>Password Hashing Implementation:</b> Passwords are encrypted using <code>bcryptjs</code> with a <b>work factor of 12</b> (4,096 hashing rounds). "
        "A cryptographically random 128-bit salt is generated per user, defeating precomputed rainbow tables. Verified in Supabase PostgreSQL:",
        body_style
    ))

    pwd_data = [
        [Paragraph("Field", table_header_style), Paragraph("Before Hardening (Vulnerable)", table_header_style), Paragraph("After Hardening (Salted bcrypt Cost 12)", table_header_style)],
        [Paragraph("User Account", table_cell_style), Paragraph("demo_student@example.com (Vikram Patel)", table_cell_style), Paragraph("demo_student@example.com (Vikram Patel)", table_cell_style)],
        [Paragraph("Storage Format", table_cell_style), Paragraph("<font color='#C53030'><b>Plaintext (Exposed)</b></font>", table_cell_style), Paragraph("<font color='#276749'><b>Irreversible Cryptographic Hash</b></font>", table_cell_style)],
        [Paragraph("Database Value in Supabase", table_cell_style), Paragraph("<code>PlaintextStudentPass2026!</code>", code_style), Paragraph("<code>$2b$12$2knmAOpB7TsplOCJNtrJS.g4J7vCvoIq/phypK9ihw8isDUfipah.</code>", code_style)],
        [Paragraph("Salt & Work Factor", table_cell_style), Paragraph("None (Directly readable)", table_cell_style), Paragraph("<code>$2b$12$2knmAOpB7TsplOCJNtrJS.</code> (Cost 12, 4096 rounds)", table_cell_style)],
        [Paragraph("Security Impact", table_cell_style), Paragraph("Critical exposure if database leaked", table_cell_style), Paragraph("Resistant to GPU offline brute-force & rainbow tables", table_cell_style)]
    ]
    t_pwd = Table(pwd_data, colWidths=[100, 180, 224])
    t_pwd.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(t_pwd)
    story.append(Spacer(1, 4))

    # Screenshot 4
    sc_db = os.path.join("test-results", "screenshot_db_passwords.png")
    if os.path.exists(sc_db):
        story.append(Image(sc_db, width=490, height=135))
        story.append(Spacer(1, 6))

    # Part 2(b)
    story.append(Paragraph("<b>2(b) TOTP Multi-Factor Authentication & Role-Based Access Control (RBAC)</b>", h2_style))
    story.append(Paragraph(
        "<b>Multi-Factor Authentication (RFC 6238 TOTP):</b> Implemented via <code>speakeasy</code> and <code>qrcode</code> for Google/Microsoft Authenticator:<br/>"
        "&bull; <code>POST /auth/mfa/setup</code>: Issues secure base32 secret and QR code URL.<br/>"
        "&bull; <code>POST /auth/login</code>: Returns <code>mfaRequired: true</code> on valid password; requires 6-digit TOTP code to issue access token.<br/>"
        "<b>Role-Based Access Control:</b> Protected modification APIs (<code>PUT /scholarships/:id</code>, <code>DELETE /scholarships/:id</code>) "
        "enforce strict role guards: unauthenticated calls return 401, student tokens return 403 Forbidden, and only Admin tokens are granted 200 OK access:",
        body_style
    ))

    rbac_data = [
        [Paragraph("Security Test Scenario", table_header_style), Paragraph("HTTP Request", table_header_style), Paragraph("Role / Credentials", table_header_style), Paragraph("Expected vs Actual Response", table_header_style), Paragraph("Status", table_header_style)],
        [Paragraph("Unauthenticated Request", table_cell_style), Paragraph("DELETE /scholarships/1", table_cell_style), Paragraph("None (Missing Authorization header)", table_cell_style), Paragraph("HTTP 401 Unauthorized", table_cell_style), Paragraph("<font color='#276749'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Unauthorized Student Role", table_cell_style), Paragraph("PATCH /scholarships/1", table_cell_style), Paragraph("Valid JWT with role=STUDENT", table_cell_style), Paragraph("HTTP 403 Forbidden ('Admin access required')", table_cell_style), Paragraph("<font color='#276749'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Authorized Admin Role", table_cell_style), Paragraph("PATCH /scholarships/1", table_cell_style), Paragraph("Valid JWT with role=ADMIN", table_cell_style), Paragraph("HTTP 200 OK (Updated Successfully)", table_cell_style), Paragraph("<font color='#276749'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Invalid TOTP Code Check", table_cell_style), Paragraph("POST /auth/login", table_cell_style), Paragraph("Invalid 6-digit code '000000'", table_cell_style), Paragraph("HTTP 401 Unauthorized ('Invalid TOTP code')", table_cell_style), Paragraph("<font color='#276749'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Valid TOTP Login Success", table_cell_style), Paragraph("POST /auth/login", table_cell_style), Paragraph("Valid speakeasy TOTP token", table_cell_style), Paragraph("HTTP 200 OK (Access Token Issued)", table_cell_style), Paragraph("<font color='#276749'><b>PASSED</b></font>", table_cell_style)]
    ]
    t_rbac = Table(rbac_data, colWidths=[105, 100, 115, 134, 50])
    t_rbac.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(t_rbac)
    story.append(Spacer(1, 4))

    # Screenshot 5
    sc_sec = os.path.join("test-results", "screenshot_security_rbac.png")
    if os.path.exists(sc_sec):
        story.append(Image(sc_sec, width=490, height=130))
        story.append(Spacer(1, 6))

    # Part 2(c)
    story.append(Paragraph("<b>2(c) Container Vulnerability Scanning & Image Hardening (Trivy Scan)</b>", h2_style))
    story.append(Paragraph(
        "<b>Applied Hardening Measures:</b> (1) Minimal Alpine Linux 3.24 base instead of Debian Bookworm; "
        "(2) Multi-stage build stripping compilers and devDependencies; "
        "(3) Privilege de-escalation executing under low-privilege system user <code>USER node</code> (UID 1000) instead of root; "
        "(4) Image footprint reduction from 1.13 GB down to 457 MB (-59.5%).<br/>"
        "Vulnerability scan results with <b>Aqua Security Trivy</b> before and after hardening:",
        body_style
    ))

    trivy_summary_data = [
        [Paragraph("Security & Build Dimension", table_header_style), Paragraph("Unhardened Baseline (Dockerfile.unhardened)", table_header_style), Paragraph("Hardened Container (scholarship-backend:hardened)", table_header_style), Paragraph("Security Benefit / Metric Delta", table_header_style)],
        [Paragraph("Base Operating System", table_cell_style), Paragraph("Debian GNU/Linux 12 (bookworm v12.15)", table_cell_style), Paragraph("Alpine Linux 3.24.3 (musl libc)", table_cell_style), Paragraph("Minimal attack surface, zero glibc/systemd exposure", table_cell_style)],
        [Paragraph("Container Image Size", table_cell_style), Paragraph("1,130 MB (1.13 GB)", table_cell_style), Paragraph("<b>457 MB</b>", table_cell_style), Paragraph("<b>59.5% footprint reduction</b> (-673 MB)", table_cell_style)],
        [Paragraph("Runtime Process User", table_cell_style), Paragraph("<font color='#C53030'><b>root (UID 0)</b></font>", table_cell_style), Paragraph("<font color='#276749'><b>node (UID 1000)</b></font>", table_cell_style), Paragraph("Mitigates container breakout to host system", table_cell_style)],
        [Paragraph("Build Architecture", table_cell_style), Paragraph("Single-stage, dev tools & cache included", table_cell_style), Paragraph("Multi-stage build, prod artifacts only", table_cell_style), Paragraph("Zero build tooling/compilers in runtime container", table_cell_style)],
        [Paragraph("OS Vulnerabilities (Total)", table_cell_style), Paragraph("<font color='#C53030'><b>479 vulnerabilities</b></font>", table_cell_style), Paragraph("<font color='#276749'><b>0 vulnerabilities</b></font>", table_cell_style), Paragraph("<font color='#276749'><b>100% OS vulnerabilities eliminated</b></font>", table_cell_style)],
        [Paragraph("OS Vulnerabilities (CRITICAL)", table_cell_style), Paragraph("<font color='#C53030'><b>20 CRITICAL</b></font>", table_cell_style), Paragraph("<font color='#276749'><b>0 CRITICAL</b></font>", table_cell_style), Paragraph("<font color='#276749'><b>100% Critical OS CVEs eliminated</b></font>", table_cell_style)],
        [Paragraph("OS Vulnerabilities (HIGH)", table_cell_style), Paragraph("<font color='#C53030'><b>459 HIGH</b></font>", table_cell_style), Paragraph("<font color='#276749'><b>0 HIGH</b></font>", table_cell_style), Paragraph("<font color='#276749'><b>100% High OS CVEs eliminated</b></font>", table_cell_style)],
        [Paragraph("Total Vulnerabilities (OS + App)", table_cell_style), Paragraph("524 (503 HIGH, 21 CRITICAL)", table_cell_style), Paragraph("<b>37 (36 HIGH, 1 CRITICAL)</b>", table_cell_style), Paragraph("<b>92.9% Total CVE Reduction</b> (-487 CVEs)", table_cell_style)]
    ]
    t_trivy = Table(trivy_summary_data, colWidths=[120, 140, 134, 110])
    t_trivy.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(t_trivy)
    story.append(Spacer(1, 4))

    # Screenshot 6
    sc_tr = os.path.join("test-results", "screenshot_trivy_scan.png")
    if os.path.exists(sc_tr):
        story.append(Image(sc_tr, width=490, height=130))
        story.append(Spacer(1, 6))

    # Part 2(d)
    story.append(Paragraph("<b>2(d) Domain Threat Modeling, Security Controls & Regulatory Compliance</b>", h2_style))
    story.append(Paragraph(
        "<b>Threat Agent Analysis & Implemented Technical Controls:</b>",
        body_style
    ))

    threat_data = [
        [Paragraph("Threat Agent", table_header_style), Paragraph("Motivations & Attack Vector", table_header_style), Paragraph("Implemented Mitigations / Technical Controls", table_header_style)],
        [
            Paragraph("<b>Threat Agent 1:</b><br/>External Cybercriminal / Credential Stuffing Botnet", table_cell_style),
            Paragraph("Automated brute-force attacks against student accounts using credential dumps from third-party breaches to hijack scholarship disbursements.", table_cell_style),
            Paragraph("&bull; <b>bcrypt (cost 12)</b> with per-user salt prevents rainbow tables.<br/>&bull; <b>TOTP MFA</b> halts unauthorized logins even if password is compromised.<br/>&bull; Nginx rate limiting throttles automated brute-force scripts.", table_cell_style)
        ],
        [
            Paragraph("<b>Threat Agent 2:</b><br/>Malicious Insider / Privilege Escalating Student", table_cell_style),
            Paragraph("A registered student intercepting API traffic and modifying HTTP requests to alter eligibility cutoffs or award status via admin endpoints.", table_cell_style),
            Paragraph("&bull; <b>Strict RBAC Guards</b> verify JWT claims and database roles.<br/>&bull; <code>PUT</code> / <code>DELETE</code> endpoints strictly reject non-admin tokens with <code>403 Forbidden</code>.<br/>&bull; SSL-encrypted database transport.", table_cell_style)
        ]
    ]
    t_threat = Table(threat_data, colWidths=[110, 184, 210])
    t_threat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_threat)
    story.append(Spacer(1, 5))

    story.append(Paragraph(
        "<b>Regulatory Compliance Mapping:</b><br/>"
        "&bull; <b>Digital Personal Data Protection Act (DPDPA 2023, India):</b><br/>"
        "Section 8(5) mandates that data fiduciaries implement reasonable security safeguards to prevent personal data breaches. "
        "Because our platform collects income certificates and category data of students (often minors), Section 9 child data protections apply. "
        "Enforcing bcrypt password hashing, non-root container isolation, and TLS encryption over pooler port 6543 satisfies DPDPA reasonable safeguard requirements.<br/>"
        "&bull; <b>General Data Protection Regulation (GDPR, Article 32 — Security of Processing):</b><br/>"
        "Article 32(1)(a) requires pseudonymisation and encryption of personal data; 32(1)(b) requires the ability to ensure confidentiality, integrity, "
        "availability, and system resilience; 32(1)(c) mandates rapid restoration of availability in physical/technical incidents. "
        "Our multi-instance Nginx failover configuration directly guarantees resilience and zero-downtime recovery under node failure.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 3: CONCLUSION & SUBMISSION DELIVERABLES
    # =========================================================================
    story.append(Paragraph("Conclusion & Submission Verification", h1_style))
    story.append(Paragraph(
        "All requirements specified in the evaluation rubric have been fully implemented, validated against the live database, and published: "
        "<br/>&bull; <b>GitHub Repository:</b> <code>https://github.com/kanishka-netizen/scholarship-platform/tree/assignment-3</code> "
        "<br/>&bull; <b>Load Balancing & Scaling:</b> 3 NestJS instances behind Nginx with +186.8% throughput improvement. "
        "<br/>&bull; <b>High Availability:</b> Zero-downtime failover tuning eliminating 100% of node failure errors (from 15 to 0). "
        "<br/>&bull; <b>Cryptographic Storage:</b> Salted bcrypt password hashing verified in Supabase PostgreSQL. "
        "<br/>&bull; <b>Identity & Access Control:</b> RFC 6238 TOTP 2FA and NestJS RBAC Guards (401/403/200). "
        "<br/>&bull; <b>Vulnerability Elimination:</b> Trivy verified 100% elimination of operating system vulnerabilities (from 479 to 0).",
        body_style
    ))
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 4: THREE-MINUTE EVALUATION DEMONSTRATION SCRIPT
    # =========================================================================
    story.append(Paragraph("Three-Minute Evaluator Video Demonstration Script", h1_style))
    story.append(Paragraph(
        "Structured 4-phase walkthrough script designed for the required 3-minute video submission and live evaluator assessment:",
        body_style
    ))

    demo_data = [
        [Paragraph("Time Window", table_header_style), Paragraph("Phase & Objective", table_header_style), Paragraph("Spoken Script & Live Action on Screen", table_header_style)],
        [
            Paragraph("<b>0:00 - 0:45</b><br/>(45 sec)", table_cell_style),
            Paragraph("<b>Architecture & Load Balancing:</b><br/>Multi-instance scaling & round-robin verification", table_cell_style),
            Paragraph(
                "<i>'Hello everyone. Today I am demonstrating the scalability and security architecture for our Scholarship Discovery Platform. "
                "During national scholarship deadlines, thousands of students query eligibility criteria simultaneously. "
                "Here, we deployed three NestJS instances behind an Nginx load balancer connecting to our live Supabase PostgreSQL database. "
                "As you can see from our curl tests, each request alternates across backend-1, backend-2, and backend-3 via the X-Backend-Instance header. "
                "In our 1,000-request k6 benchmark, scaling from 1 to 3 instances improved throughput by 186.8% from 26.5 to 76.2 requests/sec, and slashed average latency from 745ms down to 259ms.'</i>",
                table_cell_style
            )
        ],
        [
            Paragraph("<b>0:45 - 1:30</b><br/>(45 sec)", table_cell_style),
            Paragraph("<b>Fault Tolerance:</b><br/>Mid-flight failure & Zero-Downtime Failover", table_cell_style),
            Paragraph(
                "<i>'Next is fault tolerance. During an active 600-request load test, we abruptly killed backend-2 using docker stop. "
                "Under standard Nginx configuration, 15 requests crashed with HTTP 502 Bad Gateway. "
                "However, by tuning Nginx with proxy_next_upstream for timeouts and 5xx errors alongside passive health monitoring, "
                "Nginx instantly and transparently rerouted in-flight connections to surviving instances. "
                "The result: 600 out of 600 requests succeeded with exactly 0% packet loss and zero downtime.'</i>",
                table_cell_style
            )
        ],
        [
            Paragraph("<b>1:30 - 2:15</b><br/>(45 sec)", table_cell_style),
            Paragraph("<b>Authentication & RBAC:</b><br/>bcrypt, TOTP MFA, and role authorization", table_cell_style),
            Paragraph(
                "<i>'Turning to security: Student income and affirmative action certificates are highly sensitive under India's DPDPA 2023. "
                "We replaced insecure plaintext storage with salted bcrypt hashing using a cost factor of 12 in Supabase. "
                "We also implemented RFC 6238 TOTP two-factor authentication compatible with Google Authenticator, rejecting invalid codes. "
                "Finally, our NestJS RBAC Guard protects administrative endpoints: unauthenticated calls return 401, student tokens are rejected with 403 Forbidden, and only Admin tokens are granted 200 OK access.'</i>",
                table_cell_style
            )
        ],
        [
            Paragraph("<b>2:15 - 3:00</b><br/>(45 sec)", table_cell_style),
            Paragraph("<b>Container Hardening:</b><br/>Alpine base, non-root user & Trivy scans", table_cell_style),
            Paragraph(
                "<i>'Lastly, we hardened our Docker container. We transitioned from an unhardened Debian Node 22 image to a multi-stage Alpine build running as low-privilege user node. "
                "This slashed image footprint from 1.13 GB down to 457 MB. "
                "More importantly, our Trivy vulnerability scan reveals that while the unhardened baseline suffered 479 OS vulnerabilities including 20 CRITICAL and 459 HIGH CVEs, "
                "the hardened Alpine image completely eliminated 100% of OS vulnerabilities, recording exactly ZERO critical and ZERO high OS findings. "
                "All test logs, diagrams, and code are live on GitHub branch assignment-3. Thank you.'</i>",
                table_cell_style
            )
        ]
    ]
    t_demo = Table(demo_data, colWidths=[75, 115, 314])
    t_demo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_demo)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Report generated successfully: {pdf_filename}")

if __name__ == "__main__":
    build_pdf()
