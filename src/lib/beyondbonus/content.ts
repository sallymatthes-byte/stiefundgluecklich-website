export type BeyondBonusModule = {
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  intro: string;
  lessons: string[];
  downloads: string[];
};

export const beyondBonusModules: BeyondBonusModule[] = [
  {
    slug: 'start-einstieg',
    number: '01',
    title: 'Start & Einstieg',
    shortDescription: 'Ankommen, Orientierung gewinnen und den roten Faden für deinen Weg im Programm setzen.',
    intro: 'Hier startet BeyondBonus. Dieses Modul hilft dir, im Programm anzukommen, deinen eigenen Standort zu klären und die ersten Grundlagen für deinen Weg als Bonusmama zu setzen.',
    lessons: ['Einführungsvideo', 'Bonusmama-Formel'],
    downloads: ['Meilensteine.pdf', 'Workbook-Modul-1.pdf'],
  },
  {
    slug: 'vision-beduerfnisse',
    number: '02',
    title: 'Vision, Werte & Bedürfnisse',
    shortDescription: 'Verstehen, was dir wirklich wichtig ist und woran du dein Handeln künftig ausrichtest.',
    intro: 'In diesem Modul geht es um deine innere Ausrichtung. Du arbeitest heraus, welche Werte dich tragen und welche Bedürfnisse im Patchworkalltag oft zu kurz kommen.',
    lessons: ['Video Werte und Bedürfnisse'],
    downloads: ['Workbook-Modul-2.pdf'],
  },
  {
    slug: 'rolle-identitaet',
    number: '03',
    title: 'Rolle & Identität',
    shortDescription: 'Deinen Platz in der Familie klarer sehen und innere Überforderung besser einordnen.',
    intro: 'Dieses Modul dreht sich um deine Rolle in der Patchworkfamilie, Mental Load und die Frage, wie du Verantwortung klarer sortieren kannst.',
    lessons: ['Video Stärken und Entwicklungen', 'Video Säulen einer Bonusmama', '3-Teller-Regel'],
    downloads: ['Mental-Load-Matrix.pdf', 'Workbook-Modul-3.pdf'],
  },
  {
    slug: 'patchworkdynamiken',
    number: '04',
    title: 'Patchworkdynamiken',
    shortDescription: 'Die unsichtbaren Dynamiken hinter Loyalität, Zugehörigkeit und Spannungen besser verstehen.',
    intro: 'Hier schauen wir auf typische Patchworkdynamiken, damit du nicht nur reagierst, sondern Zusammenhänge erkennst und einordnen kannst.',
    lessons: ['Video Insider-Outsider', 'Video Loyalitätskonflikte', 'Video Eifersucht'],
    downloads: [],
  },
  {
    slug: 'kraftquellen-selbstfuehrsorge',
    number: '05',
    title: 'Kraftquellen & Selbstfürsorge',
    shortDescription: 'Stabilität aufbauen, Trigger besser verstehen und dir selbst wieder mehr Halt geben.',
    intro: 'Dieses Modul bündelt Selbstfürsorge, Triggerverständnis und innere Stabilisierung. Es ist die Basis dafür, dass du im Alltag nicht nur funktionierst, sondern bei dir bleibst.',
    lessons: ['Masterclass Selbstfürsorge', 'Museum deines Lebens', 'Video Museumsanleitung'],
    downloads: ['EFT-Anleitung.pdf', 'Grenzen-setzen.pdf', 'Meditationen.pdf', 'Selbstfuersorge.pdf'],
  },
  {
    slug: 'bonuskinder',
    number: '06',
    title: 'Bonuskinder',
    shortDescription: 'Beziehung aufbauen, Sicherheit geben und kindliche Bedürfnisse besser lesen.',
    intro: 'Hier geht es um die Beziehung zu den Bonuskindern, um Vertrauen, Familienrituale und darum, wie Verbindung im echten Alltag wachsen kann.',
    lessons: ['riverside_sally_take_02_aug_19_2025', 'riverside_sally_take_02_aug_21_2025'],
    downloads: ['Beduerfnisse-und-Gefuehle.pdf', 'Workshop-Familienrituale.pdf'],
  },
  {
    slug: 'partnerschaft',
    number: '07',
    title: 'Partnerschaft',
    shortDescription: 'Eure Paarbasis stärken, Sicherheit aufbauen und wieder mehr Verbindung schaffen.',
    intro: 'Dieses Modul stärkt eure Partnerschaft im Patchworkalltag. Es geht um Sicherheit, Paarzeit, Verständnis und gemeinsame Ausrichtung.',
    lessons: ['Paarzeit zurückerobern - auch wenn das Kind da ist', 'riverside_sally_take_04_aug_21_2025'],
    downloads: ['3-Fragen-fuer-Sicherheit.pdf', '5-Saetze-fuer-Verstaendnis.pdf', 'Finanz-Audit.pdf', 'Sprachen-der-Liebe.pdf', 'Werteworkshop.pdf'],
  },
  {
    slug: 'kommunikation',
    number: '08',
    title: 'Kommunikation',
    shortDescription: 'Gespräche klarer führen, Missverständnisse besser erkennen und Konflikte entschärfen.',
    intro: 'In diesem Modul geht es um Kommunikation, Gesprächsführung und konkrete Werkzeuge für schwierige Situationen.',
    lessons: ['4-Ohren-Modell', 'schools Paarübung - Gespräche beginnen'],
    downloads: ['4-Ohren-Modell-Grafik.jpg', 'Gewaltfreie-Kommunikation.pdf', 'Konflikt-Kit.pdf', 'SOS-Checkliste.pdf', 'Wuensche-in-Vorwuerfe.pdf'],
  },
  {
    slug: 'ex-partnerin-zukunft',
    number: '09',
    title: 'Ex-Partnerin & Zukunft',
    shortDescription: 'Mit Ex-Dynamiken klarer umgehen und den Blick wieder nach vorn richten.',
    intro: 'Zum Abschluss bündelt dieses Modul zwei Dinge, die für viele Bonusmamas zentral sind: der Umgang mit der Ex-Partnerin und der Blick nach vorne auf das, was bleiben und wachsen soll.',
    lessons: ['Ferienplanung mit der Ex - wo darfst du mitreden?', 'Empowernde Affirmationen', 'Powertalk - The One', 'Powertalk - The Queen'],
    downloads: ['Ex-Kommunikationsplan.pdf', 'Konflikte-deeskalieren.pdf', 'Leitfaden-hochstrittige-Ex.pdf', 'Erfolgs-Rituale.pdf', 'Meilensteine.pdf'],
  },
];

export function getBeyondBonusModule(slug: string) {
  return beyondBonusModules.find((module) => module.slug === slug);
}
