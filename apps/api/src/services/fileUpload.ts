import { Request } from 'express';
import path from 'path';
import fs from 'fs';

export class FileUploadService {
  static uploadDir = path.join(process.cwd(), 'uploads');
  static maxFileSize = 5 * 1024 * 1024; // 5MB
  static allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  static async uploadProfilePicture(file: Express.Multer.File, userId: string): Promise<string> {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    // Validate file
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    if (file.size > this.maxFileSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    // Generate unique filename
    const extension = path.extname(file.originalname);
    const filename = `profile_${userId}_${Date.now()}${extension}`;
    const filepath = path.join(this.uploadDir, filename);

    // Save file
    fs.writeFileSync(filepath, file.buffer);

    // Return relative path for database storage
    return `/uploads/${filename}`;
  }

  static deleteFile(filepath: string): void {
    const fullPath = path.join(process.cwd(), filepath.replace(/^\//, ''));
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}
