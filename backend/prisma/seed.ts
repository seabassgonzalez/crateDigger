import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Formats
  const formats = [
    { name: 'Vinyl', description: '12", 10", 7" vinyl records' },
    { name: 'CD', description: 'Compact Disc' },
    { name: 'Cassette', description: 'Cassette tape' },
    { name: 'Digital', description: 'Digital files (MP3, FLAC, etc.)' },
    { name: 'DVD', description: 'Digital Versatile Disc' },
    { name: 'Blu-ray', description: 'Blu-ray Disc' },
    { name: '8-Track', description: '8-Track cartridge' },
    { name: 'MiniDisc', description: 'MiniDisc' },
  ];

  console.log('📀 Seeding formats...');
  for (const format of formats) {
    await prisma.format.upsert({
      where: { name: format.name },
      update: {},
      create: format,
    });
  }

  // Seed Countries (top music markets)
  const countries = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Japan', code: 'JP' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Italy', code: 'IT' },
    { name: 'Spain', code: 'ES' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Austria', code: 'AT' },
    { name: 'Denmark', code: 'DK' },
    { name: 'Norway', code: 'NO' },
    { name: 'Finland', code: 'FI' },
    { name: 'Poland', code: 'PL' },
    { name: 'Russia', code: 'RU' },
  ];

  console.log('🌍 Seeding countries...');
  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {},
      create: country,
    });
  }

  // Seed Genres
  const genres = [
    'Electronic',
    'Rock',
    'Hip Hop',
    'Jazz',
    'Classical',
    'Reggae',
    'Blues',
    'Country',
    'Folk',
    'Latin',
    'R&B',
    'Soul',
    'Funk',
    'Pop',
    'Metal',
    'Punk',
    'World',
    'Experimental',
    'Ambient',
    'Gospel',
  ];

  console.log('🎵 Seeding genres...');
  for (const genreName of genres) {
    await prisma.genre.upsert({
      where: { name: genreName },
      update: {},
      create: { name: genreName },
    });
  }

  // Seed Styles (sub-genres)
  const styles = [
    // Electronic styles
    'House', 'Techno', 'Trance', 'Drum & Bass', 'Dubstep', 'Ambient', 'IDM', 'Breakbeat',
    'Downtempo', 'Garage', 'Jungle', 'Hardstyle', 'Tech House', 'Deep House', 'Progressive House',
    
    // Rock styles
    'Alternative Rock', 'Indie Rock', 'Progressive Rock', 'Psychedelic Rock', 'Hard Rock',
    'Classic Rock', 'Punk Rock', 'Post-Rock', 'Garage Rock', 'Grunge', 'Shoegaze',
    
    // Hip Hop styles
    'East Coast Hip Hop', 'West Coast Hip Hop', 'Trap', 'Boom Bap', 'Conscious Hip Hop',
    'Gangsta Rap', 'Old School Hip Hop', 'Underground Hip Hop',
    
    // Jazz styles
    'Bebop', 'Swing', 'Cool Jazz', 'Free Jazz', 'Fusion', 'Latin Jazz', 'Smooth Jazz',
    'Modern Jazz', 'Hard Bop', 'Modal Jazz',
    
    // Metal styles
    'Heavy Metal', 'Thrash Metal', 'Death Metal', 'Black Metal', 'Doom Metal',
    'Power Metal', 'Progressive Metal', 'Nu Metal', 'Metalcore',
    
    // Other styles
    'Neo-Soul', 'Contemporary R&B', 'Disco', 'Synth-pop', 'New Wave', 'Post-Punk',
    'Industrial', 'Noise', 'Drone', 'Field Recording', 'Musique Concrète',
  ];

  console.log('🎼 Seeding styles...');
  for (const styleName of styles) {
    await prisma.style.upsert({
      where: { name: styleName },
      update: {},
      create: { name: styleName },
    });
  }

  // Create sample artists
  console.log('🎤 Creating sample artists...');
  const artists = await Promise.all([
    prisma.artist.create({
      data: {
        name: 'Aphex Twin',
        realName: 'Richard David James',
        profile: 'British electronic musician known for his influential and idiosyncratic work in electronic music.',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Miles Davis',
        realName: 'Miles Dewey Davis III',
        profile: 'American jazz trumpeter, bandleader, and composer, one of the most influential figures in jazz.',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'The Beatles',
        profile: 'English rock band formed in Liverpool in 1960, one of the most commercially successful and critically acclaimed bands in popular music history.',
      },
    }),
  ]);

  // Create sample labels
  console.log('🏢 Creating sample labels...');
  const labels = await Promise.all([
    prisma.label.create({
      data: {
        name: 'Warp Records',
        profile: 'British independent record label founded in Sheffield in 1989, known for pioneering electronic music.',
        contactInfo: 'info@warp.net',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Blue Note Records',
        profile: 'American jazz record label founded in 1939, known for its distinctive cover art and recording quality.',
      },
    }),
    prisma.label.create({
      data: {
        name: 'Parlophone',
        profile: 'British record label founded in 1896, known for releasing The Beatles early recordings.',
      },
    }),
  ]);

  // Get format IDs
  const vinylFormat = await prisma.format.findUnique({ where: { name: 'Vinyl' } });
  const cdFormat = await prisma.format.findUnique({ where: { name: 'CD' } });
  
  // Get country IDs
  const usCountry = await prisma.country.findUnique({ where: { code: 'US' } });
  const ukCountry = await prisma.country.findUnique({ where: { code: 'GB' } });

  // Get genre IDs
  const electronicGenre = await prisma.genre.findUnique({ where: { name: 'Electronic' } });
  const jazzGenre = await prisma.genre.findUnique({ where: { name: 'Jazz' } });
  const rockGenre = await prisma.genre.findUnique({ where: { name: 'Rock' } });

  // Get style IDs
  const idmStyle = await prisma.style.findUnique({ where: { name: 'IDM' } });
  const ambientStyle = await prisma.style.findUnique({ where: { name: 'Ambient' } });
  const bebopStyle = await prisma.style.findUnique({ where: { name: 'Bebop' } });
  const psychRockStyle = await prisma.style.findUnique({ where: { name: 'Psychedelic Rock' } });

  // Create sample releases
  console.log('💿 Creating sample releases...');
  
  // Aphex Twin - Selected Ambient Works 85-92
  const sawRelease = await prisma.release.create({
    data: {
      title: 'Selected Ambient Works 85-92',
      labelId: labels[0].id, // Warp Records
      catalogNumber: 'WARP LP 39',
      formatId: vinylFormat!.id,
      countryId: ukCountry!.id,
      releaseDate: '1992',
      notes: 'Groundbreaking ambient electronic album.',
      artists: {
        create: [{
          artistId: artists[0].id,
          position: 1,
        }],
      },
      genres: {
        create: [{
          genreId: electronicGenre!.id,
        }],
      },
      styles: {
        create: [
          { styleId: idmStyle!.id },
          { styleId: ambientStyle!.id },
        ],
      },
      tracks: {
        create: [
          { position: 'A1', title: 'Xtal', duration: '4:51' },
          { position: 'A2', title: 'Tha', duration: '9:01' },
          { position: 'A3', title: 'Pulsewidth', duration: '3:47' },
          { position: 'B1', title: 'Ageispolis', duration: '5:21' },
          { position: 'B2', title: 'I', duration: '1:13' },
          { position: 'B3', title: 'Green Calx', duration: '6:02' },
          { position: 'B4', title: 'Heliosphan', duration: '4:51' },
          { position: 'C1', title: 'We Are The Music Makers', duration: '7:42' },
          { position: 'C2', title: 'Schottkey 7th Path', duration: '5:07' },
          { position: 'C3', title: 'Ptolemy', duration: '7:12' },
          { position: 'D1', title: 'Hedphelym', duration: '6:02' },
          { position: 'D2', title: 'Delphium', duration: '5:36' },
          { position: 'D3', title: 'Actium', duration: '7:35' },
        ],
      },
    },
  });

  // Miles Davis - Kind of Blue
  const kobRelease = await prisma.release.create({
    data: {
      title: 'Kind Of Blue',
      labelId: labels[1].id, // Blue Note Records
      catalogNumber: 'CL 1355',
      formatId: vinylFormat!.id,
      countryId: usCountry!.id,
      releaseDate: '1959',
      notes: 'Best-selling jazz album of all time.',
      artists: {
        create: [{
          artistId: artists[1].id,
          position: 1,
        }],
      },
      genres: {
        create: [{
          genreId: jazzGenre!.id,
        }],
      },
      styles: {
        create: [{
          styleId: bebopStyle!.id,
        }],
      },
      tracks: {
        create: [
          { position: 'A1', title: 'So What', duration: '9:22' },
          { position: 'A2', title: 'Freddie Freeloader', duration: '9:46' },
          { position: 'A3', title: 'Blue In Green', duration: '5:37' },
          { position: 'B1', title: 'All Blues', duration: '11:33' },
          { position: 'B2', title: 'Flamenco Sketches', duration: '9:26' },
        ],
      },
    },
  });

  // The Beatles - Abbey Road
  const abbeyRoadRelease = await prisma.release.create({
    data: {
      title: 'Abbey Road',
      labelId: labels[2].id, // Parlophone
      catalogNumber: 'PCS 7088',
      formatId: vinylFormat!.id,
      countryId: ukCountry!.id,
      releaseDate: '1969',
      notes: 'The eleventh studio album by the English rock band the Beatles.',
      artists: {
        create: [{
          artistId: artists[2].id,
          position: 1,
        }],
      },
      genres: {
        create: [{
          genreId: rockGenre!.id,
        }],
      },
      styles: {
        create: [{
          styleId: psychRockStyle!.id,
        }],
      },
      tracks: {
        create: [
          { position: 'A1', title: 'Come Together', duration: '4:19' },
          { position: 'A2', title: 'Something', duration: '3:03' },
          { position: 'A3', title: "Maxwell's Silver Hammer", duration: '3:27' },
          { position: 'A4', title: 'Oh! Darling', duration: '3:26' },
          { position: 'A5', title: "Octopus's Garden", duration: '2:51' },
          { position: 'A6', title: "I Want You (She's So Heavy)", duration: '7:47' },
          { position: 'B1', title: 'Here Comes The Sun', duration: '3:05' },
          { position: 'B2', title: 'Because', duration: '2:45' },
          { position: 'B3', title: 'You Never Give Me Your Money', duration: '4:02' },
          { position: 'B4', title: 'Sun King', duration: '2:26' },
          { position: 'B5', title: 'Mean Mr. Mustard', duration: '1:06' },
          { position: 'B6', title: 'Polythene Pam', duration: '1:12' },
          { position: 'B7', title: 'She Came In Through The Bathroom Window', duration: '1:57' },
          { position: 'B8', title: 'Golden Slumbers', duration: '1:31' },
          { position: 'B9', title: 'Carry That Weight', duration: '1:36' },
          { position: 'B10', title: 'The End', duration: '2:19' },
          { position: 'B11', title: 'Her Majesty', duration: '0:23' },
        ],
      },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`
  Summary:
  - ${formats.length} formats created
  - ${countries.length} countries created
  - ${genres.length} genres created
  - ${styles.length} styles created
  - ${artists.length} artists created
  - ${labels.length} labels created
  - 3 sample releases created with tracks
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });