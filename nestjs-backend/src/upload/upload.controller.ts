import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('api/upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: join(process.cwd(), 'public', 'uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `product-${uniqueSuffix}${extname(file.originalname) || '.jpg'}`);
        },
      }),
    })
  )
  uploadFiles(@UploadedFiles() files: any[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No image files uploaded');
    }
    const fileUrls = files.map((file) => `/uploads/${file.filename}`);
    return {
      message: 'Images uploaded successfully to NestJS local uploads directory',
      urls: fileUrls,
    };
  }
}
