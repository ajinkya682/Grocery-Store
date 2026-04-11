from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import Paragraph
from reportlab.pdfgen import canvas


ROOT = Path("/Users/ajinkyasaivar/Ajinkya Developer/Grocery Store")
OUTPUT = ROOT / "output/pdf/grocery-store-app-summary.pdf"


TITLE = "Grocery Store App Summary"
SUBTITLE = "Repo-evidence snapshot of the current application"

LEFT_CONTENT = [
    (
        "What It Is",
        [
            "A full-stack grocery web app with a customer storefront and a protected admin portal.",
            "Shoppers browse products and trigger WhatsApp-assisted ordering, while admins manage catalog, orders, settings, uploads, and dashboard stats.",
        ],
    ),
    (
        "Who It Is For",
        [
            "Primary persona: busy local households that want a fast grocery browsing flow and low-friction ordering via WhatsApp.",
        ],
    ),
    (
        "What It Does",
        [
            "Browse categories, featured items, search results, and individual product pages.",
            "Maintain a user-authenticated cart with per-user localStorage persistence.",
            "Open a prefilled WhatsApp order message with customer details, items, and pricing.",
            "Support user registration, login, session restore, and token refresh.",
            "Create and manage orders; users can view/cancel orders and admins can update status.",
            "Give admins protected screens for analytics, product CRUD, bulk stock updates, image uploads, and store settings.",
        ],
    ),
]

RIGHT_CONTENT = [
    (
        "How It Works",
        [
            "Frontend: React 19 + Vite SPA with React Router and context providers for store, auth, products, and cart state.",
            "API layer: Axios sends requests to /api, adds JWT auth headers, and refreshes expired tokens once on 401.",
            "Backend: Express app applies helmet, CORS, rate limits, sanitization, compression, then mounts auth, products, orders, upload, settings, and dashboard routes.",
            "Data layer: Mongoose models persist users, products, orders, and singleton store settings in MongoDB.",
            "Flow: Browser -> React UI -> Axios -> Express controllers -> Mongoose/MongoDB; admin image uploads go through multer to ImageKit and store returned URLs/fileIds on products.",
        ],
    ),
    (
        "How To Run",
        [
            "Start MongoDB locally, or point MONGODB_URI at a running instance.",
            "In Backend/: run npm install, then create .env with JWT secrets. .env.example: Not found in repo.",
            "Start the API with npm run dev. Backend default port is 5000.",
            "Optional setup: run npm run seed:admin once to create the admin user and initialize store settings.",
            "In Frontend/: run npm install and npm run dev. VITE_API_URL defaults to http://localhost:5001/api, so align it with the backend port if needed.",
            "Image upload credentials and broader setup docs: Not found in repo.",
        ],
    ),
]

SOURCES = [
    "Sources inspected: Frontend/src/App.jsx, Frontend/src/api/apiService.js, Frontend/src/context/*.jsx, Frontend/src/pages/admin/*.jsx, Backend/server.js, Backend/src/app.js, Backend/src/routes/*.js, Backend/src/models/*.js, Backend/scripts/seedAdmin.js.",
]


def make_styles():
    return {
        "title": ParagraphStyle(
            "title",
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=24,
            textColor=colors.HexColor("#0B3D2E"),
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            fontName="Helvetica",
            fontSize=9,
            leading=11,
            textColor=colors.HexColor("#52606D"),
        ),
        "section": ParagraphStyle(
            "section",
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=12,
            textColor=colors.HexColor("#0B3D2E"),
            spaceAfter=0,
        ),
        "body": ParagraphStyle(
            "body",
            fontName="Helvetica",
            fontSize=8.7,
            leading=11.1,
            textColor=colors.HexColor("#1F2933"),
        ),
        "bullet": ParagraphStyle(
            "bullet",
            fontName="Helvetica",
            fontSize=8.45,
            leading=10.8,
            leftIndent=0,
            textColor=colors.HexColor("#1F2933"),
        ),
        "footer": ParagraphStyle(
            "footer",
            fontName="Helvetica",
            fontSize=6.8,
            leading=8.4,
            textColor=colors.HexColor("#6B7280"),
        ),
    }


def draw_para(c, text, style, x, y, width):
    para = Paragraph(escape(text), style)
    _, height = para.wrap(width, 2000)
    para.drawOn(c, x, y - height)
    return y - height


def draw_section(c, title, items, styles, x, y, width, bullets=False):
    y = draw_para(c, title.upper(), styles["section"], x, y, width)
    c.setStrokeColor(colors.HexColor("#D97706"))
    c.setLineWidth(1)
    c.line(x, y - 3, x + 28, y - 3)
    y -= 12

    for item in items:
        content = f"- {item}" if bullets else item
        y = draw_para(c, content, styles["bullet"] if bullets else styles["body"], x, y, width)
        y -= 5 if bullets else 6

    return y - 6


def draw_header(c, styles, page_width, page_height):
    left = 40
    top = page_height - 42
    c.setFillColor(colors.HexColor("#F6F1E7"))
    c.roundRect(32, page_height - 108, page_width - 64, 68, 18, stroke=0, fill=1)

    c.setFillColor(colors.HexColor("#0B3D2E"))
    c.setFont("Helvetica-Bold", 22)
    c.drawString(left, top, TITLE)

    c.setFont("Helvetica", 9)
    c.setFillColor(colors.HexColor("#52606D"))
    c.drawString(left, top - 16, SUBTITLE)

    badge = "1 page | evidence-based"
    badge_width = stringWidth(badge, "Helvetica-Bold", 8) + 20
    badge_x = page_width - 40 - badge_width
    badge_y = top - 2
    c.setFillColor(colors.HexColor("#0B3D2E"))
    c.roundRect(badge_x, badge_y - 9, badge_width, 16, 8, stroke=0, fill=1)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(badge_x + 10, badge_y - 3.5, badge)

    return page_height - 126


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    styles = make_styles()
    page_width, page_height = letter
    c = canvas.Canvas(str(OUTPUT), pagesize=letter)
    c.setTitle(TITLE)
    c.setAuthor("OpenAI Codex")
    c.setSubject("Summary of the Grocery Store app based on repo evidence")

    y_start = draw_header(c, styles, page_width, page_height)

    margin = 40
    gap = 20
    col_width = (page_width - (margin * 2) - gap) / 2
    left_x = margin
    right_x = margin + col_width + gap

    left_y = y_start
    for title, items in LEFT_CONTENT:
        left_y = draw_section(
            c,
            title,
            items,
            styles,
            left_x,
            left_y,
            col_width,
            bullets=(title == "What It Does"),
        )

    right_y = y_start
    for title, items in RIGHT_CONTENT:
        right_y = draw_section(
            c,
            title,
            items,
            styles,
            right_x,
            right_y,
            col_width,
            bullets=True,
        )

    footer_y = 76
    c.setStrokeColor(colors.HexColor("#E5E7EB"))
    c.setLineWidth(0.7)
    c.line(margin, footer_y + 18, page_width - margin, footer_y + 18)
    for line in SOURCES:
        footer_y = draw_para(c, line, styles["footer"], margin, footer_y + 10, page_width - (margin * 2))
    draw_para(
        c,
        "Missing setup artifacts are labeled exactly as Not found in repo.",
        styles["footer"],
        margin,
        50,
        page_width - (margin * 2),
    )

    c.save()


if __name__ == "__main__":
    build_pdf()
