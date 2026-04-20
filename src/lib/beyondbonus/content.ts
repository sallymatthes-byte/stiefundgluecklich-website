export type BeyondBonusLesson = {
  slug: string;
  title: string;
  description: string;
  driveId?: string;
};

export type BeyondBonusModule = {
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  intro: string;
  lessons: BeyondBonusLesson[];
};

export const workbookInfo = {
  title: 'BeyondBonus Workbook',
  description: 'Ein zentrales Workbook für das ganze Programm. Es wird im nächsten Schritt final angebunden und ersetzt separate Modul-Downloads.',
};

export const beyondBonusModules: BeyondBonusModule[] = [
  {
    slug: 'start-einstieg',
    number: '01',
    title: 'Start & Einstieg',
    shortDescription: 'Ankommen, Orientierung gewinnen und den roten Faden für deinen Weg im Programm setzen.',
    intro: 'Hier startet BeyondBonus. Dieses Modul hilft dir, im Programm anzukommen, deinen eigenen Standort zu klären und die ersten Grundlagen für deinen Weg als Bonusmama zu setzen.',
    lessons: [
      {
        slug: 'einfuehrung',
        title: 'Einführung',
        description: 'Dein Einstieg in BeyondBonus und die Grundidee hinter dem gesamten Kurs.',
      },
      {
        slug: 'bonusmama-formel',
        title: 'Die Bonusmama-Formel',
        description: 'Ein erster Orientierungsrahmen, damit du deine Situation klarer einordnen kannst.',
      },
    ],
  },
  {
    slug: 'vision-beduerfnisse',
    number: '02',
    title: 'Vision, Werte & Bedürfnisse',
    shortDescription: 'Verstehen, was dir wirklich wichtig ist und woran du dein Handeln künftig ausrichtest.',
    intro: 'In diesem Modul geht es um deine innere Ausrichtung. Du arbeitest heraus, welche Werte dich tragen und welche Bedürfnisse im Patchworkalltag oft zu kurz kommen.',
    lessons: [
      {
        slug: 'werte-und-beduerfnisse',
        title: 'Werte und Bedürfnisse',
        description: 'Eine ehrliche Bestandsaufnahme darüber, was dir wirklich wichtig ist und was du brauchst.',
        driveId: '1X8bsZLF4-OUVbmso3lzJe9NPmwZ3jj5s',
      },
    ],
  },
  {
    slug: 'rolle-identitaet',
    number: '03',
    title: 'Rolle & Identität',
    shortDescription: 'Deinen Platz in der Familie klarer sehen und innere Überforderung besser einordnen.',
    intro: 'Dieses Modul dreht sich um deine Rolle in der Patchworkfamilie, Mental Load und die Frage, wie du Verantwortung klarer sortieren kannst.',
    lessons: [
      {
        slug: 'staerken-und-entwicklungen',
        title: 'Stärken und Entwicklungen',
        description: 'Ein Blick auf das, was dich bereits trägt, und auf die Entwicklung, die vor dir liegt.',
      },
      {
        slug: 'saeulen-einer-bonusmama',
        title: 'Die Säulen einer Bonusmama',
        description: 'Die Grundpfeiler für mehr Stabilität und Klarheit in deiner Rolle.',
      },
      {
        slug: '3-teller-regel',
        title: 'Die 3-Teller-Regel',
        description: 'Ein konkretes Modell, um Verantwortung, Zuständigkeit und Abgrenzung besser zu sortieren.',
      },
    ],
  },
  {
    slug: 'patchworkdynamiken',
    number: '04',
    title: 'Patchworkdynamiken',
    shortDescription: 'Die unsichtbaren Dynamiken hinter Loyalität, Zugehörigkeit und Spannungen besser verstehen.',
    intro: 'Hier schauen wir auf typische Patchworkdynamiken, damit du nicht nur reagierst, sondern Zusammenhänge erkennst und einordnen kannst.',
    lessons: [
      {
        slug: 'insider-outsider',
        title: 'Insider-Outsider-Dynamik',
        description: 'Verstehen, warum du dich manchmal gleichzeitig mittendrin und außen vor fühlst.',
      },
      {
        slug: 'loyalitaetskonflikte',
        title: 'Loyalitätskonflikte',
        description: 'Wie Loyalität wirkt und warum sie Kinder, Eltern und Bonusmamas so stark beeinflusst.',
      },
      {
        slug: 'eifersucht',
        title: 'Eifersucht einordnen',
        description: 'Eifersucht enttabuisieren und als Signal statt als Makel lesen lernen.',
      },
    ],
  },
  {
    slug: 'kraftquellen-selbstfuehrsorge',
    number: '05',
    title: 'Kraftquellen & Selbstfürsorge',
    shortDescription: 'Stabilität aufbauen, Trigger besser verstehen und dir selbst wieder mehr Halt geben.',
    intro: 'Dieses Modul bündelt Selbstfürsorge, Triggerverständnis und innere Stabilisierung. Es ist die Basis dafür, dass du im Alltag nicht nur funktionierst, sondern bei dir bleibst.',
    lessons: [
      {
        slug: 'masterclass-selbstfuersorge',
        title: 'Masterclass Selbstfürsorge',
        description: 'Die Grundlage dafür, dass du im Patchworkalltag nicht ständig über deine Grenzen gehst.',
        driveId: '1AoQD0eOcxL_XFM13FAMHQKvrJ2iRSluD',
      },
      {
        slug: 'museum-deines-lebens',
        title: 'Museum deines Lebens',
        description: 'Eine Übung, mit der du biografische Prägungen und alte Verletzungen bewusster einordnen kannst.',
      },
      {
        slug: 'museumsanleitung',
        title: 'Anleitung zur Museumsübung',
        description: 'Die begleitende Einführung, damit du die Übung für dich wirklich nutzen kannst.',
      },
    ],
  },
  {
    slug: 'bonuskinder',
    number: '06',
    title: 'Bonuskinder',
    shortDescription: 'Beziehung aufbauen, Sicherheit geben und kindliche Bedürfnisse besser lesen.',
    intro: 'Hier geht es um die Beziehung zu den Bonuskindern, um Vertrauen, Familienrituale und darum, wie Verbindung im echten Alltag wachsen kann.',
    lessons: [
      {
        slug: 'vertrauen-und-beziehung',
        title: 'Vertrauen und Beziehung',
        description: 'Wie Verbindung zu Bonuskindern wachsen kann, ohne dich zu verbiegen oder zu überfordern.',
      },
      {
        slug: 'familienrituale',
        title: 'Familienrituale',
        description: 'Welche kleinen Rituale Sicherheit geben und im Alltag wirklich etwas verändern können.',
      },
    ],
  },
  {
    slug: 'partnerschaft',
    number: '07',
    title: 'Partnerschaft',
    shortDescription: 'Eure Paarbasis stärken, Sicherheit aufbauen und wieder mehr Verbindung schaffen.',
    intro: 'Dieses Modul stärkt eure Partnerschaft im Patchworkalltag. Es geht um Sicherheit, Paarzeit, Verständnis und gemeinsame Ausrichtung.',
    lessons: [
      {
        slug: 'paarzeit-zurueckerobern',
        title: 'Paarzeit zurückerobern',
        description: 'Wie ihr wieder Nähe und Paarzeit aufbaut, auch wenn der Familienalltag eng ist.',
        driveId: '1rK6yrHYAS8vCq_pYJ44BdPsR38t-Ywut',
      },
      {
        slug: 'sicherheit-in-der-partnerschaft',
        title: 'Sicherheit in der Partnerschaft',
        description: 'Was eure Paarbasis stabilisiert und warum Sicherheit oft vor Lösungen kommt.',
      },
    ],
  },
  {
    slug: 'kommunikation',
    number: '08',
    title: 'Kommunikation',
    shortDescription: 'Gespräche klarer führen, Missverständnisse besser erkennen und Konflikte entschärfen.',
    intro: 'In diesem Modul geht es um Kommunikation, Gesprächsführung und konkrete Werkzeuge für schwierige Situationen.',
    lessons: [
      {
        slug: 'vier-ohren-modell',
        title: 'Das 4-Ohren-Modell',
        description: 'Verstehen, warum Gespräche so schnell kippen und wie du Missverständnisse früher erkennst.',
      },
      {
        slug: 'gespraeche-beginnen',
        title: 'Gespräche gut beginnen',
        description: 'Ein strukturierter Einstieg, damit schwierige Gespräche nicht schon am Anfang eskalieren.',
      },
    ],
  },
  {
    slug: 'ex-partnerin-zukunft',
    number: '09',
    title: 'Ex-Partnerin & Zukunft',
    shortDescription: 'Mit Ex-Dynamiken klarer umgehen und den Blick wieder nach vorn richten.',
    intro: 'Zum Abschluss bündelt dieses Modul zwei Dinge, die für viele Bonusmamas zentral sind: der Umgang mit der Ex-Partnerin und der Blick nach vorne auf das, was bleiben und wachsen soll.',
    lessons: [
      {
        slug: 'ferienplanung-mit-der-ex',
        title: 'Ferienplanung mit der Ex',
        description: 'Wo du mitreden darfst, wo nicht und wie du in solchen Konstellationen klarer bleibst.',
      },
      {
        slug: 'empowernde-affirmationen',
        title: 'Empowernde Affirmationen',
        description: 'Stärkende Sätze als mentale Gegenbewegung zu Selbstzweifel und Rückzug.',
      },
      {
        slug: 'powertalk-the-one',
        title: 'Powertalk The One',
        description: 'Ein Audio, das dich wieder mit deiner inneren Klarheit und Stärke verbindet.',
      },
      {
        slug: 'powertalk-the-queen',
        title: 'Powertalk The Queen',
        description: 'Ein stärkender Abschluss, der dich an deine innere Führung erinnert.',
      },
    ],
  },
];

export function getBeyondBonusModule(slug: string) {
  return beyondBonusModules.find((module) => module.slug === slug);
}

export function getBeyondBonusLesson(moduleSlug: string, lessonSlug: string) {
  return getBeyondBonusModule(moduleSlug)?.lessons.find((lesson) => lesson.slug === lessonSlug);
}

export function getLessonKey(moduleSlug: string, lessonSlug: string) {
  return `${moduleSlug}::${lessonSlug}`;
}
