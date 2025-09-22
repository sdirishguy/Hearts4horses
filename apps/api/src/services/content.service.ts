import { prisma } from '../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class ContentService {
  // Upload media to Cloudinary
  async uploadMedia(file: Express.Multer.File, folder: string = 'general') {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: `hearts4horses/${folder}`,
            resource_type: 'auto',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      // Store in database
      const media = await prisma.mediaAsset.create({
        data: {
          type: file.mimetype.startsWith('video') ? 'video' : 'image',
          url: result.secure_url,
          thumbnailUrl: result.eager?.[0]?.secure_url || result.secure_url,
          filename: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          source: 'upload',
          tags: [folder]
        } as any
      });

      return media;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload media');
    }
  }

  // Horse CRUD operations
  async createHorse(data: any) {
    return prisma.horse.create({
      data: {
        ...data,
        specialties: data.specialties || [],
      }
    });
  }

  async updateHorse(id: string, data: any) {
    return prisma.horse.update({
      where: { id },
      data
    });
  }

  async deleteHorse(id: string) {
    return prisma.horse.update({
      where: { id },
      data: { isActive: false }
    });
  }

  // Testimonials management
  async createTestimonial(data: any) {
    return prisma.testimonial.create({
      data: {
        ...data,
        isPublished: false // Require approval
      }
    });
  }

  async approveTestimonial(id: string, userId: string) {
    return prisma.testimonial.update({
      where: { id },
      data: {
        isPublished: true,
        approvedByUserId: userId,
        approvedAt: new Date()
      } as any
    });
  }

  // Events management
  async createEvent(data: any) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-');
    return prisma.event.create({
      data: {
        ...data,
        slug,
        status: 'draft'
      }
    });
  }

  async publishEvent(id: string) {
    return prisma.event.update({
      where: { id },
      data: { status: 'published' } as any
    });
  }

  // Announcements
  async createAnnouncement(data: any) {
    return prisma.announcement.create({
      data: {
        ...data,
        targetRoles: data.targetRoles || ['all']
      }
    });
  }
}

export const contentService = new ContentService();