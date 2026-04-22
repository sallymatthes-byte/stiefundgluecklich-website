export type BeyondBonusLesson = {
  slug: string;
  title: string;
  description: string;
  driveId?: string;
  mediaType?: 'video' | 'audio';
  mediaUrl?: string;
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
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/start-einstieg/einfuehrung/video.mp4?md5=nVh9g23J0IzUkLb3Top9QA&expires=1808322694',
      },
      {
        slug: 'bonusmama-formel',
        title: 'Die Bonusmama-Formel',
        description: 'Du lernst Sallys Bonusmama-Formel kennen und bekommst einen klaren Rahmen, um deine aktuelle Situation zwischen Klarheit, Veränderung und Kommunikation besser einzuordnen.',
        driveId: '1vAZXFZsP-mB_xLEJxCNmjiZBXsBfLZRQ',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/start-einstieg/bonusmama-formel/media.mp4?md5=XGaYAP0TWMM9tCfhJswR2g&expires=1808396245',
      },
      {
        slug: 'coachingcard',
        title: 'Deine Coachingcard',
        description: 'Diese Lektion hilft dir, deinen persönlichen Ausgangspunkt und dein Warum festzuhalten, damit du dich im Prozess immer wieder neu ausrichten kannst.',
        driveId: '1-WScwKENCY_0JSY85--fH55wYB7awIdS',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/start-einstieg/coachingcard/media.mp4?md5=IdvgqbbekliuD5PCQb6YBQ&expires=1808401735',
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
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/vision-beduerfnisse/werte-und-beduerfnisse/media.mp4?md5=_XuDv7S9oIv4a9RLJYXF3A&expires=1808396245',
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
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/rolle-identitaet/staerken-und-entwicklungen/media.mp4?md5=n_Xg_nsaOWsI9rUbS7b3RQ&expires=1808396245',
      },
      {
        slug: 'mental-load-verstehen',
        title: 'Mental Load verstehen',
        description: 'Du erkennst, warum dein Kopf im Patchworkalltag oft nie wirklich Pause macht und wie unsichtbare Verantwortung dich dauerhaft belastet.',
        driveId: '1C4MkUgwnEM0azrzOoJsSloWfyCjkFqAC',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/rolle-identitaet/mental-load-verstehen/media.mp4?md5=Lw0NsohQhVStklKfawNvgw&expires=1808401735',
      },
      {
        slug: 'rolle-im-system',
        title: 'Deine Rolle im System',
        description: 'Diese Lektion hilft dir, deine Rolle zwischen Partnerin, Bonusmama und eigenständiger Person klarer zu greifen.',
        driveId: '1lSptJ14FO-O9ADjC_Fv0PQOqQU-E9v2r',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/rolle-identitaet/rolle-im-system/media.mp4?md5=FDrwCSrrC9asjwVI4iifzA&expires=1808401735',
      },
      {
        slug: 'saeulen-einer-bonusmama',
        title: 'Die Säulen einer Bonusmama',
        description: 'Du verstehst die zentralen Säulen einer erfüllten Bonusmama-Rolle und kannst klarer erkennen, was dir langfristig Stabilität, Orientierung und innere Sicherheit gibt.',
        driveId: '1-lHsdtRjtuc5rsmJ90mNkeDrvUPF2lJj',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/rolle-identitaet/saeulen-einer-bonusmama/media.mp4?md5=VdslOnjqg4oRRVZTPDqQfg&expires=1808396245',
      },
      {
        slug: '3-teller-regel',
        title: 'Die 3-Teller-Regel',
        description: 'Mit der 3-Teller-Regel sortierst du Verantwortung, Zuständigkeit und Grenzen neu, damit nicht automatisch alles auf deinem Teller landet.',
        driveId: '18iEyPJYWyZgLKva_paMTl7WqgxqAXNoF',
      mediaType: 'audio',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/rolle-identitaet/3-teller-regel/media.mp3?md5=esNiN9nJm0eIlFkWoELrBw&expires=1808396245',
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
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/patchworkdynamiken/insider-outsider/media.mp4?md5=ob_GyAWGKyXLXkjnyYjtSw&expires=1808396245',
      },
      {
        slug: 'loyalitaetskonflikte',
        title: 'Loyalitätskonflikte',
        description: 'Diese Lektion zeigt dir, wie Loyalitätskonflikte im System wirken und warum sie Kinder, Eltern und Bonusmamas oft viel stärker steuern, als man von außen sieht.',
        driveId: '1IrLAjHZmh6uHZV5wbWvhzO19rPJNNTjb',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/patchworkdynamiken/loyalitaetskonflikte/media.mp4?md5=nURwkrizpZBmsk2ehqZupw&expires=1808396245',
      },
      {
        slug: 'eifersucht',
        title: 'Eifersucht einordnen',
        description: 'Du lernst, Eifersucht nicht als peinlichen Makel zu sehen, sondern als Signal für ein tieferes Bedürfnis, das ernst genommen werden darf.',
        driveId: '1BjLO_0acv82xbcrkT2HMLjErzqPVMchR',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/patchworkdynamiken/eifersucht/media.mp4?md5=_HfEYFJccM4Ej8UAjbzgkA&expires=1808396245',
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
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kraftquellen-selbstfuehrsorge/masterclass-selbstfuersorge/media.mp4?md5=qYjt5pKJ2EkwbwOE0jqtkQ&expires=1808396245',
      },
      {
        slug: 'grenzen-setzen',
        title: 'Grenzen setzen',
        description: 'Du lernst, wie du klare Grenzen setzen kannst, ohne dich hart zu machen oder dich dabei selbst zu verlieren.',
        driveId: '1x73gUrI9KYNWVK58F5-k_hOwbYyg2Dqi',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kraftquellen-selbstfuehrsorge/grenzen-setzen/media.mp4?md5=1Ps2wUfjH20piWFd2wzF3A&expires=1808401735',
      },
      {
        slug: 'glaubenssaetze',
        title: 'Glaubenssätze verstehen',
        description: 'Diese Lektion macht sichtbar, welche tief verankerten Überzeugungen in dir wirken und wie sie deine Reaktionen im Patchwork mitsteuern.',
        driveId: '1r6EubOafhsWWNjWvBjjqljFgQhr5tGtN',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kraftquellen-selbstfuehrsorge/glaubenssaetze/media.mp4?md5=zBkL8kJ6a934mRXJ3T6eZw&expires=1808401735',
      },
      {
        slug: 'trigger-und-koerperreaktionen',
        title: 'Trigger und Körperreaktionen',
        description: 'Du verstehst besser, warum dein Körper in bestimmten Situationen sofort auf Alarm schaltet und wie du damit achtsamer umgehen kannst.',
        driveId: '13GSiAlYsG-QS8P6tHSbfh7FPg3cyB_dv',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kraftquellen-selbstfuehrsorge/trigger-und-koerperreaktionen/media.mp4?md5=uAdzupOXAOHq0h-5waRYLQ&expires=1808401735',
      },
      {
        slug: 'museum-deines-lebens',
        title: 'Museum deines Lebens',
        description: 'Mit dieser Übung gehst du deinen biografischen Prägungen und alten Verletzungen achtsamer auf den Grund, statt nur ihre Folgen im Alltag zu spüren.',
        driveId: '1WxYsVasevdU6zPGV61_DtJoGUh8XG13_',
      mediaType: 'audio',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kraftquellen-selbstfuehrsorge/museum-deines-lebens/media.mp3?md5=IfalSyks66j3ykhM3GopHA&expires=1808396245',
      },
      {
        slug: 'museumsanleitung',
        title: 'Anleitung zur Museumsübung',
        description: 'Diese Anleitung führt dich sicher in die Museumsübung hinein, damit du sie nicht nur verstehst, sondern auch wirklich für dich nutzen kannst.',
        driveId: '15AupbeFOQVRmS0_YI7B9AVQ3GD0LxZRs',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kraftquellen-selbstfuehrsorge/museumsanleitung/media.mp4?md5=ODeSOnkVJIn3_VOhoid8ng&expires=1808396245',
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
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/bonuskinder/vertrauen-und-beziehung/media.mp4?md5=iEmslhi6C6ebH98ZYHB1og&expires=1808396245',
      },
      {
        slug: 'teil-der-familie-werden',
        title: 'Teil der Familie werden',
        description: 'Diese Lektion begleitet dich in der Frage, wie Zugehörigkeit wachsen kann, wenn du dich innerlich noch zwischen Nähe und Außenrolle bewegst.',
        driveId: '1k321EgRUnkds3b5SBrLDLzmYkOkNs9iN',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/bonuskinder/teil-der-familie-werden/media.mp4?md5=46oR9XnmEbA8bf2HOAcxzA&expires=1808401735',
      },
      {
        slug: 'familienkultur',
        title: 'Familienkultur aufbauen',
        description: 'Du erkennst, wie ihr eine gemeinsame Familienkultur entwickeln könnt, statt nur nebeneinander verschiedene Alt-Systeme weiterzuführen.',
        driveId: '1DLN2E99xzJAog94jwmnrEsBSZ4nZ6Ua1',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/bonuskinder/familienkultur/media.mp4?md5=6LahQcVSAfhUURoSJq1YkQ&expires=1808401735',
      },
      {
        slug: 'familienrituale',
        title: 'Familienrituale',
        description: 'Du bekommst konkrete Ideen für Familienrituale, die Sicherheit geben und im Alltag tatsächlich Verbindung statt nur zusätzlichen Aufwand schaffen.',
        driveId: '1JjO4XEoGCQRqspk9HlHylvB5kqDml8ao',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/bonuskinder/familienrituale/media.mp4?md5=KoHh42P8iYL20PJkoRB6tw&expires=1808396245',
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
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/partnerschaft/paarzeit-zurueckerobern/media.mp4?md5=4jD9KfX37fxWamrUs-bUiQ&expires=1808396245',
      },
      {
        slug: 'unterschiedliche-erziehungsstile',
        title: 'Unterschiedliche Erziehungsstile',
        description: 'Ihr schaut auf verschiedene Prägungen in der Erziehung und darauf, wie ihr trotz Unterschiedlichkeit ein gemeinsames Team werden könnt.',
        driveId: '13ndIpxyGZdtb9SenV6GT46zmOz0fONGP',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/partnerschaft/unterschiedliche-erziehungsstile/media.mp4?md5=Ohg06OCPNN9prxWey5jgWg&expires=1808401735',
      },
      {
        slug: 'zwiegespraech',
        title: 'Das Zwiegespräch',
        description: 'Diese Lektion zeigt euch ein klares Ritual, mit dem ihr wieder tiefer miteinander ins Gespräch kommt als nur über Termine und To-dos.',
        driveId: '1ht-HVzizNpKV7qOyJeT0c9usdNnBQhaW',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/partnerschaft/zwiegespraech/media.mp4?md5=vTa2Yx-JrjwKy8B8q0QmsA&expires=1808401735',
      },
      {
        slug: 'sicherheit-in-der-partnerschaft',
        title: 'Sicherheit in der Partnerschaft',
        description: 'Diese Lektion zeigt euch, was eure Paarbasis wirklich stabilisiert und warum emotionale Sicherheit oft wichtiger ist als schnelle Lösungen.',
        driveId: '12v9lbcrPAFe324HNDEUrJGQO8kpp8mj6',
     mediaType: 'video',
     mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kommunikation/gewaltfreie-kommunikation/media.mp4?md5=Wu-STg28ui3izbrN347pvA&expires=1808401735',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/partnerschaft/sicherheit-in-der-partnerschaft/media.mp4?md5=5u60mGVjsCFeZcggUH0MOg&expires=1808396245',
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
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kommunikation/vier-ohren-modell/media.mp4?md5=EABKm_qhffHxchOoUIsRdw&expires=1808396245',
      },
      {
        slug: 'gespraeche-beginnen',
        title: 'Gespräche gut beginnen',
        description: 'Du lernst eine klare Gesprächsstruktur kennen, mit der schwierige Gespräche ruhiger beginnen und nicht schon in den ersten Sätzen kippen.',
        driveId: '1GAT4oX7yfL-Ld1N0SNA2BbgLipZiQxYJ',
        mediaType: 'audio',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kommunikation/gespraeche-beginnen/media.mp3?md5=ptRja3Vh914prEWE5E1OcQ&expires=1808396245',
      },
      {
        slug: 'ich-botschaften',
        title: 'Ich-Botschaften',
        description: 'Hier lernst du, wie du Angriffe vermeidest und trotzdem klar sagst, was in dir vorgeht und was du brauchst.',
        driveId: '1O8J0PH_QygV_eu2cLEXJP1XHroSxjH_c',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/rueckschlaege-einordnen/media.mp4?md5=w2TdS4AaauBXhNthyx2xkA&expires=1808401735',
      },
      {
        slug: 'aktives-zuhoeren',
        title: 'Aktives Zuhören',
        description: 'Diese Lektion zeigt, wie echtes Zuhören Verbindung schafft und warum bloßes Schweigen noch kein Verstehen ist.',
        driveId: '1adYNLH2fCW9l6KhW31DKJ4ejwgG9Nz0a',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kommunikation/aktives-zuhoeren/media.mp4?md5=HvoKrwqNvl3cwOCvYT7hjQ&expires=1808401735',
      },
      {
        slug: 'gewaltfreie-kommunikation',
        title: 'Gewaltfreie Kommunikation',
        description: 'Du bekommst mit der gewaltfreien Kommunikation ein Werkzeug, das Klarheit und Empathie miteinander verbindet.',
        driveId: '12v9lbcrPAFe324HNDEUrJGQO8kpp8mj6',
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
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/ferienplanung-mit-der-ex/media.mp4?md5=EB-g1vPipUVZVy-iOuD5mg&expires=1808396245',
      },
      {
        slug: 'ex-anerkennen',
        title: 'Die Ex anerkennen',
        description: 'Diese Lektion zeigt, wie du die Ex als Teil des Systems anerkennen kannst, ohne dich selbst klein zu machen oder dich zu verbiegen.',
        driveId: '1lyIZwBSJwIbDugmrKbdia2gl6Hd7r4XP',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/ex-anerkennen/media.mp4?md5=7tKeD2YReVTpcLZcaMQV2A&expires=1808401735',
      },
      {
        slug: 'ex-ist-zu-praesent',
        title: 'Wenn die Ex zu präsent ist',
        description: 'Du lernst, wie du damit umgehen kannst, wenn die Ex sich zu stark in eure Paarzeit und euren Alltag drängt.',
        driveId: '1KN75qQfCDIMcpcjiyCTW4m9LVz0CptdJ',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/ex-ist-zu-praesent/media.mp4?md5=90yPiv53Cc5FMsVVJMadRg&expires=1808401735',
      },
      {
        slug: 'eifersucht-bei-erinnerungen',
        title: 'Wenn alte Erinnerungen triggern',
        description: 'Diese Lektion hilft dir, besser zu verstehen, was in dir passiert, wenn gemeinsame Erinnerungen an die Zeit vor dir Eifersucht oder Schmerz auslösen.',
        driveId: '18oF-5M6RCX7TsR-IfnyRUv_uOFORVd4c',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/eifersucht-bei-erinnerungen/media.mp4?md5=JIoms8SGI8b37PTXtMyUbw&expires=1808401735',
      },
      {
        slug: 'rueckschlaege-einordnen',
        title: 'Rückschläge einordnen',
        description: 'Du lernst, Rückschläge nicht als Scheitern zu lesen, sondern als normalen Teil eines echten Entwicklungswegs.',
        driveId: '1O8J0PH_QygV_eu2cLEXJP1XHroSxjH_c',
      },
      {
        slug: 'erfolge-feiern',
        title: 'Erfolge bewusst feiern',
        description: 'Diese Lektion hilft dir, Fortschritte bewusst wahrzunehmen und nicht ständig zu übersehen, was du bereits geschafft hast.',
        driveId: '138HrExAoZLw_okSxdMQ8wmVQTnsQwZLy',
      mediaType: 'video',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/erfolge-feiern/media.mp4?md5=Vd8lWYbGytjo8tPFNGwMaA&expires=1808401735',
      },
      {
        slug: 'empowernde-affirmationen',
        title: 'Empowernde Affirmationen',
        description: 'Diese Affirmationen geben dir stärkende Sätze an die Hand, die Selbstzweifel, Rückzug und innere Härte bewusst unterbrechen können.',
        driveId: '1H6iTP2s1fwl4FbxGSKWxhdgn843Ca-yj',
      mediaType: 'audio',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/empowernde-affirmationen/media.mp3?md5=9zr1l1mu0lDBMlB02txb6w&expires=1808396245',
      },
      {
        slug: 'powertalk-the-one',
        title: 'Powertalk The One',
        description: 'Dieser Powertalk hilft dir, dich wieder mit deiner inneren Klarheit zu verbinden, wenn du dich gerade klein, unsicher oder aus dem Gleichgewicht fühlst.',
        driveId: '16pHWlfpCZix5JMenAU0FGRFAA_w6BJe9',
      mediaType: 'audio',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/powertalk-the-one/media.m4a?md5=f5wAAzkxtZ5n8NFeNYTKUA&expires=1808396245',
      },
      {
        slug: 'powertalk-the-queen',
        title: 'Powertalk The Queen',
        description: 'Ein kraftvoller Abschluss, der dich an deine innere Führung erinnert und dich mit mehr Haltung und Selbstvertrauen aus dem Programm gehen lässt.',
        driveId: '1Y_XWTKlQZtgYWF7Y7uG2XXiyQMvHQSMg',
      mediaType: 'audio',
      mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/powertalk-the-queen/media.wav?md5=SwIYDcKxkjghKcDrNF7dAw&expires=1808396245',
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
