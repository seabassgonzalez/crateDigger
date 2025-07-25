import { prisma } from '../utils/prisma';
import bcrypt from 'bcrypt';

async function resetPassword() {
  try {
    const email = 'sg@sg.com';
    const newPassword = 'password123';
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log(`✅ Password reset successfully for user: ${user.username} (${user.email})`);
    console.log(`New password: ${newPassword}`);
    
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();