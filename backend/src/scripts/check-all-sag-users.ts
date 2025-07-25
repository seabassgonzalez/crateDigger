import { prisma } from '../utils/prisma';

async function checkAllSagUsers() {
  try {
    // Find all users with username 'sag'
    const users = await prisma.user.findMany({
      where: { 
        OR: [
          { username: 'sag' },
          { email: 'sg@sg.com' }
        ]
      },
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

    console.log(`Found ${users.length} users:`);
    console.log('-------------------');
    
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log('- ID:', user.id);
      console.log('- Username:', user.username);
      console.log('- Email:', user.email);
      console.log('- Collection ID:', user.collection?.id || 'NO COLLECTION');
      console.log('- Collection items:', user.collection?._count.items || 0);
    });

    // Check which collection has items
    const collectionsWithItems = await prisma.collection.findMany({
      where: {
        items: {
          some: {}
        }
      },
      include: {
        user: true,
        _count: {
          select: { items: true }
        }
      }
    });

    console.log('\n\nCollections with items:');
    console.log('----------------------');
    collectionsWithItems.forEach(col => {
      console.log(`\nCollection ID: ${col.id}`);
      console.log('- User ID:', col.userId);
      console.log('- Username:', col.user.username);
      console.log('- Email:', col.user.email);
      console.log('- Items:', col._count.items);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllSagUsers();