import { prisma } from '../utils/prisma';

async function checkUserCollection() {
  try {
    // Find user sag
    const user = await prisma.user.findUnique({
      where: { username: 'sag' },
      include: {
        collection: {
          include: {
            _count: {
              select: { items: true }
            }
          }
        }
      }
    });

    if (!user) {
      console.log('User sag not found');
      return;
    }

    console.log('User sag details:');
    console.log('- ID:', user.id);
    console.log('- Email:', user.email);
    console.log('- Collection ID:', user.collection?.id);
    console.log('- Total items in collection:', user.collection?._count.items || 0);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserCollection();