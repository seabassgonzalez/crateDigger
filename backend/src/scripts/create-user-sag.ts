import { prisma } from '../utils/prisma';
import bcrypt from 'bcrypt';

async function createUserSAG() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: 'sag' }
    });

    if (existingUser) {
      console.log('User "sag" already exists');
      return;
    }

    // Create user with hashed password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = await prisma.user.create({
      data: {
        username: 'sag',
        email: 'sag@example.com',
        password: hashedPassword,
        firstName: 'SAG',
        lastName: 'User',
        collection: {
          create: {}
        }
      },
      include: { collection: true }
    });

    console.log('User "sag" created successfully:', {
      id: user.id,
      username: user.username,
      email: user.email,
      collectionId: user.collection?.id
    });
    
    console.log('\nLogin credentials:');
    console.log('Username: sag');
    console.log('Password: password123');

  } catch (error) {
    console.error('Failed to create user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUserSAG();