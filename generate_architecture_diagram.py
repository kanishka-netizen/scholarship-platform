import os
from PIL import Image, ImageDraw, ImageFont

# Canvas dimensions
WIDTH = 1400
HEIGHT = 900

# Palette
BG_COLOR = (248, 250, 252) # Slate 50
TEXT_MAIN = (15, 23, 42)   # Slate 900
TEXT_MUTED = (71, 85, 105) # Slate 600
BORDER_COLOR = (203, 213, 225) # Slate 300

# Component Colors
COLOR_FRONTEND = (224, 242, 254)  # Light Blue
BORDER_FRONTEND = (2, 132, 199)
COLOR_NGINX = (241, 245, 249)     # Slate Light
BORDER_NGINX = (15, 118, 110)     # Teal Dark
COLOR_BACKEND = (237, 233, 254)   # Violet
BORDER_BACKEND = (109, 40, 217)
COLOR_DATABASE = (220, 252, 231)  # Emerald
BORDER_DATABASE = (21, 128, 61)
COLOR_BURSTING = (254, 243, 199)  # Amber / Gold (Distinct!)
BORDER_BURSTING = (217, 119, 6)   # Amber Dark
COLOR_TOOLS = (255, 241, 242)      # Rose Light
BORDER_TOOLS = (225, 29, 72)

img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
draw = ImageDraw.Draw(img)

# Fallback fonts
try:
    font_title = ImageFont.truetype("arialbd.ttf", 26)
    font_subtitle = ImageFont.truetype("arial.ttf", 15)
    font_box_header = ImageFont.truetype("arialbd.ttf", 16)
    font_box_text = ImageFont.truetype("arial.ttf", 13)
    font_tag = ImageFont.truetype("arialbd.ttf", 11)
except Exception:
    font_title = ImageFont.load_default()
    font_subtitle = font_title
    font_box_header = font_title
    font_box_text = font_title
    font_tag = font_title

# Helper to draw rounded rectangle with border
def draw_card(box, fill_color, border_color, border_width=2, radius=10):
    draw.rounded_rectangle(box, radius=radius, fill=fill_color, outline=border_color, width=border_width)

# Draw Title Header
draw.text((50, 30), "BACSE344 DA3: Distributed Scholarship Discovery Architecture", fill=TEXT_MAIN, font=font_title)
draw.text((50, 65), "High-Availability Load Balanced Multi-Container Architecture with Cloud Bursting Edge Tier", fill=TEXT_MUTED, font=font_subtitle)

# 1. CLIENT / FRONTEND (Left column)
draw_card((50, 140, 310, 340), COLOR_FRONTEND, BORDER_FRONTEND)
draw.text((70, 160), "Web Client (Frontend)", fill=TEXT_MAIN, font=font_box_header)
draw.text((70, 190), "• Framework: Next.js 14 / React", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 215), "• Hosting: Netlify Global CDN", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 240), "• Protocol: HTTPS / TLS 1.3", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 265), "• Port: 443 (Prod) / 3000 (Dev)", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 295), "[Assignment 1 Component]", fill=(3, 105, 161), font=font_tag)

# 2. NGINX LOAD BALANCER (Center-Left)
draw_card((380, 140, 660, 340), COLOR_NGINX, BORDER_NGINX)
draw.text((400, 160), "Nginx Reverse Proxy / LB", fill=TEXT_MAIN, font=font_box_header)
draw.text((400, 190), "• Container: scholarship-nginx-lb", fill=TEXT_MUTED, font=font_box_text)
draw.text((400, 215), "• Host Port: 8080 -> 80", fill=TEXT_MUTED, font=font_box_text)
draw.text((400, 240), "• Algorithm: Round-Robin", fill=TEXT_MUTED, font=font_box_text)
draw.text((400, 265), "• Failover: proxy_next_upstream", fill=TEXT_MUTED, font=font_box_text)
draw.text((400, 290), "• Passive Health Checks: max_fails=2", fill=TEXT_MUTED, font=font_box_text)
draw.text((400, 315), "[Q1(a) & Q1(c) Core Load Balancer]", fill=(13, 148, 136), font=font_tag)

