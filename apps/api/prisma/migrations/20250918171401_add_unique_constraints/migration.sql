/*
  Warnings:

  - You are about to drop the column `diffJson` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `targetId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `targetTable` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `signatureBlob` on the `form_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `signedPdfUrl` on the `form_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `renderVersion` on the `form_templates` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `horses` table. All the data in the column will be lost.
  - You are about to drop the column `durationMins` on the `lesson_block_templates` table. All the data in the column will be lost.
  - You are about to drop the column `kind` on the `media_assets` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `media_assets` table. All the data in the column will be lost.
  - You are about to drop the column `metaJson` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `noteText` on the `progress_notes` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `progress_notes` table. All the data in the column will be lost.
  - You are about to drop the column `skillsJson` on the `progress_notes` table. All the data in the column will be lost.
  - The `status` column on the `student_packages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `user_announcements` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `lesson_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderNumber]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sku]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider,eventId]` on the table `webhook_events` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `announcements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actorType` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `availability_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `form_templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `guardians` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `lesson_block_templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `lesson_block_templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `lesson_block_templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonTypeId` to the `lesson_bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `lesson_bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `lesson_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `lesson_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `media_assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `media_assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCents` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumber` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `progress_notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageName` to the `student_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePaidCents` to the `student_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `student_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `testimonials` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('active', 'expired', 'depleted', 'cancelled');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BookingStatus" ADD VALUE 'pending';
ALTER TYPE "BookingStatus" ADD VALUE 'confirmed';
ALTER TYPE "BookingStatus" ADD VALUE 'rescheduled';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'processing';
ALTER TYPE "OrderStatus" ADD VALUE 'shipped';
ALTER TYPE "OrderStatus" ADD VALUE 'delivered';
ALTER TYPE "OrderStatus" ADD VALUE 'refunded';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductType" ADD VALUE 'lesson_package';
ALTER TYPE "ProductType" ADD VALUE 'equipment';
ALTER TYPE "ProductType" ADD VALUE 'feed';

-- AlterEnum
ALTER TYPE "SlotStatus" ADD VALUE 'cancelled';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Temperament" ADD VALUE 'energetic';
ALTER TYPE "Temperament" ADD VALUE 'lazy';

-- DropForeignKey
ALTER TABLE "lesson_bookings" DROP CONSTRAINT "lesson_bookings_slotId_fkey";

-- DropForeignKey
ALTER TABLE "lesson_bookings" DROP CONSTRAINT "lesson_bookings_studentId_fkey";

-- DropForeignKey
ALTER TABLE "student_packages" DROP CONSTRAINT "student_packages_studentId_fkey";

-- DropForeignKey
ALTER TABLE "user_announcements" DROP CONSTRAINT "user_announcements_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "user_announcements" DROP CONSTRAINT "user_announcements_userId_fkey";

-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "bannerColor" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "targetRoles" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "diffJson",
DROP COLUMN "targetId",
DROP COLUMN "targetTable",
ADD COLUMN     "actorType" TEXT NOT NULL,
ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entityType" TEXT NOT NULL,
ADD COLUMN     "newValues" JSONB,
ADD COLUMN     "oldValues" JSONB,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "availability_slots" ADD COLUMN     "bookedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "address" TEXT,
ADD COLUMN     "ageMax" INTEGER,
ADD COLUMN     "ageMin" INTEGER,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "earlyBirdDeadline" TIMESTAMP(3),
ADD COLUMN     "earlyBirdPriceCents" INTEGER,
ADD COLUMN     "experienceRequired" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "registrationClosesAt" TIMESTAMP(3),
ADD COLUMN     "registrationOpensAt" TIMESTAMP(3),
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "spotsReserved" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "zipCode" TEXT;

-- AlterTable
ALTER TABLE "form_submissions" DROP COLUMN "signatureBlob",
DROP COLUMN "signedPdfUrl",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isValid" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "signatureDataUrl" TEXT,
ADD COLUMN     "submitterEmail" TEXT,
ADD COLUMN     "submitterName" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "form_templates" DROP COLUMN "renderVersion",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "expiryDays" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "requiredForGuardians" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiredForStudents" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "uiSchemaJson" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "guardian_students" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "guardians" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "horses" DROP COLUMN "dob",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "farrier" TEXT,
ADD COLUMN     "healthNotes" TEXT,
ADD COLUMN     "lastFarrierVisit" TIMESTAMP(3),
ADD COLUMN     "lastVetCheck" TIMESTAMP(3),
ADD COLUMN     "maxRiderWeight" INTEGER,
ADD COLUMN     "specialties" TEXT[],
ADD COLUMN     "trainingLevel" TEXT,
ADD COLUMN     "veterinarian" TEXT;

-- AlterTable
ALTER TABLE "lesson_block_templates" DROP COLUMN "durationMins",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "lesson_bookings" ADD COLUMN     "amountPaidCents" INTEGER,
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" TEXT,
ADD COLUMN     "checkedInAt" TIMESTAMP(3),
ADD COLUMN     "checkedInBy" TEXT,
ADD COLUMN     "horseId" TEXT,
ADD COLUMN     "lessonTypeId" TEXT NOT NULL,
ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "paymentSource" DROP NOT NULL;

-- AlterTable
ALTER TABLE "lesson_types" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxAge" INTEGER,
ADD COLUMN     "minAge" INTEGER,
ADD COLUMN     "prerequisites" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "media_assets" DROP COLUMN "kind",
DROP COLUMN "publishedAt",
ADD COLUMN     "caption" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "filename" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "sizeBytes" INTEGER,
ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "actionLabel" TEXT,
ADD COLUMN     "actionUrl" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "metaJson",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customization" JSONB,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "productSku" TEXT,
ADD COLUMN     "totalCents" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "discountCents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "orderNumber" TEXT NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "shippedAt" TIMESTAMP(3),
ADD COLUMN     "shippingAddress" TEXT,
ADD COLUMN     "shippingCity" TEXT,
ADD COLUMN     "shippingName" TEXT,
ADD COLUMN     "shippingPhone" TEXT,
ADD COLUMN     "shippingState" TEXT,
ADD COLUMN     "shippingZip" TEXT,
ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "comparePriceCents" INTEGER,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lowStockThreshold" INTEGER DEFAULT 5,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "sku" TEXT;

-- AlterTable
ALTER TABLE "progress_notes" DROP COLUMN "noteText",
DROP COLUMN "rating",
DROP COLUMN "skillsJson",
ADD COLUMN     "goalsAchieved" TEXT[],
ADD COLUMN     "homework" TEXT,
ADD COLUMN     "nextLessonFocus" TEXT,
ADD COLUMN     "overallRating" INTEGER,
ADD COLUMN     "privateNotes" TEXT,
ADD COLUMN     "publicNotes" TEXT,
ADD COLUMN     "skillsAssessed" JSONB,
ADD COLUMN     "studentId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "student_packages" ADD COLUMN     "activatedAt" TIMESTAMP(3),
ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "packageName" TEXT NOT NULL,
ADD COLUMN     "pricePaidCents" INTEGER NOT NULL,
ADD COLUMN     "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PackageStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "physicianName" TEXT,
ADD COLUMN     "physicianPhone" TEXT,
ADD COLUMN     "preferredHorseId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "authorEmail" TEXT,
ADD COLUMN     "authorPhone" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user_roles" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "lastLoginAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "webhook_events" ADD COLUMN     "error" TEXT;

-- DropTable
DROP TABLE "user_announcements";

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horse_health_records" (
    "id" TEXT NOT NULL,
    "horseId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "veterinarian" TEXT,
    "treatmentDate" TIMESTAMP(3) NOT NULL,
    "followUpDate" TIMESTAMP(3),
    "attachments" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "horse_health_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horse_media" (
    "id" TEXT NOT NULL,
    "horseId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "caption" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "horse_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notifications" (
    "userId" TEXT NOT NULL,
    "announcementId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "dismissedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("userId","announcementId")
);

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT,
    "studentId" TEXT,
    "registrantName" TEXT,
    "registrantEmail" TEXT,
    "registrantPhone" TEXT,
    "paidCents" INTEGER,
    "stripePaymentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "specialRequests" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "password_resets_token_idx" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "horse_health_records_horseId_type_idx" ON "horse_health_records"("horseId", "type");

-- CreateIndex
CREATE INDEX "horse_media_horseId_idx" ON "horse_media"("horseId");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_productId_category_key" ON "product_categories"("productId", "category");

-- CreateIndex
CREATE INDEX "event_registrations_eventId_status_idx" ON "event_registrations"("eventId", "status");

-- CreateIndex
CREATE INDEX "announcements_isPublished_expiresAt_idx" ON "announcements"("isPublished", "expiresAt");

-- CreateIndex
CREATE INDEX "audit_logs_actorUserId_idx" ON "audit_logs"("actorUserId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "availability_slots_date_status_idx" ON "availability_slots"("date", "status");

-- CreateIndex
CREATE INDEX "availability_slots_instructorId_date_idx" ON "availability_slots"("instructorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_slug_status_idx" ON "events"("slug", "status");

-- CreateIndex
CREATE INDEX "events_startAt_status_idx" ON "events"("startAt", "status");

-- CreateIndex
CREATE INDEX "form_submissions_userId_formTemplateId_idx" ON "form_submissions"("userId", "formTemplateId");

-- CreateIndex
CREATE INDEX "form_submissions_studentId_formTemplateId_idx" ON "form_submissions"("studentId", "formTemplateId");

-- CreateIndex
CREATE INDEX "form_templates_key_isActive_idx" ON "form_templates"("key", "isActive");

-- CreateIndex
CREATE INDEX "guardians_userId_idx" ON "guardians"("userId");

-- CreateIndex
CREATE INDEX "horses_isActive_idx" ON "horses"("isActive");

-- CreateIndex
CREATE INDEX "lesson_block_templates_weekday_isActive_idx" ON "lesson_block_templates"("weekday", "isActive");

-- CreateIndex
CREATE INDEX "lesson_bookings_studentId_status_idx" ON "lesson_bookings"("studentId", "status");

-- CreateIndex
CREATE INDEX "lesson_bookings_slotId_idx" ON "lesson_bookings"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_types_code_key" ON "lesson_types"("code");

-- CreateIndex
CREATE INDEX "lesson_types_code_isActive_idx" ON "lesson_types"("code", "isActive");

-- CreateIndex
CREATE INDEX "media_assets_ownerUserId_type_idx" ON "media_assets"("ownerUserId", "type");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_userId_status_idx" ON "orders"("userId", "status");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_slug_isActive_idx" ON "products"("slug", "isActive");

-- CreateIndex
CREATE INDEX "products_type_idx" ON "products"("type");

-- CreateIndex
CREATE INDEX "progress_notes_lessonBookingId_idx" ON "progress_notes"("lessonBookingId");

-- CreateIndex
CREATE INDEX "progress_notes_studentId_idx" ON "progress_notes"("studentId");

-- CreateIndex
CREATE INDEX "student_packages_studentId_status_idx" ON "student_packages"("studentId", "status");

-- CreateIndex
CREATE INDEX "students_userId_idx" ON "students"("userId");

-- CreateIndex
CREATE INDEX "testimonials_isPublished_isFeatured_idx" ON "testimonials"("isPublished", "isFeatured");

-- CreateIndex
CREATE INDEX "user_activities_userId_activityType_idx" ON "user_activities"("userId", "activityType");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "webhook_events_status_createdAt_idx" ON "webhook_events"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_provider_eventId_key" ON "webhook_events"("provider", "eventId");

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_preferredHorseId_fkey" FOREIGN KEY ("preferredHorseId") REFERENCES "horses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horse_health_records" ADD CONSTRAINT "horse_health_records_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "horses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horse_media" ADD CONSTRAINT "horse_media_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "horses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_bookings" ADD CONSTRAINT "lesson_bookings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "availability_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_bookings" ADD CONSTRAINT "lesson_bookings_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_bookings" ADD CONSTRAINT "lesson_bookings_lessonTypeId_fkey" FOREIGN KEY ("lessonTypeId") REFERENCES "lesson_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_bookings" ADD CONSTRAINT "lesson_bookings_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "horses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_bookings" ADD CONSTRAINT "lesson_bookings_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "student_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_notes" ADD CONSTRAINT "progress_notes_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_packages" ADD CONSTRAINT "student_packages_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
