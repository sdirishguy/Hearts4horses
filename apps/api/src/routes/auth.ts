import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { ActivityLogger } from '../services/activityLogger';
const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  userType: z.enum(['student', 'guardian', 'instructor']),
  
  // Student-specific fields
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
  
  // Guardian-specific fields (for student registrations)
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

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
      }
    });

    // Create student profile if userType is student
    if (validatedData.userType === 'student') {
      await prisma.student.create({
        data: {
          userId: user.id,
          dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
          experienceLevel: validatedData.experienceLevel,
          emergencyContactName: validatedData.emergencyContactName,
          emergencyContactPhone: validatedData.emergencyContactPhone,
          emergencyContactRelationship: validatedData.emergencyContactRelationship,
          medicalConditions: validatedData.medicalConditions,
          allergies: validatedData.allergies,
          medications: validatedData.medications,
          insuranceProvider: validatedData.insuranceProvider,
          insurancePolicyNumber: validatedData.insurancePolicyNumber,
        }
      });

      // Create guardian profile if guardian information is provided
      if (validatedData.guardianFirstName && validatedData.guardianLastName) {
        try {
          const guardianUser = await prisma.user.create({
            data: {
              email: validatedData.guardianEmail || `${validatedData.guardianFirstName.toLowerCase()}.${validatedData.guardianLastName.toLowerCase()}@guardian.hearts4horses.com`,
              firstName: validatedData.guardianFirstName,
              lastName: validatedData.guardianLastName,
              phone: validatedData.guardianPhone,
            }
          });

          const guardianRole = await prisma.role.findUnique({
            where: { key: 'guardian' }
          });

          if (guardianRole) {
            await prisma.userRole.create({
              data: {
                userId: guardianUser.id,
                roleId: guardianRole.id
              }
            });
          }

          const guardian = await prisma.guardian.create({
            data: {
              userId: guardianUser.id,
              emergencyContactName: validatedData.emergencyContactName,
              emergencyContactPhone: validatedData.emergencyContactPhone,
              address: validatedData.guardianAddress,
              city: validatedData.guardianCity,
              state: validatedData.guardianState,
              zipCode: validatedData.guardianZipCode,
            }
          });

          // Create guardian-student relationship
          const student = await prisma.student.findUnique({
            where: { userId: user.id }
          });

          if (student) {
            await prisma.guardianStudent.create({
              data: {
                guardianId: guardian.id,
                studentId: student.id,
                relationship: validatedData.guardianRelationship,
              }
            });
          }
        } catch (guardianError) {
          console.error('Error creating guardian profile:', guardianError);
          // Continue with student registration even if guardian creation fails
        }
      }
    }

    // Create guardian profile if userType is guardian
    if (validatedData.userType === 'guardian') {
      await prisma.guardian.create({
        data: {
          userId: user.id,
          emergencyContactName: validatedData.emergencyContactName,
          emergencyContactPhone: validatedData.emergencyContactPhone,
          address: validatedData.guardianAddress,
          city: validatedData.guardianCity,
          state: validatedData.guardianState,
          zipCode: validatedData.guardianZipCode,
        }
      });
    }

    // Assign role to user based on userType
    const roleKey = validatedData.userType;
    const role = await prisma.role.findUnique({
      where: { key: roleKey }
    });

    if (role) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id
          }
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        userType: validatedData.userType 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Log registration activity
    await ActivityLogger.logActivity({
      userId: user.id,
      activityType: 'login',
      description: 'User registered successfully',
      metadata: {
        userType: validatedData.userType,
        registrationMethod: 'email'
      },
      ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] as string,
      userAgent: req.headers['user-agent'] || 'Unknown'
    });

    // Return user data (without password) and token
    const { password, ...userWithoutPassword } = user;
    
    // Get user with roles for response
    const userWithRoles = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token,
      userType: validatedData.userType,
      roles: userWithRoles?.roles.map(userRole => ({
        id: userRole.role.id,
        key: userRole.role.key,
        name: userRole.role.key.charAt(0).toUpperCase() + userRole.role.key.slice(1)
      })) || []
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    // Find user with roles
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        student: true,
        guardian: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password || '');
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Determine user type from roles
    let userType = 'user';
    const roleKeys = user.roles.map(userRole => userRole.role.key);
    
    if (roleKeys.includes('admin')) userType = 'admin';
    else if (roleKeys.includes('student')) userType = 'student';
    else if (roleKeys.includes('guardian')) userType = 'guardian';
    else if (roleKeys.includes('instructor')) userType = 'instructor';
    else {
      // If user has no roles, return an error
      return res.status(401).json({ 
        error: 'User account not properly configured. Please contact support.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        userType 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Log login activity
    await ActivityLogger.logLogin(user.id, req, {
      userType,
      loginMethod: 'email'
    });

    // Return user data (without password) and token
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
      userType,
      roles: user.roles.map(userRole => ({
        id: userRole.role.id,
        key: userRole.role.key,
        name: userRole.role.key.charAt(0).toUpperCase() + userRole.role.key.slice(1)
      }))
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        student: true,
        guardian: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Determine user type from roles
    let userType = 'user';
    const roleKeys = user.roles.map(userRole => userRole.role.key);
    
    if (roleKeys.includes('admin')) userType = 'admin';
    else if (roleKeys.includes('student')) userType = 'student';
    else if (roleKeys.includes('guardian')) userType = 'guardian';
    else if (roleKeys.includes('instructor')) userType = 'instructor';
    else {
      // If user has no roles, return an error
      return res.status(401).json({ 
        error: 'User account not properly configured. Please contact support.' 
      });
    }

    const { password, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      userType,
      roles: user.roles.map(userRole => ({
        id: userRole.role.id,
        key: userRole.role.key,
        name: userRole.role.key.charAt(0).toUpperCase() + userRole.role.key.slice(1)
      }))
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
