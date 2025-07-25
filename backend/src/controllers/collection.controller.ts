import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export class CollectionController {
  static async getCollection(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Get user's collection with all related data
      const collection = await prisma.collection.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              release: {
                include: {
                  artists: {
                    include: {
                      artist: true
                    },
                    orderBy: {
                      position: 'asc'
                    }
                  },
                  label: true,
                  format: true,
                  genres: {
                    include: {
                      genre: true
                    }
                  },
                  styles: {
                    include: {
                      style: true
                    }
                  }
                }
              }
            },
            orderBy: {
              addedAt: 'desc'
            }
          }
        }
      });

      if (!collection) {
        // Create collection if it doesn't exist
        const newCollection = await prisma.collection.create({
          data: { userId },
          include: { items: true }
        });
        res.json(newCollection);
        return;
      }

      res.json(collection);
    } catch (error) {
      console.error('Error fetching collection:', error);
      res.status(500).json({ error: 'Failed to fetch collection' });
    }
  }

  static async addItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { releaseId, condition, rating, notes } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Get user's collection
      let collection = await prisma.collection.findUnique({
        where: { userId }
      });

      if (!collection) {
        collection = await prisma.collection.create({
          data: { userId }
        });
      }

      // Add item to collection
      const item = await prisma.collectionItem.create({
        data: {
          collectionId: collection.id,
          releaseId,
          condition,
          rating,
          notes
        },
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
      });

      res.status(201).json(item);
    } catch (error) {
      console.error('Error adding item to collection:', error);
      res.status(500).json({ error: 'Failed to add item to collection' });
    }
  }

  static async removeItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { itemId } = req.params;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Verify the item belongs to the user's collection
      const item = await prisma.collectionItem.findUnique({
        where: { id: itemId },
        include: {
          collection: true
        }
      });

      if (!item || item.collection.userId !== userId) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }

      // Delete the item
      await prisma.collectionItem.delete({
        where: { id: itemId }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error removing item from collection:', error);
      res.status(500).json({ error: 'Failed to remove item from collection' });
    }
  }

  static async updateItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { itemId } = req.params;
      const { condition, rating, notes } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Verify the item belongs to the user's collection
      const item = await prisma.collectionItem.findUnique({
        where: { id: itemId },
        include: {
          collection: true
        }
      });

      if (!item || item.collection.userId !== userId) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }

      // Update the item
      const updatedItem = await prisma.collectionItem.update({
        where: { id: itemId },
        data: {
          condition,
          rating,
          notes
        },
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
      });

      res.json(updatedItem);
    } catch (error) {
      console.error('Error updating collection item:', error);
      res.status(500).json({ error: 'Failed to update collection item' });
    }
  }
}