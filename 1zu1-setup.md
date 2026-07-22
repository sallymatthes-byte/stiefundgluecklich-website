# 1:1-Bewerbungsprozess: technische Freigabe-Checkliste

Der Code ist absichtlich so gebaut, dass ohne vollständige Server-Konfiguration keine Bewerbungsdaten verloren gehen und kein Checkout gestartet wird.

## Routen

- `/1zu1-bewerbung/`: öffentliches 16-Fragen-Formular
- `/1zu1-bewerbung/ergebnis/kennenlernen/`: passende 1:1-Route, einzige Route mit Termin-CTA
- `/1zu1-bewerbung/ergebnis/kleiner-schritt/`
- `/1zu1-bewerbung/ergebnis/beyondbonus/`
- `/1zu1-bewerbung/ergebnis/noch-nicht/`
- `/1zu1-bewerbung/ergebnis/andere-unterstuetzung/`
- `/1zu1-angebot/`: private, nicht indexierte Angebots-/Checkout-Seite
- `/1zu1-angebot/danke/`: nicht indexierte Checkout-Dankeseite

## ActiveCampaign

Am 17.07.2026 live angelegt und in Cloudflare Pages hinterlegt:

- eigene Liste `1:1 Bewerbungen`
- Basis-Tag, fünf Ergebnis-Tags, Kauf-Tag und drei Zahlungsart-Tags
- vier Custom Fields für Route, strukturierte Antworten, Ziel und freiwillige Notizen
- `AC_1ZU1_ENABLED=true`

Der Adapter wurde mit einem temporären QA-Kontakt zweimal idempotent geprüft. Tags, Liste und alle vier Felder wurden anschließend über die API kontrolliert; der QA-Kontakt wurde wieder gelöscht.

Der API-Endpunkt validiert alle Antworten und berechnet die Route serverseitig. Freitexte beeinflussen die Route nicht. Wenn ActiveCampaign fehlt oder nicht antwortet, liefert der Endpoint einen Fehler statt einen falschen Erfolg anzuzeigen.

Vor Livegang rechtlich klären: Datenschutztext, Zweck und Löschfrist der Bewerbungsdaten, Verarbeitung der sensiblen Unterstützungsabgrenzung und E-Mail-Kontakt-Einwilligung.

## Terminlink

`PUBLIC_1ZU1_CALL_URL` ist ein öffentlicher Build-Time-Wert und enthält den finalen Google-Terminplan. Ohne Wert zeigt Route A einen neutralen Hinweis statt eines kaputten Buttons.

Der Terminplan `Kennenlerngespräch 1:1 Coaching` wurde am 22.07.2026 erstellt und live geprüft. Er bietet 30-Minuten-Termine montags bis freitags von 10:00 bis 12:00 Uhr und von 14:00 bis 17:00 Uhr, berücksichtigt Konflikte im Kalender `Außentermine` und erzeugt nach der Buchung automatisch einen Google-Meet-Link.

## Stripe

Am 17.07.2026 live angelegt und per GET verifiziert:

- Produkt `1:1 Coaching – 12 Wochen`
- einmaliger Preis 2.997 € inklusive TVA
- monatlicher Preis 1.549 € inklusive TVA
- monatlicher Preis 1.049 € inklusive TVA
- inklusive französische TVA-Rate 20 %

Die Preis-/Tax-IDs sind in Cloudflare Pages hinterlegt. Ein 2-Raten-Checkout sowie Einmal-/Raten-Checkouts mit TVA-Aufschlüsselung wurden live erstellt, geprüft und sofort unbezahlt geschlossen. Es wurde nichts berechnet. `ONE_TO_ONE_SALES_ENABLED=false` und `PUBLIC_1ZU1_OFFER_ENABLED=false` bleiben bis zur rechtlichen Freigabe gesetzt.

Die Checkout-API setzt:

- Einmalzahlung: `mode=payment`
- 2/3 Raten: `mode=subscription`
- ausschließlich sofort bestätigbare Kartenzahlung; Link kann über Stripe weiterhin erscheinen
- inklusive 20 % TVA; Einmalzahlung mit Stripe-Rechnung
- Session- und Subscription-Metadaten mit Produkt, Plan, Ratenanzahl und Schedule-Marker

Der bestehende signaturgeprüfte Stripe-Webhook isoliert `product=one-to-one` von BeyondBonus/ITS. Für Raten ruft er die Subscription ab, prüft exakt einen monatlichen Preis gegen die passende Env-Preis-ID und erstellt danach eine Subscription Schedule mit `iterations=2` oder `3` sowie `end_behavior=cancel`. Fehler liefern HTTP 500, damit Stripe erneut zustellt. Ein bestehender fremder Schedule wird nicht überschrieben.

Kauf- und Zahlungsart-Tags sowie die Bewerberinnen-Liste sind konfiguriert. Eine ActiveCampaign-Onboarding-Automation kann nicht per API erstellt werden und muss vor Verkaufsfreigabe im Dashboard ergänzt werden.

## Rechtliche und operative Blocker

Vor Livegang finalisieren und juristisch prüfen:

- Vertrag, Widerrufsbelehrung und Zeitpunkt ihrer Bereitstellung
- AGB für das konkrete 12-Wochen-Angebot
- Startdatum, Angebotsannahmefrist, Terminverschiebung und No-Show-Regeln
- konkrete Telegram-Antwortzeiten
- BeyondBonus-Zugriffsdauer über die 12 Wochen hinaus
- lokale Krisen-/Fachstellenhinweise für die Zielmärkte
- Stripe-Preis-Tax-Behavior und korrekte TVA-/Rechnungslogik

Zusätzlich müssen die bestehenden AGB vor der Verkaufsfreigabe an den neuen Ablauf angepasst werden: derzeit nennen sie Ratenfälligkeit jeweils zum Monatsersten und Telegram-Antworten an allen Werktagen; das widerspricht den automatischen Monatsabbuchungen ab Kaufdatum und den neuen Antworttagen Montag, Mittwoch und Freitag.

Die Dankeseite ist keine serverseitige Zahlungsbestätigung. Verbindliche Onboarding-Automationen dürfen ausschließlich vom signierten Stripe-Webhook ausgelöst werden.

## Bekannte technische Grenzen

- „Privat“ bedeutet aktuell: nicht verlinkt, `noindex` und aus der Sitemap ausgeschlossen. Die Angebots-URL ist nicht durch Login oder individuellen Zugriffstoken geschützt.
- Der öffentliche Bewerbungsendpunkt prüft Origin, Content-Type, Feldlängen, erlaubte Antwortwerte und ein Honeypot-Feld. Das stateless Cloudflare-Pages-Modell enthält noch kein persistentes Rate Limit; vor größerem Traffic sollte Cloudflare Turnstile oder ein Edge-Rate-Limit ergänzt werden.
- Subscription-Schedule-Aufrufe wurden ohne echte Stripe-Verbindung mit signierten Mock-Events geprüft. Vor Livegang ist ein vollständiger Stripe-Testmode-Kauf für 2 und 3 Raten Pflicht, inklusive Kontrolle der Invoice-Termine und der automatischen Kündigung.
- Die Ergebnisroute mit Terminlink ist eine eindeutige statische URL. Sie ist nicht gegen manuelles Aufrufen geschützt; der Terminplan selbst sollte daher zusätzlich nur die gewünschten Zeitfenster und Kapazitäten freigeben.
