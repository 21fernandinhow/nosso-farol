import { connectDB } from "@/lib/mongodb"
import { generateUniqueSlug } from "@/lib/slug"
import { Lighthouse } from "@/models/Lighthouse"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(80).trim(),
  description: z.string().max(256).trim().nullable().optional(),
  password: z.string().min(4).max(128),
  customSlug: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
})

export const POST = async (request: Request) => {
  try {
    await connectDB()

    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return Response.json({ error: "Dados inválidos." }, { status: 400 })
    }

    const { name, description, password, customSlug } = result.data

    let slug: string
    if (customSlug) {
      const taken = await Lighthouse.exists({ slug: customSlug })
      if (taken) {
        return Response.json({ error: "Esta URL já está em uso." }, { status: 409 })
      }
      slug = customSlug
    } else {
      slug = await generateUniqueSlug(name)
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await Lighthouse.create({ name, description: description ?? null, slug, passwordHash })

    return Response.json({ slug, name }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/lighthouses]", error)
    return Response.json({ error: "Erro interno." }, { status: 500 })
  }
}