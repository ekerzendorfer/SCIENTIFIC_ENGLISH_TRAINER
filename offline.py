"""Build an optional single-file trainer from index.html and its glossary."""
from pathlib import Path

root = Path(__file__).resolve().parent
page = (root / 'index.html').read_text(encoding='utf-8')
data = (root / 'data' / 'glossary.json').read_text(encoding='utf-8')
# An HTML script raw-text element must never see a literal closing script tag.
data = data.replace('<', r'\u003c')
marker = '<!-- OFFLINE_DATA -->'
assert page.count(marker) == 1
embedded = '<script type="application/json" id="offline-data">' + data + '</script>'
(root / 'Scientific_English_Trainer.html').write_text(page.replace(marker, embedded), encoding='utf-8')
