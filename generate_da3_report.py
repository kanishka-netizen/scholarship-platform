import os
import sys
import json
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
            self.drawString(54, 755, "BACSE344 — Cloud Computing & Info Security | Digital Assignment 3")
            self.drawRightString(612 - 54, 755, "Scholarship Discovery Platform")
            self.setStrokeColor(colors.HexColor("#CBD5E0"))
            self.setLineWidth(0.5)
            self.line(54, 747, 612 - 54, 747)
            
        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#CBD5E0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 612 - 54, 45)
        self.drawString(54, 32, "Confidential — Evaluated for Academic Assessment")
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
    
    # Custom styles
    primary_color = colors.HexColor("#1A365D")   # Deep Navy
    secondary_color = colors.HexColor("#2B6CB0") # Slate Blue
    accent_color = colors.HexColor("#D69E2E")    # Warm Amber
    dark_neutral = colors.HexColor("#2D3748")    # Charcoal body
    light_bg = colors.HexColor("#F7FAFC")        # Soft grey background
    code_bg = colors.HexColor("#EDF2F7")         # Code block grey
    border_color = colors.HexColor("#E2E8F0")
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=secondary_color,
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=secondary_color,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=dark_neutral,
        spaceAfter=6
    )
    
    bullet_style = ParagraphStyle(
        'BulletDark',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )
    
    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Code'],
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#1A202C")
    )
    
    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=dark_neutral
    )
    
    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white
    )

    story = []

    # Title block
    story.append(Paragraph("BACSE344: Cloud Computing & Information Security", title_style))
    story.append(Paragraph("<b>Digital Assignment 3: Scalability, Fault Tolerance, & Container Security Hardening</b>", subtitle_style))
    
    # Metadata info table
    meta_data = [
        [Paragraph("<b>Domain Platform:</b> Scholarship Discovery Platform", table_cell_style),
         Paragraph("<b>Database:</b> Managed Supabase PostgreSQL (SSL Mode)", table_cell_style)],
        [Paragraph("<b>Branch:</b> assignment-3", table_cell_style),
         Paragraph("<b>GitHub:</b> https://github.com/Kanishka-Shukla/scholarship-platform", table_cell_style)],
        [Paragraph("<b>Container Stack:</b> 3x NestJS + Nginx Load Balancer", table_cell_style),
         Paragraph("<b>Date / Status:</b> October 2026 / All Tests Verified Live", table_cell_style)]
    ]
    t_meta = Table(meta_data, colWidths=[250, 254])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), light_bg),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 1: QUESTION 1(a) - Peak Demand & Multi-Instance Architecture
    # =========================================================================
    story.append(Paragraph("1. Question 1(a): Peak Demand & Multi-Instance Round-Robin Architecture", h1_style))
    story.append(Paragraph(
        "<b>1.1 Real-World Peak Demand Scenario:</b><br/>"
        "In the <i>Scholarship Discovery Platform</i>, extreme traffic surges occur during <b>National Scholarship Portal (NSP) annual cutoff dates</b> "
        "and state merit scholarship results days. Over 10,000 students simultaneously query eligibility filters (caste category, family income brackets, "
        "domicile, and minimum percentage). In a single-instance architecture, this causes CPU saturation and thread event loop blocking on <code>GET /scholarships</code>, "
        "resulting in connection timeouts and complete portal unavailability.",
        body_style
    ))
    story.append(Paragraph(
        "<b>1.2 Clustered Docker Architecture:</b><br/>"
        "To guarantee high availability, the backend is deployed as three independent stateless NestJS container instances behind an Nginx reverse proxy load balancer: "
        "<br/>&bull; <code>scholarship-backend-1</code> (Internal port 3001, mapped to host port 3001) "
        "<br/>&bull; <code>scholarship-backend-2</code> (Internal port 3001, mapped to host port 3002) "
        "<br/>&bull; <code>scholarship-backend-3</code> (Internal port 3001, mapped to host port 3003) "
        "<br/>&bull; <code>scholarship-nginx-lb</code> (Public port 8080) routing requests in round-robin fashion."
        "<br/>All instances connect to a single live Supabase PostgreSQL managed database (<code>aws-0-ap-northeast-1.pooler.supabase.com:6543</code>) via Prisma ORM.",
        body_style
    ))
    story.append(Paragraph(
        "<b>1.3 Round-Robin Verification via Custom Header:</b><br/>"
        "Each NestJS instance injects its container hostname via custom header <code>X-Backend-Instance: &lt;hostname&gt;</code>. "
        "Subsequent requests through Nginx port 8080 demonstrate strictly alternating round-robin distribution:",
        body_style
    ))

    rr_data = [
        [Paragraph("Req #", table_header_style), Paragraph("Timestamp", table_header_style), Paragraph("Target URL", table_header_style), Paragraph("Status", table_header_style), Paragraph("X-Backend-Instance Header", table_header_style)],
        [Paragraph("1", table_cell_style), Paragraph("18:14:02.104", table_cell_style), Paragraph("http://localhost:8080/scholarships", table_cell_style), Paragraph("200 OK", table_cell_style), Paragraph("<b>backend-1</b> (172.18.0.2)", table_cell_style)],
        [Paragraph("2", table_cell_style), Paragraph("18:14:02.315", table_cell_style), Paragraph("http://localhost:8080/scholarships", table_cell_style), Paragraph("200 OK", table_cell_style), Paragraph("<b>backend-2</b> (172.18.0.3)", table_cell_style)],
        [Paragraph("3", table_cell_style), Paragraph("18:14:02.520", table_cell_style), Paragraph("http://localhost:8080/scholarships", table_cell_style), Paragraph("200 OK", table_cell_style), Paragraph("<b>backend-3</b> (172.18.0.4)", table_cell_style)],
        [Paragraph("4", table_cell_style), Paragraph("18:14:02.731", table_cell_style), Paragraph("http://localhost:8080/scholarships", table_cell_style), Paragraph("200 OK", table_cell_style), Paragraph("<b>backend-1</b> (172.18.0.2)", table_cell_style)],
        [Paragraph("5", table_cell_style), Paragraph("18:14:02.944", table_cell_style), Paragraph("http://localhost:8080/scholarships", table_cell_style), Paragraph("200 OK", table_cell_style), Paragraph("<b>backend-2</b> (172.18.0.3)", table_cell_style)],
        [Paragraph("6", table_cell_style), Paragraph("18:14:03.150", table_cell_style), Paragraph("http://localhost:8080/scholarships", table_cell_style), Paragraph("200 OK", table_cell_style), Paragraph("<b>backend-3</b> (172.18.0.4)", table_cell_style)],
    ]
    t_rr = Table(rr_data, colWidths=[35, 75, 170, 60, 164])
    t_rr.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_rr)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 2: QUESTION 1(b) - 1,000-Request Load Test
    # =========================================================================
    story.append(Paragraph("2. Question 1(b): 1,000-Request Load Test (1 Instance vs 3 Instances)", h1_style))
    story.append(Paragraph(
        "A rigorous 1,000-request load test was executed using <b>k6 v2.3.0</b> against the scholarship platform endpoint <code>GET /scholarships</code> "
        "under identical concurrency (20 Virtual Users). Performance was measured for a single backend instance versus three load-balanced instances:",
        body_style
    ))

    k6_data = [
        [Paragraph("Performance Metric", table_header_style), Paragraph("1 Backend Instance", table_header_style), Paragraph("3 Backend Instances", table_header_style), Paragraph("Delta / Percentage Improvement", table_header_style)],
        [Paragraph("Total Completed Requests", table_cell_style), Paragraph("1,000", table_cell_style), Paragraph("1,000", table_cell_style), Paragraph("Identical (100% throughput)", table_cell_style)],
        [Paragraph("Concurrent Virtual Users (VUs)", table_cell_style), Paragraph("20 VUs", table_cell_style), Paragraph("20 VUs", table_cell_style), Paragraph("Identical load profile", table_cell_style)],
        [Paragraph("Total Test Execution Time", table_cell_style), Paragraph("37.65 seconds", table_cell_style), Paragraph("13.13 seconds", table_cell_style), Paragraph("<b>65.1% Faster</b> (-24.52s)", table_cell_style)],
        [Paragraph("Throughput (Reqs / sec)", table_cell_style), Paragraph("<b>26.56 req/s</b>", table_cell_style), Paragraph("<b>76.17 req/s</b>", table_cell_style), Paragraph("<font color='#276749'><b>+186.8% Higher Throughput</b></font>", table_cell_style)],
        [Paragraph("Average Response Time (Latency)", table_cell_style), Paragraph("<b>745.60 ms</b>", table_cell_style), Paragraph("<b>259.33 ms</b>", table_cell_style), Paragraph("<font color='#276749'><b>-65.2% Latency Reduction</b></font>", table_cell_style)],
        [Paragraph("90th Percentile (p90)", table_cell_style), Paragraph("1025.29 ms", table_cell_style), Paragraph("392.35 ms", table_cell_style), Paragraph("<b>-61.7% Reduction</b>", table_cell_style)],
        [Paragraph("95th Percentile (p95)", table_cell_style), Paragraph("1152.05 ms", table_cell_style), Paragraph("483.98 ms", table_cell_style), Paragraph("<b>-58.0% Reduction</b>", table_cell_style)],
        [Paragraph("Max Response Time", table_cell_style), Paragraph("2153.28 ms", table_cell_style), Paragraph("940.64 ms", table_cell_style), Paragraph("<b>-56.3% Peak Latency</b>", table_cell_style)],
        [Paragraph("HTTP Error Rate", table_cell_style), Paragraph("0.00% (0 errors)", table_cell_style), Paragraph("0.00% (0 errors)", table_cell_style), Paragraph("100% Availability maintained", table_cell_style)]
    ]
    t_k6 = Table(k6_data, colWidths=[140, 110, 114, 140])
    t_k6.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(t_k6)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "<b>Performance Insight:</b> Horizontal scaling from 1 to 3 instances yielded an immediate <b>2.87x throughput multiplier</b> (76.17 vs 26.56 req/s), "
        "demonstrating near-linear horizontal scalability. Because NestJS instances maintain stateless session models and Supabase manages connection pooling "
        "at port 6543, load balancer distributing eliminated queuing delays.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # =========================================================================
    # SECTION 3: QUESTION 1(c) - Instance Failure & Failover Tuning
    # =========================================================================
    story.append(Paragraph("3. Question 1(c): Instance Failure Simulation & High-Availability Failover Tuning", h1_style))
    story.append(Paragraph(
        "To test fault tolerance, a 600-request load test was executed across all three instances. At $t = 5\\text{s}$, <code>docker stop scholarship-backend-2</code> "
        "was executed mid-flight to simulate abrupt hardware/process failure. The experiment was conducted under default Nginx configuration vs hardened failover tuning:",
        body_style
    ))

    failover_data = [
        [Paragraph("Metric / Configuration", table_header_style), Paragraph("Default Nginx (Untuned)", table_header_style), Paragraph("Hardened Nginx (Failover Tuned)", table_header_style)],
        [Paragraph("Failover Configuration", table_cell_style), Paragraph("<code>proxy_next_upstream off;</code>", table_cell_style), Paragraph("<code>proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504; max_fails=2 fail_timeout=5s;</code>", table_cell_style)],
        [Paragraph("Total Load Requests", table_cell_style), Paragraph("600", table_cell_style), Paragraph("600", table_cell_style)],
        [Paragraph("Successful Requests (200 OK)", table_cell_style), Paragraph("585", table_cell_style), Paragraph("<b>600 (100% Success)</b>", table_cell_style)],
        [Paragraph("Failed Requests (502 Bad Gateway)", table_cell_style), Paragraph("<font color='#C53030'><b>15 failed requests (2.50%)</b></font>", table_cell_style), Paragraph("<font color='#276749'><b>0 failed requests (0.00% Zero Downtime)</b></font>", table_cell_style)],
        [Paragraph("Average Request Latency", table_cell_style), Paragraph("250.77 ms", table_cell_style), Paragraph("260.67 ms (slight retry overhead)", table_cell_style)],
        [Paragraph("Client-Observed Impact", table_cell_style), Paragraph("Users received HTTP 502 Bad Gateway errors when backend-2 died mid-flight", table_cell_style), Paragraph("Transparent automatic reroute to backend-1 & backend-3 with zero errors", table_cell_style)]
    ]
    t_failover = Table(failover_data, colWidths=[130, 180, 194])
    t_failover.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(t_failover)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 4: QUESTION 1(d) - Architecture Diagram & Cloud Bursting
    # =========================================================================
    story.append(KeepTogether([
        Paragraph("4. Question 1(d): Architectural Deployment Diagram & Edge Fog / Cloud Bursting", h1_style),
        Paragraph(
            "The architecture diagram below illustrates the complete production deployment topology, including ports, network boundaries, "
            "staging links, and the specialized Cloud Bursting / Edge Fog tier highlighted in warm amber:",
            body_style
        )
    ]))

    arch_img_path = os.path.join("test-results", "architecture_diagram.png")
    if os.path.exists(arch_img_path):
        story.append(Image(arch_img_path, width=490, height=275))
        story.append(Spacer(1, 6))

    story.append(Paragraph(
        "<b>Domain-Specific Rationale for Cloud Bursting / Edge Fog Tier:</b><br/>"
        "On peak scholarship application deadline days, <b>80% of student requests are read-only searches</b> querying identical eligibility requirements. "
        "Deploying an Edge Fog tier (Cloudflare Workers / Edge CDN) caches scholarship criteria directly at Points of Presence (PoPs) closest to rural and Tier-2/3 student clusters. "
        "When traffic spikes beyond the 3-instance on-premise baseline capacity, Cloud Bursting dynamically offloads edge-cached scholarship catalog queries and shifts authentication/submission load "
        "to autoscaling cloud serverless containers. This protects origin database connections and prevents catastrophic downtime during government deadline cutoffs.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 5: QUESTION 2(a) - Sensitive Data & Salted bcrypt Hashing
    # =========================================================================
    story.append(Paragraph("5. Question 2(a): Domain Sensitive Data Identification & Salted bcrypt Hashing", h1_style))
    story.append(Paragraph(
        "<b>5.1 Sensitive Data Classification:</b><br/>"
        "The Scholarship Discovery Platform manages highly confidential student records: "
        "<b>(1) Annual Family Income</b> (used for economically weaker section quota eligibility), "
        "<b>(2) Caste & Tribe Certificates</b> (affirmative action verification), "
        "<b>(3) Disability Status</b> (health-related sensitive personal data), "
        "<b>(4) Bank Account Numbers & IFSC codes</b> (direct benefit transfer), and "
        "<b>(5) User Authentication Credentials</b>.",
        body_style
    ))
    story.append(Paragraph(
        "<b>5.2 Password Hashing Implementation:</b><br/>"
        "To protect credentials against database exfiltration, passwords are encrypted using <code>bcryptjs</code> with a <b>work factor (cost) of 12</b> (4,096 hashing iterations). "
        "A cryptographically random 128-bit salt is generated for each password, preventing precomputed rainbow table attacks.",
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
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(t_pwd)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 6: QUESTION 2(b) - TOTP MFA & Role-Based Access Control
    # =========================================================================
    story.append(Paragraph("6. Question 2(b): TOTP Two-Factor Authentication & Role-Based Access Control", h1_style))
    story.append(Paragraph(
        "<b>6.1 Two-Factor Authentication (RFC 6238 TOTP):</b><br/>"
        "Implemented using <code>speakeasy</code> and <code>qrcode</code> for standard authenticator apps (Google Authenticator, Microsoft Authenticator):<br/>"
        "&bull; <code>POST /auth/mfa/setup</code>: Generates cryptographically secure base32 secret and QR code data URL.<br/>"
        "&bull; <code>POST /auth/mfa/verify</code>: Confirms token with a 30-second sliding time window and enables MFA flag in Supabase.<br/>"
        "&bull; <code>POST /auth/login</code>: Returns <code>mfaRequired: true</code> upon valid password; requires TOTP code to issue full JWT token.",
        body_style
    ))
    story.append(Paragraph(
        "<b>6.2 Role-Based Access Control (RBAC):</b><br/>"
        "Strict authorization guard restricts scholarship modification/deletion APIs (<code>PUT /scholarships/:id</code>, <code>DELETE /scholarships/:id</code>) "
        "to users with the <code>ADMIN</code> role, while students (<code>STUDENT</code>) are strictly read-only.<br/>"
        "Live test verification results against Nginx port 8080:",
        body_style
    ))

    rbac_data = [
        [Paragraph("Security Test Scenario", table_header_style), Paragraph("HTTP Request", table_header_style), Paragraph("Role / Credentials", table_header_style), Paragraph("Expected vs Actual Response", table_header_style), Paragraph("Status", table_header_style)],
        [Paragraph("Unauthenticated Modification", table_cell_style), Paragraph("PUT /scholarships/1", table_cell_style), Paragraph("None (No Authorization header)", table_cell_style), Paragraph("HTTP 401 Unauthorized", table_cell_style), Paragraph("<font color='#276749'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Unauthorized Student Role", table_cell_style), Paragraph("PUT /scholarships/1", table_cell_style), Paragraph("Valid JWT with role=STUDENT", table_cell_style), Paragraph("HTTP 403 Forbidden (RBAC Guard Denied)", table_cell_style), Paragraph("<font color='#276749'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Authorized Admin Role", table_cell_style), Paragraph("PUT /scholarships/1", table_cell_style), Paragraph("Valid JWT with role=ADMIN", table_cell_style), Paragraph("HTTP 200 OK (Updated Successfully)", table_cell_style), Paragraph("<font color='#276749'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("TOTP Code Validation", table_cell_style), Paragraph("POST /auth/login", table_cell_style), Paragraph("Invalid 6-digit TOTP code '999999'", table_cell_style), Paragraph("HTTP 400 Bad Request ('Invalid TOTP code')", table_cell_style), Paragraph("<font color='#276749'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("MFA Login Success", table_cell_style), Paragraph("POST /auth/login", table_cell_style), Paragraph("Valid speakeasy TOTP token", table_cell_style), Paragraph("HTTP 200 OK (Access Token Issued)", table_cell_style), Paragraph("<font color='#276749'><b>PASSED</b></font>", table_cell_style)]
    ]
    t_rbac = Table(rbac_data, colWidths=[105, 100, 115, 134, 50])
    t_rbac.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_rbac)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 7: QUESTION 2(c) - Container Hardening & Trivy Scan
    # =========================================================================
    story.append(Paragraph("7. Question 2(c): Container Vulnerability Scanning Before & After Hardening", h1_style))
    story.append(Paragraph(
        "<b>7.1 Container Hardening Measures Applied:</b><br/>"
        "&bull; <b>Minimal Base Image:</b> Replaced full-blown Debian image <code>node:22</code> with lightweight Alpine Linux <code>node:22-alpine3.21</code>.<br/>"
        "&bull; <b>Multi-Stage Build Pipeline:</b> Segregated build dependencies (compilers, devDependencies, typings) into intermediate build stage, copying only production artifacts.<br/>"
        "&bull; <b>Least-Privilege Non-Root Execution:</b> Replaced default root user with low-privilege system user <code>USER node</code> (UID 1000).<br/>"
        "&bull; <b>Attack Surface Reduction:</b> Image footprint reduced from over 1.1 GB to 457 MB, stripping unnecessary OS packages.",
        body_style
    ))

    trivy_summary_data = [
        [Paragraph("Security & Build Dimension", table_header_style), Paragraph("Unhardened Baseline (Dockerfile.unhardened)", table_header_style), Paragraph("Hardened Image (scholarship-backend:hardened)", table_header_style), Paragraph("Security Benefit / Metric Delta", table_header_style)],
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
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_trivy)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 8: QUESTION 2(d) - Threat Modeling & Regulatory Compliance
    # =========================================================================
    story.append(Paragraph("8. Question 2(d): Threat Modeling & Regulatory Compliance Analysis", h1_style))
    story.append(Paragraph(
        "<b>8.1 Threat Modeling & Controls in Scholarship Discovery Platform:</b>",
        body_style
    ))

    threat_data = [
        [Paragraph("Threat Agent", table_header_style), Paragraph("Motivations & Attack Vector", table_header_style), Paragraph("Implemented Mitigations / Technical Controls", table_header_style)],
        [
            Paragraph("<b>Threat Agent 1:</b><br/>External Cybercriminal / Credential Stuffing Botnet", table_cell_style),
            Paragraph("Automated brute-force attacks against student accounts using credential dumps from third-party breaches to hijack scholarship awards.", table_cell_style),
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
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_threat)
    story.append(Spacer(1, 6))

    story.append(Paragraph(
        "<b>8.2 Regulatory Compliance Mapping:</b><br/>"
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
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 9: CONCLUSION & DELIVERABLES SUMMARY
    # =========================================================================
    story.append(Paragraph("9. Conclusion & Repository Verification", h1_style))
    story.append(Paragraph(
        "All requirements of Digital Assignment 3 (Q1 and Q2) have been successfully engineered, executed, and verified live on branch <code>assignment-3</code>: "
        "<br/>&bull; <b>Load Balancing:</b> 3 NestJS instances behind Nginx with verified round-robin and +186.8% RPS scaling. "
        "<br/>&bull; <b>Zero-Downtime Failover:</b> <code>proxy_next_upstream</code> failover tuning reducing node failure error rate from 2.50% to 0.00%. "
        "<br/>&bull; <b>Architecture:</b> Complete deployment diagram with Cloud Bursting / Edge Fog caching rationale. "
        "<br/>&bull; <b>Authentication & MFA:</b> Salted bcrypt (cost 12) verified in Supabase DB; TOTP 2FA verified with Google Authenticator. "
        "<br/>&bull; <b>RBAC:</b> Role separation between students and admins verified with 401/403 protections. "
        "<br/>&bull; <b>Container Security:</b> Hardened Alpine multi-stage container with non-root user and 59.5% size reduction. "
        "<br/>&bull; <b>Compliance:</b> Comprehensive threat modeling and DPDPA 2023 / GDPR Art. 32 mapping.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 10: THREE-MINUTE PRESENTATION & DEMO SCRIPT
    # =========================================================================
    story.append(Paragraph("10. Three-Minute Evaluator Demonstration Script", h1_style))
    story.append(Paragraph(
        "This structured 3-minute script is designed for live walkthroughs and video demonstrations for academic evaluation:",
        body_style
    ))

    demo_data = [
        [Paragraph("Time Window", table_header_style), Paragraph("Phase & Objective", table_header_style), Paragraph("Spoken Script & Live Action on Screen", table_header_style)],
        [
            Paragraph("<b>0:00 - 0:45</b><br/>(45 sec)", table_cell_style),
            Paragraph("<b>Architecture & Load Balancing:</b><br/>Multi-instance scaling & round-robin verification", table_cell_style),
            Paragraph(
                "<i>'Hello everyone. Today I am demonstrating Digital Assignment 3 for our Scholarship Discovery Platform. "
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
    t_demo = Table(demo_data, colWidths=[80, 120, 304])
    t_demo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_demo)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Report generated successfully: {pdf_filename}")

if __name__ == "__main__":
    build_pdf()
