import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { prisma } from '../utils/prisma';
import { ItemCondition } from '@prisma/client';

interface CSVRecord {
  'Catalog#': string;
  Artist: string;
  Title: string;
  Label: string;
  Format: string;
  Rating: string;
  Released: string;
  release_id: string;
  CollectionFolder: string;
  'Date Added': string;
  'Collection Media Condition': string;
  'Collection Sleeve Condition': string;
  'Collection Notes': string;
}

// Map Discogs condition format to our enum
function mapCondition(condition: string): ItemCondition {
  const conditionMap: Record<string, ItemCondition> = {
    'Mint (M)': ItemCondition.MINT,
    'Near Mint (NM or M-)': ItemCondition.NEAR_MINT,
    'Very Good Plus (VG+)': ItemCondition.VERY_GOOD_PLUS,
    'Very Good (VG)': ItemCondition.VERY_GOOD,
    'Good Plus (G+)': ItemCondition.GOOD_PLUS,
    'Good (G)': ItemCondition.GOOD,
    'Fair (F)': ItemCondition.FAIR,
    'Poor (P)': ItemCondition.POOR,
  };
  
  return conditionMap[condition] || ItemCondition.GOOD;
}

async function importCollection(username: string, csvFilePath: string) {
  console.log(`Starting import for user: ${username}`);
  
  try {
    // First, find or create the user
    let user = await prisma.user.findUnique({
      where: { username },
      include: { collection: true }
    });

    if (!user) {
      console.log(`Creating user: ${username}`);
      user = await prisma.user.create({
        data: {
          username,
          email: `${username.toLowerCase()}@example.com`,
          password: 'placeholder', // You'll need to set a real password
          firstName: username,
          collection: {
            create: {}
          }
        },
        include: { collection: true }
      });
    } else if (!user.collection) {
      // Create collection if user exists but has no collection
      await prisma.collection.create({
        data: {
          userId: user.id
        }
      });
      user = await prisma.user.findUnique({
        where: { id: user.id },
        include: { collection: true }
      });
    }

    if (!user?.collection) {
      throw new Error('Failed to create collection for user');
    }

    // Read and parse CSV file
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    const records = await new Promise<CSVRecord[]>((resolve, reject) => {
      parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }, (err, records: CSVRecord[]) => {
        if (err) reject(err);
        else resolve(records);
      });
    });

    console.log(`Found ${records.length} records to import`);

    // Process each record
    let imported = 0;
    let skipped = 0;
    
    for (const record of records) {
      try {
        // Parse artist names (handle multiple artists)
        const artistNames = record.Artist.split(/[,&]/).map(a => a.trim());
        
        // Create or find artists
        const artists = await Promise.all(
          artistNames.map(async (name) => {
            let artist = await prisma.artist.findFirst({
              where: { name }
            });
            
            if (!artist) {
              artist = await prisma.artist.create({
                data: { name }
              });
            }
            
            return artist;
          })
        );

        // Create or find label
        const labelNames = record.Label.split(',').map(l => l.trim());
        const labelName = labelNames[0] || 'Unknown Label';
        
        let label = await prisma.label.findFirst({
          where: { name: labelName }
        });
        
        if (!label) {
          label = await prisma.label.create({
            data: { name: labelName }
          });
        }

        // Create or find format
        const formatName = record.Format.split(',')[0].trim() || 'Unknown';
        const format = await prisma.format.upsert({
          where: { name: formatName },
          update: {},
          create: { 
            name: formatName,
            description: record.Format
          }
        });

        // Try to find existing release first
        let release = await prisma.release.findFirst({
          where: {
            title: record.Title,
            catalogNumber: record['Catalog#'] || undefined,
          }
        });

        if (!release) {
          // Create release if it doesn't exist
          release = await prisma.release.create({
            data: {
              title: record.Title,
              catalogNumber: record['Catalog#'] || undefined,
              labelId: label.id,
              formatId: format.id,
              releaseDate: record.Released || undefined,
              artists: {
                create: artists.map((artist, index) => ({
                  artistId: artist.id,
                  position: index
                }))
              }
            }
          });
        }

        // Add to collection (check if not already in collection)
        const existingItem = await prisma.collectionItem.findUnique({
          where: {
            collectionId_releaseId: {
              collectionId: user.collection.id,
              releaseId: release.id
            }
          }
        });

        if (!existingItem) {
          const rating = record.Rating ? parseInt(record.Rating) : undefined;
          const condition = mapCondition(record['Collection Media Condition']);
          
          await prisma.collectionItem.create({
            data: {
              collectionId: user.collection.id,
              releaseId: release.id,
              condition,
              notes: record['Collection Notes'] || undefined,
              rating: rating && rating >= 1 && rating <= 5 ? rating : undefined,
              addedAt: new Date(record['Date Added'])
            }
          });
        } else {
          console.log(`Already in collection: ${record.Artist} - ${record.Title}`);
          skipped++;
          continue;
        }

        imported++;
        console.log(`Imported: ${record.Artist} - ${record.Title}`);
      } catch (error) {
        console.error(`Failed to import "${record.Title}":`, error);
        skipped++;
      }
    }

    console.log(`\nImport complete!`);
    console.log(`Successfully imported: ${imported} records`);
    console.log(`Skipped: ${skipped} records`);

  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const username = process.argv[2];
const csvPath = process.argv[3];

if (!username || !csvPath) {
  console.error('Usage: npm run import-collection <username> <csv-file-path>');
  process.exit(1);
}

// Run the import
importCollection(username, csvPath)
  .then(() => {
    console.log('Import process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import process failed:', error);
    process.exit(1);
  });