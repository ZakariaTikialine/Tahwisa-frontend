import * as z from 'zod'

export const registerSchema = z.object({
    nom: z.string().min(2),
    prénom: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    téléphone: z.string().min(10),
    matricule: z.string().min(3),
    department: z.string().min(2)
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})
