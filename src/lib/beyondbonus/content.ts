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
  moduleCover: string;
  lessons: BeyondBonusLesson[];
};

export const workbookInfo = {
  title: 'BeyondBonus Workbook',
  description: 'Das zentrale Workbook bündelt alle Übungen, Reflexionsfragen und Transferimpulse an einem Ort, statt sie über einzelne Module zu verstreuen.',
  driveId: '1EpQ5qIpr_jUpA5rcVYNMstKHttXkweQk',
  driveUrl: 'https://drive.google.com/file/d/1EpQ5qIpr_jUpA5rcVYNMstKHttXkweQk/view?usp=drive_link',
  embedUrl: '/workbooks/beyondbonus-workbook.pdf',
  downloadUrl: '/workbooks/beyondbonus-workbook.pdf',
};

export const lessonHeaderImage = '/images/beyondbonus/sally-hero-wide.jpg';

export const beyondBonusModules: BeyondBonusModule[] = [
  {
    slug: 'start-einstieg',
    number: '01',
    title: 'Start & Einstieg',
    shortDescription: 'Ankommen, Orientierung gewinnen und den roten Faden für deinen Weg im Programm setzen.',
    intro: 'Hier startet BeyondBonus. Dieses Modul hilft dir, im Programm anzukommen, deinen eigenen Standort zu klären und die ersten Grundlagen für deinen Weg als Bonusmama zu setzen.',
    moduleCover: '/images/beyondbonus/covers/willkommen.png',
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
    slug: 'deine-vision',
    number: '02',
    title: 'Deine Vision',
    shortDescription: 'Erarbeite dir deine Ziele und Träume für dich und deine Patchworkfamilie.',
    intro: 'In diesem Modul geht es um deine innere Ausrichtung, deine Wünsche und darum, wie du wieder klarer spürst, wohin dein Weg eigentlich gehen soll.',
    moduleCover: '/images/beyondbonus/covers/vision.png',
    lessons: [
      {
        slug: 'museum-deines-lebens-einfuehrung',
        title: 'Das Museum deines Lebens, Einführung',
        description: 'Diese Lektion führt dich behutsam in die Übung ein, damit du deine biografischen Prägungen bewusster anschauen kannst.',
        driveId: '15AupbeFOQVRmS0_YI7B9AVQ3GD0LxZRs',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kraftquellen-selbstfuehrsorge/museumsanleitung/media.mp4?md5=ODeSOnkVJIn3_VOhoid8ng&expires=1808396245',
      },
      {
        slug: 'museum-deines-lebens-meditation',
        title: 'Das Museum deines Lebens, Meditation',
        description: 'Die begleitende Meditation hilft dir, die Übung nicht nur kognitiv zu verstehen, sondern innerlich wirklich zu durchlaufen.',
        driveId: '1WxYsVasevdU6zPGV61_DtJoGUh8XG13_',
        mediaType: 'audio',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kraftquellen-selbstfuehrsorge/museum-deines-lebens/media.mp3?md5=IfalSyks66j3ykhM3GopHA&expires=1808396245',
      },
      {
        slug: 'werte-und-beduerfnisse',
        title: 'Werte und Bedürfnisse',
        description: 'Diese Lektion hilft dir, deine Werte und Bedürfnisse ehrlich herauszuarbeiten, damit du im Patchworkalltag nicht nur funktionierst, sondern dich selbst wieder klarer spürst.',
        driveId: '1X8bsZLF4-OUVbmso3lzJe9NPmwZ3jj5s',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/vision-beduerfnisse/werte-und-beduerfnisse/media.mp4?md5=_XuDv7S9oIv4a9RLJYXF3A&expires=1808396245',
      },
      {
        slug: 'glaubenssaetze',
        title: 'Glaubenssätze',
        description: 'Diese Lektion macht sichtbar, welche tief verankerten Überzeugungen in dir wirken und wie sie deine Reaktionen im Patchwork mitsteuern.',
        driveId: '1r6EubOafhsWWNjWvBjjqljFgQhr5tGtN',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kraftquellen-selbstfuehrsorge/glaubenssaetze/media.mp4?md5=zBkL8kJ6a934mRXJ3T6eZw&expires=1808401735',
      },
      {
        slug: 'visionboard',
        title: 'Visionboard',
        description: 'Hier hältst du fest, wie dein Weg als Bonusmama aussehen soll und woran du dich in schwierigen Momenten wieder erinnern möchtest.',
      },
    ],
  },
  {
    slug: 'persoenlichkeit-und-rolle',
    number: '03',
    title: 'Persönlichkeit & Rolle',
    shortDescription: 'Deinen Platz in der Familie klarer sehen und deine Rolle bewusster gestalten.',
    intro: 'Dieses Modul dreht sich um deinen Platz im System, deine Rolle in der Familie und darum, wie du Verantwortung, Identität und Selbstbild besser sortierst.',
    moduleCover: '/images/beyondbonus/covers/mindset.png',
    lessons: [
      {
        slug: 'saeulen-einer-bonusmama',
        title: 'Die Säulen einer Bonusmama',
        description: 'Du verstehst die zentralen Säulen einer erfüllten Bonusmama-Rolle und kannst klarer erkennen, was dir langfristig Stabilität, Orientierung und innere Sicherheit gibt.',
        driveId: '1-lHsdtRjtuc5rsmJ90mNkeDrvUPF2lJj',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/rolle-identitaet/saeulen-einer-bonusmama/media.mp4?md5=VdslOnjqg4oRRVZTPDqQfg&expires=1808396245',
      },
      {
        slug: 'staerken-und-entwicklungen',
        title: 'Stärken und Entwicklungen',
        description: 'Du erkennst, was dich heute schon trägt, welche Stärken du in die Familie einbringst und an welchen Stellen Wachstum dich wirklich entlastet.',
        driveId: '1VtodVrFu5N8QYOZdYdOwt9t5u0p_sWeW',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/rolle-identitaet/staerken-und-entwicklungen/media.mp4?md5=n_Xg_nsaOWsI9rUbS7b3RQ&expires=1808396245',
      },
      {
        slug: 'rollen-check',
        title: 'Rollen-Check',
        description: 'Diese Lektion hilft dir, deine Rolle zwischen Partnerin, Bonusmama und eigenständiger Person klarer zu greifen.',
        driveId: '1lSptJ14FO-O9ADjC_Fv0PQOqQU-E9v2r',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/rolle-identitaet/rolle-im-system/media.mp4?md5=FDrwCSrrC9asjwVI4iifzA&expires=1808401735',
      },
      {
        slug: 'mental-load-matrix',
        title: 'Mental-Load-Matrix',
        description: 'Du erkennst, warum dein Kopf im Patchworkalltag oft nie wirklich Pause macht und wie unsichtbare Verantwortung dich dauerhaft belastet.',
        driveId: '1C4MkUgwnEM0azrzOoJsSloWfyCjkFqAC',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/rolle-identitaet/mental-load-verstehen/media.mp4?md5=Lw0NsohQhVStklKfawNvgw&expires=1808401735',
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
    shortDescription: 'Die unsichtbaren Dynamiken hinter Zugehörigkeit, Loyalität und Stress im System besser verstehen.',
    intro: 'Hier schaust du auf typische Patchworkdynamiken, damit du nicht nur reagierst, sondern Zusammenhänge erkennst, einordnest und gezielter handeln kannst.',
    moduleCover: '/images/beyondbonus/covers/dynamik.png',
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
        slug: 'nervensystem',
        title: 'Dein Nervensystem verstehen',
        description: 'Diese Lektion zeigt dir, warum dein Körper in Belastungssituationen so schnell in Alarm geht und wie du besser damit arbeiten kannst.',
        driveId: '13GSiAlYsG-QS8P6tHSbfh7FPg3cyB_dv',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kraftquellen-selbstfuehrsorge/trigger-und-koerperreaktionen/media.mp4?md5=uAdzupOXAOHq0h-5waRYLQ&expires=1808401735',
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
        slug: 'familienkultur',
        title: 'Familienkultur',
        description: 'Du erkennst, wie ihr eine gemeinsame Familienkultur entwickeln könnt, statt nur nebeneinander verschiedene Alt-Systeme weiterzuführen.',
        driveId: '1DLN2E99xzJAog94jwmnrEsBSZ4nZ6Ua1',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/bonuskinder/familienkultur/media.mp4?md5=6LahQcVSAfhUURoSJq1YkQ&expires=1808401735',
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
    slug: 'kraftquellen',
    number: '05',
    title: 'Kraftquellen',
    shortDescription: 'Stärke deine innere Stabilität und sammle konkrete Werkzeuge für deinen Alltag.',
    intro: 'In diesem Modul geht es darum, wie du wieder mehr bei dir ankommst, deine Kraftquellen stärkst und dir selbst im Patchworkalltag besser Halt gibst.',
    moduleCover: '/images/beyondbonus/covers/power.png',
    lessons: [
      {
        slug: 'selfcare-basics',
        title: 'Selfcare-Basics',
        description: 'Du bekommst einen klaren Einstieg, wie Selbstfürsorge im Alltag nicht nur schön klingt, sondern wirklich tragfähig wird.',
      },
      {
        slug: 'gefuehle-verstehen',
        title: 'Gefühle verstehen',
        description: 'Hier schaust du auf Gefühle als Wegweiser statt als Störfaktor und lernst, sie besser einzuordnen.',
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
        slug: 'masterclass-selbstfuersorge',
        title: 'Masterclass Selbstfürsorge',
        description: 'Diese Masterclass hilft dir, Selbstfürsorge als echte Notwendigkeit zu verstehen, damit du im Patchworkalltag nicht dauerhaft über deine Grenzen gehst.',
        driveId: '1AoQD0eOcxL_XFM13FAMHQKvrJ2iRSluD',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kraftquellen-selbstfuehrsorge/masterclass-selbstfuersorge/media.mp4?md5=qYjt5pKJ2EkwbwOE0jqtkQ&expires=1808396245',
      },
      {
        slug: 'affirmationen',
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
      {
        slug: 'eft',
        title: 'EFT / Klopftechnik',
        description: 'Hier wird die Klopftechnik als zusätzliches Regulationswerkzeug vorbereitet.',
      },
    ],
  },
  {
    slug: 'bonuskinder',
    number: '06',
    title: 'Bonuskinder',
    shortDescription: 'Verstehe die Bedürfnisse der Kinder besser und baue Beziehung mit mehr Sicherheit auf.',
    intro: 'Hier geht es um die Beziehung zu den Bonuskindern, um Vertrauen, Sicherheit und darum, wie Verbindung im echten Alltag wachsen kann.',
    moduleCover: '/images/beyondbonus/covers/verbindung.png',
    lessons: [
      {
        slug: 'beduerfnisse-der-bonuskinder',
        title: 'Bedürfnisse der Bonuskinder',
        description: 'Diese Lektion hilft dir zu verstehen, was Kinder in schwierigen Momenten wirklich brauchen und warum ihr Verhalten oft mehr Schutz als Ablehnung ist.',
        driveId: '1k321EgRUnkds3b5SBrLDLzmYkOkNs9iN',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/bonuskinder/teil-der-familie-werden/media.mp4?md5=46oR9XnmEbA8bf2HOAcxzA&expires=1808401735',
      },
      {
        slug: 'connection-first',
        title: 'Connection first',
        description: 'Du erfährst, wie Vertrauen und Beziehung zu Bonuskindern wachsen können, ohne dass du dich verbiegst oder ständig überforderst.',
        driveId: '1bTy_nMCTPlLeG75nh0BSC1XpYFdSh2nV',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/bonuskinder/vertrauen-und-beziehung/media.mp4?md5=iEmslhi6C6ebH98ZYHB1og&expires=1808396245',
      },
      {
        slug: 'familienrituale',
        title: 'Familienrituale',
        description: 'Du bekommst konkrete Ideen für Familienrituale, die Sicherheit geben und im Alltag tatsächlich Verbindung statt nur zusätzlichen Aufwand schaffen.',
        driveId: '1JjO4XEoGCQRqspk9HlHylvB5kqDml8ao',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/bonuskinder/familienrituale/media.mp4?md5=KoHh42P8iYL20PJkoRB6tw&expires=1808396245',
      },
      {
        slug: 'schlafsituationen',
        title: 'Schlafsituationen begleiten',
        description: 'Hier geht es um Nähe, Sicherheit und Grenzen in Schlafsituationen, die im Patchwork oft besonders sensibel sind.',
      },
    ],
  },
  {
    slug: 'partnerschaft',
    number: '07',
    title: 'Partnerschaft',
    shortDescription: 'Stärke eure Paarbasis und finde Wege für mehr Sicherheit, Verbindung und Teamgefühl.',
    intro: 'Dieses Modul stärkt eure Partnerschaft im Patchworkalltag. Es geht um Nähe, Stabilität, gemeinsame Ausrichtung und echte Verbindung.',
    moduleCover: '/images/beyondbonus/covers/team.png',
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
        slug: 'liebessprachen',
        title: 'Sprachen der Liebe',
        description: 'Diese Lektion hilft euch zu verstehen, wie ihr Liebe unterschiedlich zeigt und wahrnehmt.',
      },
      {
        slug: 'werte',
        title: 'Werte in der Partnerschaft',
        description: 'Hier schaut ihr darauf, welche Werte euch als Paar tragen und woran ihr euch gemeinsam orientieren wollt.',
      },
      {
        slug: 'erziehungsziele',
        title: 'Erziehungsziele und Teamgefühl',
        description: 'Ihr schaut auf verschiedene Prägungen in der Erziehung und darauf, wie ihr trotz Unterschiedlichkeit ein gemeinsames Team werden könnt.',
        driveId: '13ndIpxyGZdtb9SenV6GT46zmOz0fONGP',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/partnerschaft/unterschiedliche-erziehungsstile/media.mp4?md5=Ohg06OCPNN9prxWey5jgWg&expires=1808401735',
      },
      {
        slug: 'finanzen',
        title: 'Finanzen im Patchwork',
        description: 'Diese Lektion hilft euch, Geldthemen bewusster und ehrlicher anzuschauen, damit daraus weniger versteckte Spannungen entstehen.',
        driveId: '13ndIpxyGZdtb9SenV6GT46zmOz0fONGP',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/partnerschaft/unterschiedliche-erziehungsstile/media.mp4?md5=Ohg06OCPNN9prxWey5jgWg&expires=1808401735',
      },
      {
        slug: 'drei-fragen-fuer-sicherheit',
        title: '3 Fragen für Sicherheit',
        description: 'Drei Fragen, die euch helfen, Sicherheit in der Partnerschaft wieder gezielter aufzubauen.',
      },
      {
        slug: 'fuenf-saetze-fuer-verstaendnis',
        title: '5 Sätze für Verständnis',
        description: 'Konkrete Formulierungen, mit denen ihr euch auch in stressigen Momenten wieder näher kommen könnt.',
      },
    ],
  },
  {
    slug: 'kommunikationsstrategien',
    number: '08',
    title: 'Kommunikationsstrategien',
    shortDescription: 'Führe Gespräche klarer und entschärfe Konflikte, bevor sie eskalieren.',
    intro: 'In diesem Modul geht es um Gesprächsführung, Zuhören und konkrete Werkzeuge für schwierige Situationen im Patchworkalltag.',
    moduleCover: '/images/beyondbonus/covers/klartext.png',
    lessons: [
      {
        slug: 'ich-botschaften',
        title: 'Ich-Botschaften',
        description: 'Hier lernst du, wie du Angriffe vermeidest und trotzdem klar sagst, was in dir vorgeht und was du brauchst.',
        driveId: '1JjO4XEoGCQRqspk9HlHylvB5kqDml8ao',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/bonuskinder/familienrituale/media.mp4?md5=KoHh42P8iYL20PJkoRB6tw&expires=1808396245',
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
        slug: 'wuensche-statt-vorwuerfe',
        title: 'Wünsche statt Vorwürfe',
        description: 'Hier lernst du, wie du deine Wünsche klar ausdrücken kannst, statt in Vorwürfen hängen zu bleiben.',
      },
      {
        slug: 'gewaltfreie-kommunikation',
        title: 'Gewaltfreie Kommunikation',
        description: 'Du bekommst mit der gewaltfreien Kommunikation ein Werkzeug, das Klarheit und Empathie miteinander verbindet.',
        driveId: '12v9lbcrPAFe324HNDEUrJGQO8kpp8mj6',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/kommunikation/gewaltfreie-kommunikation/media.mp4?md5=Wu-STg28ui3izbrN347pvA&expires=1808401735',
      },
      {
        slug: 'zwiegespraeche',
        title: 'Zwiegespräche',
        description: 'Diese Lektion zeigt euch ein klares Ritual, mit dem ihr wieder tiefer miteinander ins Gespräch kommt als nur über Termine und To-dos.',
        driveId: '1ht-HVzizNpKV7qOyJeT0c9usdNnBQhaW',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/partnerschaft/zwiegespraech/media.mp4?md5=vTa2Yx-JrjwKy8B8q0QmsA&expires=1808401735',
      },
      {
        slug: 'konflikt-kit',
        title: 'Konflikt-Kit',
        description: 'Ein Werkzeugkasten für heikle Gesprächsmomente, damit ihr schneller wieder handlungsfähig werdet.',
      },
      {
        slug: 'sos-checkliste',
        title: 'SOS-Checkliste',
        description: 'Eine kompakte Notfallstruktur für Gespräche, die gerade drohen zu kippen.',
      },
    ],
  },
  {
    slug: 'ex-partnerin',
    number: '09',
    title: 'Ex-Partnerin',
    shortDescription: 'Finde einen klareren Umgang mit der Ex und entlaste dich aus Dauerschleifen.',
    intro: 'Dieses Modul dreht sich um den Umgang mit der Ex-Partnerin, ihre Bedeutung im System und die Frage, wie du dich innerlich stabiler positionierst.',
    moduleCover: '/images/beyondbonus/covers/ex-faktor.png',
    lessons: [
      {
        slug: 'leitfaden-hochstrittige-ex',
        title: 'Leitfaden für eine hochstrittige Ex',
        description: 'Hier geht es darum, wie du in besonders belastenden Konstellationen handlungsfähig bleibst.',
      },
      {
        slug: 'bedeutung-der-ex',
        title: 'Die Bedeutung der Ex verstehen',
        description: 'Diese Lektion zeigt, wie du die Ex als Teil des Systems einordnen kannst, ohne dich selbst klein zu machen.',
        driveId: '1lyIZwBSJwIbDugmrKbdia2gl6Hd7r4XP',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/ex-anerkennen/media.mp4?md5=7tKeD2YReVTpcLZcaMQV2A&expires=1808401735',
      },
      {
        slug: 'grenzen-setzen-mit-der-ex',
        title: 'Grenzen setzen mit der Ex',
        description: 'Du lernst, wie du damit umgehen kannst, wenn die Ex sich zu stark in euren Alltag drängt und wie du klare Grenzen hältst.',
        driveId: '1KN75qQfCDIMcpcjiyCTW4m9LVz0CptdJ',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/ex-ist-zu-praesent/media.mp4?md5=90yPiv53Cc5FMsVVJMadRg&expires=1808401735',
      },
      {
        slug: 'triggersituationen',
        title: 'Triggersituationen mit der Ex',
        description: 'Diese Lektion hilft dir, besser zu verstehen, was in dir passiert, wenn Begegnungen oder Erinnerungen an die Ex starke Reaktionen auslösen.',
        driveId: '18oF-5M6RCX7TsR-IfnyRUv_uOFORVd4c',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/eifersucht-bei-erinnerungen/media.mp4?md5=JIoms8SGI8b37PTXtMyUbw&expires=1808401735',
      },
    ],
  },
  {
    slug: 'deine-zukunft',
    number: '10',
    title: 'Deine Zukunft',
    shortDescription: 'Verankere Fortschritte und richte den Blick bewusst nach vorn.',
    intro: 'Zum Abschluss bündelt dieses Modul, was du bereits verändert hast, wie du mit Rückschlägen umgehst und worauf du in Zukunft weiter aufbauen willst.',
    moduleCover: '/images/beyondbonus/covers/rise.png',
    lessons: [
      {
        slug: 'erfolgs-rituale',
        title: 'Erfolgs-Rituale',
        description: 'Diese Lektion hilft dir, Fortschritte bewusst wahrzunehmen und nicht ständig zu übersehen, was du bereits geschafft hast.',
        driveId: '138HrExAoZLw_okSxdMQ8wmVQTnsQwZLy',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/erfolge-feiern/media.mp4?md5=Vd8lWYbGytjo8tPFNGwMaA&expires=1808401735',
      },
      {
        slug: 'meilensteine',
        title: 'Meilensteine',
        description: 'Hier hältst du fest, was du schon geschafft hast und woran du deinen weiteren Weg erkennen willst.',
      },
      {
        slug: 'rueckschlaege-als-chancen',
        title: 'Rückschläge als Chancen',
        description: 'Du lernst, Rückschläge nicht als Scheitern zu lesen, sondern als normalen Teil eines echten Entwicklungswegs.',
        driveId: '1O8J0PH_QygV_eu2cLEXJP1XHroSxjH_c',
        mediaType: 'video',
        mediaUrl: 'https://sally.sfrance.co/protected-media/beyondbonus/ex-partnerin-zukunft/rueckschlaege-einordnen/media.mp4?md5=w2TdS4AaauBXhNthyx2xkA&expires=1808401735',
      },
      {
        slug: 'abschluss',
        title: 'Abschluss',
        description: 'Ein bewusster Abschluss, der dir hilft, deinen Weg wertzuschätzen und die nächsten Schritte klar mitzunehmen.',
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

export function getBeyondBonusModuleCover(moduleSlug: string) {
  return getBeyondBonusModule(moduleSlug)?.moduleCover ?? '/images/beyondbonus/covers/beyondbonus.png';
}

export function getBeyondBonusLessonCover(moduleSlug: string, lessonSlug: string) {
  const lesson = getBeyondBonusLesson(moduleSlug, lessonSlug);
  if (lesson?.slug === 'einfuehrung') {
    return '/images/beyondbonus/covers/beyondbonus.png';
  }

  return getBeyondBonusModuleCover(moduleSlug);
}

export function getBeyondBonusLessonHeaderImage() {
  return lessonHeaderImage;
}

export function getLessonKey(moduleSlug: string, lessonSlug: string) {
  return `${moduleSlug}::${lessonSlug}`;
}
