import { prisma } from '../utils/prisma';
import jwt from 'jsonwebtoken';

async function testUserAPI() {
  try {
    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: 'sg@sg.com' }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('Testing API for user:', user.username, '(', user.email, ')');

    // Create a JWT token for testing
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '1h' }
    );

    console.log('\nGenerated test token:', token);

    // Test the stats endpoint directly
    const stats = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        collection: {
          include: {
            _count: {
              select: { items: true }
            }
          }
        },
        wantlist: {
          include: {
            _count: {
              select: { items: true }
            }
          }
        }
      }
    });

    console.log('\nUser stats:');
    console.log('- Collection count:', stats?.collection?._count.items || 0);
    console.log('- Wantlist count:', stats?.wantlist?._count.items || 0);

    // Test collection endpoint
    const collection = await prisma.collection.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          take: 3,
          include: {
            release: {
              include: {
                artists: {
                  include: {
                    artist: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: { items: true }
        }
      }
    });

    console.log('\nCollection details:');
    console.log('- Total items:', collection?._count.items || 0);
    console.log('- Sample items:');
    collection?.items.forEach((item, i) => {
      const artists = item.release.artists.map(a => a.artist.name).join(', ');
      console.log(`  ${i + 1}. ${artists} - ${item.release.title}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserAPI();