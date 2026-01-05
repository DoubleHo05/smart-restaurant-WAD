import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { supabase, SUPABASE_BUCKET } from '../config/supabase.config';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class MenuPhotosService {
  constructor(private prisma: PrismaService) {}

  async uploadPhotos(itemId: string, files: Express.Multer.File[]) {
    // Verify item exists
    const item = await this.prisma.menuItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    // Check if item already has photos
    const existingPhotos = await this.prisma.menuItemPhoto.findMany({
      where: { menu_item_id: itemId },
    });

    const isFirstPhoto = existingPhotos.length === 0;

    // Upload files to Supabase Storage and create photo records
    const photos = await Promise.all(
      files.map(async (file, index) => {
        // Generate unique filename
        const randomName = uuidv4();
        const ext = extname(file.originalname);
        const fileName = `${randomName}${ext}`;
        const filePath = `menu-items/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(SUPABASE_BUCKET)
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) {
          console.error('Supabase upload error:', error);
          throw new BadRequestException(`Failed to upload file: ${error.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(SUPABASE_BUCKET)
          .getPublicUrl(filePath);

        // Create photo record in database
        return this.prisma.menuItemPhoto.create({
          data: {
            menu_item_id: itemId,
            url: urlData.publicUrl,
            is_primary: isFirstPhoto && index === 0,
          },
        });
      }),
    );

    return photos;
  }

  async deletePhoto(itemId: string, photoId: string) {
    // Verify photo exists and belongs to item
    const photo = await this.prisma.menuItemPhoto.findFirst({
      where: {
        id: photoId,
        menu_item_id: itemId,
      },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    // Check if it's the primary photo
    if (photo.is_primary) {
      // Get another photo to set as primary
      const otherPhoto = await this.prisma.menuItemPhoto.findFirst({
        where: {
          menu_item_id: itemId,
          id: { not: photoId },
        },
      });

      // Set another photo as primary if exists
      if (otherPhoto) {
        await this.prisma.menuItemPhoto.update({
          where: { id: otherPhoto.id },
          data: { is_primary: true },
        });
      }
    }

    // Delete file from Supabase Storage
    try {
      // Extract file path from URL
      const url = new URL(photo.url);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(-2).join('/'); // Get 'menu-items/filename.jpg'
      
      const { error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .remove([filePath]);

      if (error) {
        console.error('Failed to delete file from Supabase:', error);
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      // Continue with DB deletion even if file deletion fails
    }

    // Delete from database
    await this.prisma.menuItemPhoto.delete({
      where: { id: photoId },
    });
  }

  async setPrimaryPhoto(itemId: string, photoId: string) {
    // Verify photo exists and belongs to item
    const photo = await this.prisma.menuItemPhoto.findFirst({
      where: {
        id: photoId,
        menu_item_id: itemId,
      },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    // Remove primary flag from all photos of this item
    await this.prisma.menuItemPhoto.updateMany({
      where: { menu_item_id: itemId },
      data: { is_primary: false },
    });

    // Set this photo as primary
    const updatedPhoto = await this.prisma.menuItemPhoto.update({
      where: { id: photoId },
      data: { is_primary: true },
    });

    return updatedPhoto;
  }
}
