import * as z from 'zod';

// Password validation that matches your backend requirements
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  // Add this if your backend requires special characters
  // .regex(/[@$!%*?&]/, "Must contain at least one special character (@$!%*?&)")

export const registerSchema = z.object({
    nom: z.string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name cannot exceed 50 characters"),
    prénom: z.string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name cannot exceed 50 characters"),
    email: z.string()
        .email("Invalid email address")
        .max(100, "Email cannot exceed 100 characters"),
    password: passwordSchema,
    téléphone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number cannot exceed 15 digits")
        .regex(/^[0-9]+$/, "Phone number must contain only numbers"),
    matricule: z.string()
        .min(3, "Employee ID must be at least 3 characters")
        .max(20, "Employee ID cannot exceed 20 characters"),
    structure: z.string()
        .min(2, "Structure must be at least 2 characters")
        .max(50, "Structure cannot exceed 50 characters")
});

export const loginSchema = z.object({
    email: z.string()
        .email("Invalid email address"),
    password: z.string()
        .min(1, "Password is required")
});