# 3. THREE BACKEND INSTANCES (Center-Right column)
# Backend 1
draw_card((730, 120, 1010, 230), COLOR_BACKEND, BORDER_BACKEND)
draw.text((745, 135), "Backend Instance 1 (NestJS)", fill=TEXT_MAIN, font=font_box_header)
draw.text((745, 160), "• Container: scholarship-backend-1", fill=TEXT_MUTED, font=font_box_text)
draw.text((745, 180), "• Image: scholarship-backend:hardened", fill=TEXT_MUTED, font=font_box_text)
draw.text((745, 200), "• Host: 3001 | Container: 3001 | User: node", fill=TEXT_MUTED, font=font_box_text)

# Backend 2
draw_card((730, 250, 1010, 360), COLOR_BACKEND, BORDER_BACKEND)
draw.text((745, 265), "Backend Instance 2 (NestJS)", fill=TEXT_MAIN, font=font_box_header)
draw.text((745, 290), "• Container: scholarship-backend-2", fill=TEXT_MUTED, font=font_box_text)
draw.text((745, 310), "• Image: scholarship-backend:hardened", fill=TEXT_MUTED, font=font_box_text)
draw.text((745, 330), "• Host: 3002 | Container: 3001 | User: node", fill=TEXT_MUTED, font=font_box_text)

# Backend 3
draw_card((730, 380, 1010, 490), COLOR_BACKEND, BORDER_BACKEND)
draw.text((745, 395), "Backend Instance 3 (NestJS)", fill=TEXT_MAIN, font=font_box_header)
draw.text((745, 420), "• Container: scholarship-backend-3", fill=TEXT_MUTED, font=font_box_text)
draw.text((745, 440), "• Image: scholarship-backend:hardened", fill=TEXT_MUTED, font=font_box_text)
draw.text((745, 460), "• Host: 3003 | Container: 3001 | User: node", fill=TEXT_MUTED, font=font_box_text)

# 4. CLOUD DATABASE (Right column)
draw_card((1080, 200, 1350, 420), COLOR_DATABASE, BORDER_DATABASE)
draw.text((1100, 220), "Cloud Database (Supabase)", fill=TEXT_MAIN, font=font_box_header)
draw.text((1100, 250), "• Engine: PostgreSQL 17.6 (AWS)", fill=TEXT_MUTED, font=font_box_text)
draw.text((1100, 275), "• Host: aws-0-ap-northeast-1", fill=TEXT_MUTED, font=font_box_text)
draw.text((1100, 300), "• Pooler Port: 6543 (PgBouncer)", fill=TEXT_MUTED, font=font_box_text)
draw.text((1100, 325), "• Direct Port: 5432 (Prisma)", fill=TEXT_MUTED, font=font_box_text)
draw.text((1100, 350), "• Region: ap-northeast-1 (Tokyo)", fill=TEXT_MUTED, font=font_box_text)
draw.text((1100, 380), "[Single Source of Truth Database]", fill=(22, 101, 52), font=font_tag)

# 5. ASSIGNMENT 1 HOSTING PLATFORM (Below Frontend)
draw_card((50, 370, 310, 510), (243, 244, 246), (75, 85, 99))
draw.text((70, 390), "Assignment 1 Hosting", fill=TEXT_MAIN, font=font_box_header)
draw.text((70, 420), "• Cloud PaaS: Render", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 445), "• Staging: scholarship-platform.onrender", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 470), "• Port: 10000 / 443 HTTPS", fill=TEXT_MUTED, font=font_box_text)

# 6. ORCHESTRATION & SECURITY TOOLS (Bottom-Left)
draw_card((50, 550, 520, 850), COLOR_TOOLS, BORDER_TOOLS)
draw.text((70, 570), "Infrastructure & Security Tooling", fill=TEXT_MAIN, font=font_box_header)
draw.text((70, 605), "• Docker Compose v2: 4-Container Orchestration & Bridge Network", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 630), "• k6 v2.3.0: 1,000-Request Stress Load Testing & Failure Simulation", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 655), "• Trivy v0.76.1: Container Vulnerability & Base Image CVE Auditing", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 680), "• Bcrypt.js: Salted Password Hashing (Cost Factor 12)", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 705), "• Speakeasy & QRCode: TOTP Multi-Factor Authentication (RFC 6238)", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 730), "• NestJS AdminGuard: Cryptographic RBAC on Protected APIs", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 760), "• Nginx High-Availability: Failover Retry Directives & Passive Health", fill=TEXT_MUTED, font=font_box_text)
draw.text((70, 800), "[Verification & Defense-in-Depth Tools]", fill=(190, 18, 60), font=font_tag)

