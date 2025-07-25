import { prisma } from '../utils/prisma';

async function verifyCollection(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        collection: {
          include: {
            items: {
              include: {
                release: {
                  include: {
                    artists: {
                      include: {
                        artist: true
                      }
                    },
                    label: true,
                    format: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      console.log(`User ${username} not found`);
      return;
    }

    if (!user.collection) {
      console.log(`User ${username} has no collection`);
      return;
    }

    console.log(`\nCollection for user: ${username}`);
    console.log(`Total items: ${user.collection.items.length}`);
    console.log('\nSample items:');
    
    user.collection.items.slice(0, 5).forEach((item, index) => {
      const artists = item.release.artists
        .map(ra => ra.artist.name)
        .join(', ');
      
      console.log(`\n${index + 1}. ${artists} - ${item.release.title}`);
      console.log(`   Label: ${item.release.label?.name}`);
      console.log(`   Format: ${item.release.format.name}`);
      console.log(`   Condition: ${item.condition}`);
      if (item.rating) {
        console.log(`   Rating: ${item.rating}/5`);
      }
    });

    // Show condition distribution
    const conditionCounts = user.collection.items.reduce((acc, item) => {
      acc[item.condition] = (acc[item.condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n\nCondition distribution:');
    Object.entries(conditionCounts).forEach(([condition, count]) => {
      console.log(`${condition}: ${count}`);
    });

    // Show rating distribution
    const ratingCounts = user.collection.items.reduce((acc, item) => {
      if (item.rating) {
        acc[item.rating] = (acc[item.rating] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    console.log('\nRating distribution:');
    Object.entries(ratingCounts).forEach(([rating, count]) => {
      console.log(`${rating} stars: ${count}`);
    });

  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const username = process.argv[2] || 'sag';
verifyCollection(username);