# Scientific English Trainer

Ein kleiner Sprachtrainer für englischsprachige Erklärungen in Physical Chemistry II. Die erste Version enthält 53 Glossarkarten und zehn kurze Hörsaal-Rollenspiele. Die Sammlung enthält eigens formulierte Beispiele, keine offiziellen Lehrunterlagen.

## Üben

- **Aktiv sprechen (DE → EN):** Erst laut formulieren, dann die Musterantwort und mögliche Varianten vergleichen.
- **Verstehen (EN → DE):** Die Bedeutung erklären. Eine englische Vorlesestimme kann je nach Gerät verfügbar sein.
- **Hörsaal-Rollenspiel:** Eine Studierendenfrage oder Unterrichtssituation frei in zwei bis drei Sätzen beantworten.
- **Glossar:** Deutsch oder Englisch suchen. Der Themenfilter bleibt dabei aktiv.

Bei der Selbstbewertung zählt der Sinn, nicht der genaue Wortlaut. Fällige Karten kommen vor neuen. „Auch bereits geübte“ füllt eine Runde bei Bedarf mit Karten auf, die noch nicht fällig sind. Fortschritt und Fälligkeiten werden getrennt je Karte und Modus gespeichert. „Nicht gewusst“ fügt eine Wiederholung ans Rundenende und setzt die Karte für den nächsten Tag an. „Unsicher“ setzt sie für zwei Tage an. Mehrfach sicher gewusste Karten erhalten Abstände von 3, 7, 14 und 30 Tagen. Nach einer Sofortwiederholung bleibt die Karte für den nächsten Tag angesetzt.

Der Lernstand liegt im jeweiligen Browser. Export und Import übertragen ihn als JSON zwischen Geräten. Die App hat keine Anmeldung und nimmt kein Audio auf.

## Starten

**GitHub Pages:** Settings → Pages → Deploy from a branch → `main` und `/ (root)`.

**Lokal:** Im Projektordner `python -m http.server 8000` ausführen und `http://localhost:8000/` öffnen. Die HTML-Datei benötigt das benachbarte Glossar-JSON. Mit `python offline.py` lässt sich bei Bedarf eine separat zu öffnende Einzeldatei erzeugen.

## Glossar ergänzen

Alle Karten stehen in [data/glossary.json](data/glossary.json). Bestehende IDs nicht ändern, weil der Lernstand auf sie verweist. Pflichtfelder sind `id`, `type`, `category`, `de` und `en`. Optionen sind `alternatives`, `example_en`, `usage_note_de` und das Feldpaar `scenario_de` / `scenario_answer_en`. Karten sind eigene Formulierungen. Aus Sprechübungen übernommene Wendungen werden ohne Transkripte oder persönliche Angaben eingepflegt.

Der Schwerpunkt liegt auf Sprache für den Hörsaal. Die inhaltliche Zuordnung zu konkreten IMC-Übungseinheiten bleibt offen.
