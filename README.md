# Scientific English Trainer

Ein kleiner Sprachtrainer für englischsprachige Erklärungen in Physical Chemistry II. Version 0.3 enthält 60 Vokabelkarten zu Classroom English, 113 Spektroskopie-Fachvokabeln, 53 Satzkarten und zehn kurze Hörsaal-Rollenspiele. Die Sammlung enthält eigens formulierte Beispiele, keine offiziellen Lehrunterlagen.

## Üben

[Classroom-English-Vokabeltrainer starten](https://ekerzendorfer.github.io/SCIENTIFIC_ENGLISH_TRAINER/?modus=vokabeln&thema=class) · [Spektroskopie-Vokabeltrainer starten](https://ekerzendorfer.github.io/SCIENTIFIC_ENGLISH_TRAINER/?modus=vokabeln)

- **Aktiv sprechen (DE → EN):** Erst laut formulieren, dann die Musterantwort und mögliche Varianten vergleichen.
- **Verstehen (EN → DE):** Die Bedeutung erklären. Eine englische Vorlesestimme kann je nach Gerät verfügbar sein.
- **Hörsaal-Rollenspiel:** Eine Studierendenfrage oder Unterrichtssituation frei in zwei bis drei Sätzen beantworten.
- **Vokabeltrainer:** Einzelne Fachbegriffe und kurze feste Wendungen, wahlweise DE → EN oder EN → DE, ohne Audio. Wähle 10, 20, 30 oder 50 Karten und optional ein Teilgebiet. Sind weniger Karten verfügbar, fällt die Runde kürzer aus.
- **Glossar:** Deutsch oder Englisch suchen. Der Themenfilter bleibt dabei aktiv.

Bei der Selbstbewertung zählt der Sinn, nicht der genaue Wortlaut. Fällige Karten kommen vor neuen. „Auch bereits geübte“ füllt eine Runde bei Bedarf mit Karten auf, die noch nicht fällig sind. Fortschritt und Fälligkeiten werden getrennt je Karte und Modus gespeichert. „Nicht gewusst“ fügt eine Wiederholung ans Rundenende und setzt die Karte für den nächsten Tag an. „Unsicher“ setzt sie für zwei Tage an. Mehrfach sicher gewusste Karten erhalten Abstände von 3, 7, 14 und 30 Tagen. Im Vokabeltrainer kommen sowohl „Nicht gewusst“ als auch „Unsicher“ einmal am Rundenende erneut vor und werden nach 24 Stunden wieder fällig. Eine erfolgreiche Sofortwiederholung ändert das nicht. Der Lernstand für Vokabeln wird pro Richtung separat geführt. Die bisherigen Sprechkarten und Lernstände bleiben unverändert.

Der Lernstand liegt im jeweiligen Browser. Export und Import übertragen ihn als JSON zwischen Geräten. Die App hat keine Anmeldung und nimmt kein Audio auf.

## Starten

**GitHub Pages:** Settings → Pages → Deploy from a branch → `main` und `/ (root)`.

**Lokal:** Im Projektordner `python -m http.server 8000` ausführen und `http://localhost:8000/` öffnen. Die HTML-Datei benötigt das benachbarte Glossar-JSON. Mit `python offline.py` lässt sich bei Bedarf eine separat zu öffnende Einzeldatei erzeugen.

## Glossar ergänzen

Alle Karten stehen in [data/glossary.json](data/glossary.json). Bestehende IDs nicht ändern, weil der Lernstand auf sie verweist. Pflichtfelder sind `id`, `type`, `category`, `de` und `en`. Optionen sind `alternatives`, `example_en`, `usage_note_de` und das Feldpaar `scenario_de` / `scenario_answer_en`. Vokabelkarten haben `type: "term"` und ein `group`, dessen Bezeichnung in `vocab_groups[category]` steht. Die Satzkarten haben weiterhin `type: "phrase"`. Die Sprechbeispiele sind eigene Formulierungen. Aus Sprechübungen übernommene Wendungen werden ohne Transkripte oder persönliche Angaben eingepflegt.

Der Schwerpunkt liegt auf Sprache für den Hörsaal. Die inhaltliche Zuordnung zu konkreten IMC-Übungseinheiten bleibt offen.
