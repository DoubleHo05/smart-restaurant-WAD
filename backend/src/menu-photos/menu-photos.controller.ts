import {
  Controller,
  Post,
  Delete,
  Patch,
  Param,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MenuPhotosService } from './menu-photos.service';

// Multer configuration for memory storage (files will be uploaded to Supabase)
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        'Invalid file type. Only JPG, PNG, and WebP are allowed.',
      ),
      false,
    );
  }
};

@Controller('api/admin/menu/items/:itemId/photos')
export class MenuPhotosController {
  constructor(private readonly menuPhotosService: MenuPhotosService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadPhotos(
    @Param('itemId') itemId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const photos = await this.menuPhotosService.uploadPhotos(itemId, files);
    return {
      message: 'Photos uploaded successfully',
      photos,
    };
  }

  @Delete(':photoId')
  async deletePhoto(
    @Param('itemId') itemId: string,
    @Param('photoId') photoId: string,
  ) {
    await this.menuPhotosService.deletePhoto(itemId, photoId);
    return {
      message: 'Photo deleted successfully',
    };
  }

  @Patch(':photoId/primary')
  async setPrimaryPhoto(
    @Param('itemId') itemId: string,
    @Param('photoId') photoId: string,
  ) {
    const photo = await this.menuPhotosService.setPrimaryPhoto(itemId, photoId);
    return {
      message: 'Primary photo set successfully',
      photo,
    };
  }
}
