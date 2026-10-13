"""Rebuild the standalone HTML with Python 3; no packages or network needed."""
from pathlib import Path

root = Path(__file__).resolve().parent
template = (root / 'src/template.html').read_text(encoding='utf-8')
library = (root / 'vendor/jspdf.umd.min.js').read_text(encoding='utf-8')
app = (root / 'src/app.js').read_text(encoding='utf-8')
html = template.replace('/* PDF_LIBRARY */', library).replace('/* APP_SCRIPT */', app)
(root / 'index.html').write_text(html, encoding='utf-8')
print('Built index.html (standalone and offline-ready)')