# 7. CLOUD BURSTING / FOG COMPUTING COMPONENT (Bottom-Right, DISTINCT COLOR)
draw_card((560, 550, 1350, 850), COLOR_BURSTING, BORDER_BURSTING, border_width=3, radius=12)
draw.text((585, 570), ">> Cloud Bursting & Edge/Fog Computing Tier (Peak-Demand Handler)", fill=(180, 83, 9), font=font_box_header)
draw.text((585, 600), "• Component: Cloudflare Workers + Regional Fog Cache (Upstash Redis Edge)", fill=TEXT_MAIN, font=font_box_header)
draw.text((585, 630), "• Peak Scenario: National Scholarship Portal (NSP) Deadline Rush & Results Day", fill=TEXT_MUTED, font=font_box_text)
draw.text((585, 655), "• How it handles peak demand: When concurrent student traffic surges 20x during results day,", fill=TEXT_MUTED, font=font_box_text)
draw.text((585, 680), "  read requests to 'GET /scholarships' are dynamically burst to 300+ global edge locations.", fill=TEXT_MUTED, font=font_box_text)
draw.text((585, 705), "  Cached scholarship catalogue & eligibility responses are served with <30ms latency.", fill=TEXT_MUTED, font=font_box_text)
draw.text((585, 730), "• Database Protection: 95%+ of read queries are absorbed at the edge without reaching Supabase,", fill=TEXT_MUTED, font=font_box_text)
draw.text((585, 755), "  preventing pooler exhaustion and ensuring origin containers never experience downtime.", fill=TEXT_MUTED, font=font_box_text)
draw.text((585, 785), "WHY CHOSEN: Scholarship listing data is largely read-heavy and read-stable during deadlines,", fill=(180, 83, 9), font=font_box_text)
draw.text((585, 805), "making Edge/Fog caching the most cost-effective and zero-latency scaling solution for education portals.", fill=(180, 83, 9), font=font_box_text)

# Draw Connecting Arrows
def draw_arrow(start, end, label=""):
    draw.line([start, end], fill=(100, 116, 139), width=2)
    x2, y2 = end
    x1, y1 = start
    if x2 > x1:
        draw.polygon([(x2, y2), (x2 - 8, y2 - 4), (x2 - 8, y2 + 4)], fill=(100, 116, 139))
    elif x2 < x1:
        draw.polygon([(x2, y2), (x2 + 8, y2 - 4), (x2 + 8, y2 + 4)], fill=(100, 116, 139))
    elif y2 > y1:
        draw.polygon([(x2, y2), (x2 - 4, y2 - 8), (x2 + 4, y2 - 8)], fill=(100, 116, 139))
    if label:
        mx = (x1 + x2) // 2 - 25
        my = (y1 + y2) // 2 - 12
        draw.text((mx, my), label, fill=TEXT_MUTED, font=font_tag)

# Connect Frontend -> Nginx
draw_arrow((310, 240), (380, 240), "HTTP/8080")

# Connect Nginx -> Backend 1, 2, 3
draw_arrow((660, 200), (730, 175), "Round-Robin")
draw_arrow((660, 240), (730, 305), "proxy_pass")
draw_arrow((660, 280), (730, 435), "Failover Retry")

# Connect Backends -> Database
draw_arrow((1010, 175), (1080, 260), "TCP:6543")
draw_arrow((1010, 305), (1080, 310), "Prisma Client")
draw_arrow((1010, 435), (1080, 360), "PostgreSQL")

# Connect Frontend -> Edge Cloud Bursting (Dashed / Amber) routing around boxes
draw.line([(180, 340), (180, 360)], fill=(217, 119, 6), width=2)
draw.line([(180, 520), (180, 535), (560, 535), (560, 550)], fill=(217, 119, 6), width=2)
draw.polygon([(560, 550), (556, 542), (564, 542)], fill=(217, 119, 6))
draw.text((320, 518), "Edge Cloud Bursting Cache Route", fill=(217, 119, 6), font=font_tag)

# Save
output_path = "test-results/architecture_diagram.png"
img.save(output_path, "PNG", dpi=(150, 150))
print(f"Architecture diagram generated successfully: {output_path}")
