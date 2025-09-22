import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { createError } from '../middleware/errorHandler';
import { ActivityLogger } from '../services/activityLogger';

const router = express.Router();

// Schemas for registration and login. Keeping these in one place makes the
// expected payload explicit. Additional fields for students/guardians are
// optional to support flexible onboarding.
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  userType: z.enum(['student', 'guardian', 'instructor']),
  // Student‑specific fields
  dateOfBirth: z.string().optional(),
  experienceLevel: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  // Guardian‑specific fields
  guardianFirstName: z.string().optional(),
  guardianLastName: z.string().optional(),
  guardianEmail: z.string().email().optional(),
  guardianPhone: z.string().optional(),
  guardianRelationship: z.string().optional(),
  guardianAddress: z.string().optional(),
  guardianCity: z.string().optional(),
  guardianState: z.string().optional(),
  guardianZipCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// -----------------------------------------------------------------------------
// POST /register - Register a new user. Performs validation, prevents
// duplicate accounts by email and assigns roles. Student registrations may
// optionally include guardian information.
router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const validated = registerSchema.parse(req.body);
    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email: validated.email } });
    if (existing) throw createError('User with this email already exists', 400);
    // Hash password
    const hashed = await bcrypt.hash(validated.password, 12);
    // Create user record
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        password: hashed,
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone,
      },
    });
    // If student, create student profile
    if (validated.userType === 'student') {
      await prisma.student.create({
        data: {
          userId: user.id,
          dateOfBirth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : null,
          experienceLevel: validated.experienceLevel,
          emergencyContactName: validated.emergencyContactName,
          emergencyContactPhone: validated.emergencyContactPhone,
          emergencyContactRelationship: validated.emergencyContactRelationship,
          medicalConditions: validated.medicalConditions,
          allergies: validated.allergies,
          medications: validated.medications,
          insuranceProvider: validated.insuranceProvider,
          insurancePolicyNumber: validated.insurancePolicyNumber,
        },
      });
      // Optionally create guardian account if names provided
      if (validated.guardianFirstName && validated.guardianLastName) {
        try {
          const guardianEmail = validated.guardianEmail || `${validated.guardianFirstName.toLowerCase()}.${validated.guardianLastName.toLowerCase()}@guardian.hearts4horses.com`;
          const guardianUser = await prisma.user.create({
            data: {
              email: guardianEmail,
              firstName: validated.guardianFirstName,
              lastName: validated.guardianLastName,
              phone: validated.guardianPhone,
            },
          });
          const guardianRole = await prisma.role.findUnique({ where: { key: 'guardian' } });
          if (guardianRole) {
            await prisma.userRole.create({ data: { userId: guardianUser.id, roleId: guardianRole.id } });
          }
          const guardian = await prisma.guardian.create({
            data: {
              userId: guardianUser.id,
              emergencyContactName: validated.emergencyContactName,
              emergencyContactPhone: validated.emergencyContactPhone,
              address: validated.guardianAddress,
              city: validated.guardianCity,
              state: validated.guardianState,
              zipCode: validated.guardianZipCode,
            },
          });
          const student = await prisma.student.findUnique({ where: { userId: user.id } });
          if (student) {
            await prisma.guardianStudent.create({
              data: {
                guardianId: guardian.id,
                studentId: student.id,
                relationship: validated.guardianRelationship,
              },
            });
          }
        } catch (guardianError) {
          // Log and continue. Guardian creation failure should not block registration.
          console.error('Guardian creation failed:', guardianError);
        }
      }
    }
    // If guardian, create guardian profile linked to user
    if (validated.userType === 'guardian') {
      await prisma.guardian.create({
        data: {
          userId: user.id,
          emergencyContactName: validated.emergencyContactName,
          emergencyContactPhone: validated.emergencyContactPhone,
          address: validated.guardianAddress,
          city: validated.guardianCity,
          state: validated.guardianState,
          zipCode: validated.guardianZipCode,
        },
      });
    }
    // Assign primary role to user
    const role = await prisma.role.findUnique({ where: { key: validated.userType } });
    if (role) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });
    }
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: validated.userType },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    // Log registration activity (use correct activityType)
    await ActivityLogger.logActivity({
      userId: user.id,
      activityType: 'action',
      description: 'User registered successfully',
      metadata: { userType: validated.userType, registrationMethod: 'email' },
      ipAddress: req.ip || req.connection.remoteAddress || (req.headers['x-forwarded-for'] as string),
      userAgent: req.headers['user-agent'] || 'Unknown',
    });
    // Exclude password from response
    const { password, ...userSansPassword } = user;
    const userWithRoles = await prisma.user.findUnique({
      where: { id: user.id },
      include: { roles: { include: { role: true } } },
    });
    res.status(201).json({
      message: 'User registered successfully',
      user: userSansPassword,
      token,
      userType: validated.userType,
      roles: userWithRoles?.roles.map((ur) => ({
        id: ur.role.id,
        key: ur.role.key,
        name: ur.role.key.charAt(0).toUpperCase() + ur.role.key.slice(1),
      })) || [],
    });
  })
);

// -----------------------------------------------------------------------------
// POST /login - Authenticate a user and issue a JWT. Performs constant time
// password comparison to mitigate timing attacks. Returns role information to
// the client for client‑side routing.
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        guardian: true,
        roles: { include: { role: true } },
      },
    });
    if (!user) throw createError('Invalid email or password', 401);
    const isValid = await bcrypt.compare(password, user.password || '');
    if (!isValid) throw createError('Invalid email or password', 401);
    // Determine highest priority role for userType
    const roleKeys = user.roles.map((ur) => ur.role.key);
    let userType: string = 'user';
    if (roleKeys.includes('admin')) userType = 'admin';
    else if (roleKeys.includes('student')) userType = 'student';
    else if (roleKeys.includes('guardian')) userType = 'guardian';
    else if (roleKeys.includes('instructor')) userType = 'instructor';
    else throw createError('User account not properly configured', 401);
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    await ActivityLogger.logLogin(user.id, req, { userType, loginMethod: 'email' });
    const { password: pw, ...userSansPassword } = user as any;
    res.json({
      message: 'Login successful',
      user: userSansPassword,
      token,
      userType,
      roles: user.roles.map((ur) => ({
        id: ur.role.id,
        key: ur.role.key,
        name: ur.role.key.charAt(0).toUpperCase() + ur.role.key.slice(1),
      })),
    });
  })
);

// -----------------------------------------------------------------------------
// GET /me - Return details of the currently authenticated user. The JWT is
// expected in the Authorization header. If the token is valid, returns user
// profile and role information.
router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('No token provided', 401);
    }
    const token = authHeader.substring(7);
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      throw createError('Invalid token', 401);
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        student: true,
        guardian: true,
        roles: { include: { role: true } },
      },
    });
    if (!user) throw createError('User not found', 401);
    const roleKeys = user.roles.map((ur) => ur.role.key);
    let userType: string = 'user';
    if (roleKeys.includes('admin')) userType = 'admin';
    else if (roleKeys.includes('student')) userType = 'student';
    else if (roleKeys.includes('guardian')) userType = 'guardian';
    else if (roleKeys.includes('instructor')) userType = 'instructor';
    else throw createError('User account not properly configured', 401);
    const { password: p, ...userSansPassword } = user as any;
    res.json({
      user: userSansPassword,
      userType,
      roles: user.roles.map((ur) => ({
        id: ur.role.id,
        key: ur.role.key,
        name: ur.role.key.charAt(0).toUpperCase() + ur.role.key.slice(1),
      })),
    });
  })
);

export default router;