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
  description: 'Das zentrale Workbook bündelt alle Übungen, Reflexionsfragen und Transferimpulse an einem Ort, statt sie über einzelne Module zu verstreuen.',
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
        description: 'Hier bekommst du den klaren Einstieg in BeyondBonus, verstehst den Aufbau des Programms und weißt von Anfang an, wie du die Inhalte wirklich für dich nutzt.',
        driveId: '1cfPZKkBQ5tSv5gLgE9GmMWAgK5LpSoMW',
      },
      {
        slug: 'bonusmama-formel',
        title: 'Die Bonusmama-Formel',
        description: 'Du lernst Sallys Bonusmama-Formel kennen und bekommst einen klaren Rahmen, um deine aktuelle Situation zwischen Klarheit, Veränderung und Kommunikation besser einzuordnen.',
        driveId: '1vAZXFZsP-mB_xLEJxCNmjiZBXsBfLZRQ',
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
        description: 'Diese Lektion hilft dir, deine Werte und Bedürfnisse ehrlich herauszuarbeiten, damit du im Patchworkalltag nicht nur funktionierst, sondern dich selbst wieder klarer spürst.',
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
        description: 'Du erkennst, was dich heute schon trägt, welche Stärken du in die Familie einbringst und an welchen Stellen Wachstum dich wirklich entlastet.',
        driveId: '1VtodVrFu5N8QYOZdYdOwt9t5u0p_sWeW',
      },
      {
        slug: 'saeulen-einer-bonusmama',
        title: 'Die Säulen einer Bonusmama',
        description: 'Du verstehst die zentralen Säulen einer erfüllten Bonusmama-Rolle und kannst klarer erkennen, was dir langfristig Stabilität, Orientierung und innere Sicherheit gibt.',
        driveId: '1-lHsdtRjtuc5rsmJ90mNkeDrvUPF2lJj',
      },
      {
        slug: '3-teller-regel',
        title: 'Die 3-Teller-Regel',
        description: 'Mit der 3-Teller-Regel sortierst du Verantwortung, Zuständigkeit und Grenzen neu, damit nicht automatisch alles auf deinem Teller landet.',
        driveId: '18iEyPJYWyZgLKva_paMTl7WqgxqAXNoF',
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
        description: 'Du verstehst, warum sich Patchwork oft gleichzeitig nach Nähe und Ausgeschlossensein anfühlt und wie diese Dynamik deinen Alltag beeinflusst.',
        driveId: '13-mtDQLzDRvnAZ83YUgstFRobg4IxrD1',
      },
      {
        slug: 'loyalitaetskonflikte',
        title: 'Loyalitätskonflikte',
        description: 'Diese Lektion zeigt dir, wie Loyalitätskonflikte im System wirken und warum sie Kinder, Eltern und Bonusmamas oft viel stärker steuern, als man von außen sieht.',
        driveId: '1IrLAjHZmh6uHZV5wbWvhzO19rPJNNTjb',
      },
      {
        slug: 'eifersucht',
        title: 'Eifersucht einordnen',
        description: 'Du lernst, Eifersucht nicht als peinlichen Makel zu sehen, sondern als Signal für ein tieferes Bedürfnis, das ernst genommen werden darf.',
        driveId: '1BjLO_0acv82xbcrkT2HMLjErzqPVMchR',
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
        description: 'Diese Masterclass hilft dir, Selbstfürsorge als echte Notwendigkeit zu verstehen, damit du im Patchworkalltag nicht dauerhaft über deine Grenzen gehst.',
        driveId: '1AoQD0eOcxL_XFM13FAMHQKvrJ2iRSluD',
      },
      {
        slug: 'museum-deines-lebens',
        title: 'Museum deines Lebens',
        description: 'Mit dieser Übung gehst du deinen biografischen Prägungen und alten Verletzungen achtsamer auf den Grund, statt nur ihre Folgen im Alltag zu spüren.',
        driveId: '1WxYsVasevdU6zPGV61_DtJoGUh8XG13_',
      },
      {
        slug: 'museumsanleitung',
        title: 'Anleitung zur Museumsübung',
        description: 'Diese Anleitung führt dich sicher in die Museumsübung hinein, damit du sie nicht nur verstehst, sondern auch wirklich für dich nutzen kannst.',
        driveId: '15AupbeFOQVRmS0_YI7B9AVQ3GD0LxZRs',
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
        description: 'Du erfährst, wie Vertrauen und Beziehung zu Bonuskindern wachsen können, ohne dass du dich verbiegst oder ständig überforderst.',
        driveId: '1bTy_nMCTPlLeG75nh0BSC1XpYFdSh2nV',
      },
      {
        slug: 'familienrituale',
        title: 'Familienrituale',
        description: 'Du bekommst konkrete Ideen für Familienrituale, die Sicherheit geben und im Alltag tatsächlich Verbindung statt nur zusätzlichen Aufwand schaffen.',
        driveId: '1JjO4XEoGCQRqspk9HlHylvB5kqDml8ao',
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
        description: 'Du entwickelst erste konkrete Schritte, um trotz engem Familienalltag wieder bewusste Paarzeit, Nähe und Verbindung zurückzuholen.',
        driveId: '1rK6yrHYAS8vCq_pYJ44BdPsR38t-Ywut',
      },
      {
        slug: 'sicherheit-in-der-partnerschaft',
        title: 'Sicherheit in der Partnerschaft',
        description: 'Diese Lektion zeigt euch, was eure Paarbasis wirklich stabilisiert und warum emotionale Sicherheit oft wichtiger ist als schnelle Lösungen.',
        driveId: '12v9lbcrPAFe324HNDEUrJGQO8kpp8mj6',
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
        description: 'Mit dem 4-Ohren-Modell erkennst du früher, auf welcher Ebene Gespräche entgleisen und warum Missverständnisse in Patchworkfamilien so schnell eskalieren.',
        driveId: '1vKhMbZF5dTVtWrQ7GQPCn9Xx_18Jmltp',
      },
      {
        slug: 'gespraeche-beginnen',
        title: 'Gespräche gut beginnen',
        description: 'Du lernst eine klare Gesprächsstruktur kennen, mit der schwierige Gespräche ruhiger beginnen und nicht schon in den ersten Sätzen kippen.',
        driveId: '1GAT4oX7yfL-Ld1N0SNA2BbgLipZiQxYJ',
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
        description: 'Du klärst, wo du in Ferienplanungen wirklich mitreden darfst, wo nicht und wie du dabei deine Grenzen klarer vertrittst.',
        driveId: '1rKRzjODrnJjs-ldbwfI9vix-0Syhwp4x',
      },
      {
        slug: 'empowernde-affirmationen',
        title: 'Empowernde Affirmationen',
        description: 'Diese Affirmationen geben dir stärkende Sätze an die Hand, die Selbstzweifel, Rückzug und innere Härte bewusst unterbrechen können.',
        driveId: '1H6iTP2s1fwl4FbxGSKWxhdgn843Ca-yj',
      },
      {
        slug: 'powertalk-the-one',
        title: 'Powertalk The One',
        description: 'Dieser Powertalk hilft dir, dich wieder mit deiner inneren Klarheit zu verbinden, wenn du dich gerade klein, unsicher oder aus dem Gleichgewicht fühlst.',
        driveId: '16pHWlfpCZix5JMenAU0FGRFAA_w6BJe9',
      },
      {
        slug: 'powertalk-the-queen',
        title: 'Powertalk The Queen',
        description: 'Ein kraftvoller Abschluss, der dich an deine innere Führung erinnert und dich mit mehr Haltung und Selbstvertrauen aus dem Programm gehen lässt.',
        driveId: '1Y_XWTKlQZtgYWF7Y7uG2XXiyQMvHQSMg',
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
