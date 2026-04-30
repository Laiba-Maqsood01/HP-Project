import { z } from "zod";

export const createCourseSchema = z.object({
    title: z
        .string()
        .min(3)
        .max(100),

    description: z
        .string()
        .min(10),

    category: z
        .string()
        .min(2),

    price: z
        .coerce
        .number()
        .min(0),

    thumbnail: z
        .string()
        .url()
        .optional(),

    isPublished: z
        .boolean()
        .optional(),
});

export const updateCourseSchema = z.object({
    title: z
        .string()
        .min(3)
        .max(100)
        .optional(),

    description: z
        .string()
        .min(10)
        .optional(),

    category: z
        .string()
        .min(2)
        .optional(),

    price: z
        .coerce
        .number()
        .min(0)
        .optional(),

    isPublished: z
        .coerce
        .boolean()
        .optional(),
});

export const lessonSchema = z.object({
    title: z
        .string()
        .min(3),
    content: z
        .string()
        .optional(),
    videoUrl: z
        .string()
        .optional(),
    duration: z
        .coerce
        .number()
        .min(0)
        .optional()
})