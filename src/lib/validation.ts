import { z } from "zod";

export const INQUIRY_TYPES = [
  { value: "project", label: "Project inquiry" },
  { value: "internship", label: "Internship opportunity" },
  { value: "collaboration", label: "Collaboration" },
  { value: "general", label: "General question" },
] as const;

export const LIMITS = {
  name: { min: 2, max: 100 },
  organization: { max: 120 },
  subject: { min: 3, max: 150 },
  message: { min: 10, max: 2000 },
} as const;

export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(LIMITS.name.min, `Name must be at least ${LIMITS.name.min} characters.`)
    .max(LIMITS.name.max, `Name must be at most ${LIMITS.name.max} characters.`),
  email: z
    .email("Enter a valid email address, e.g. name@example.com.")
    .max(254, "Email is too long.")
    .transform((v) => v.trim().toLowerCase()),
  organization: z
    .string()
    .trim()
    .max(LIMITS.organization.max, `Organization must be at most ${LIMITS.organization.max} characters.`)
    .optional()
    .transform((v) => (v ? v : null)),
  inquiry_type: z.enum(["project", "internship", "collaboration", "general"], {
    error: "Choose an inquiry type.",
  }),
  subject: z
    .string()
    .trim()
    .min(LIMITS.subject.min, `Subject must be at least ${LIMITS.subject.min} characters.`)
    .max(LIMITS.subject.max, `Subject must be at most ${LIMITS.subject.max} characters.`),
  message: z
    .string()
    .trim()
    .min(LIMITS.message.min, `Message must be at least ${LIMITS.message.min} characters.`)
    .max(LIMITS.message.max, `Message must be at most ${LIMITS.message.max} characters.`),
  consent: z.literal(true, { error: "Please accept the privacy notice so I can respond to you." }),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export const statusChangeSchema = z.object({
  inquiryId: z.uuid(),
  newStatus: z.enum(["New", "In Review", "Responded", "Closed"]),
  note: z
    .string()
    .trim()
    .max(500, "Note must be at most 500 characters.")
    .optional()
    .transform((v) => (v ? v : null)),
});
