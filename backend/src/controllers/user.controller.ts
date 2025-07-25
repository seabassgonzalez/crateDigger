import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export class UserController {
  static async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Get user stats including collection count
      const user = await prisma.user.findUnique({
        where: { id: userId },
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

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const stats = {
        collectionCount: user.collection?._count.items || 0,
        wantlistCount: user.wantlist?._count.items || 0,
        // Add more stats as needed
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ error: 'Failed to fetch user stats' });
    }
  }
}