import { connectDB } from "@/lib/mongodb"
import { lighthouseCreateLimit } from "@/lib/ratelimit"
import { generateUniqueSlug } from "@/lib/slug"
import { Lighthouse } from "@/models/Lighthouse"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().trim().min(1).max(80).regex(/\S/, "Nome não pode ser só espaços"),
  description: z.string().max(256).trim().nullable().optional(),
  password: z.string().trim().min(4).max(128).regex(/\S/, "Senha não pode ser só espaços"),
  customSlug: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
})

export const POST = async (request: Request) => {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "anonymous"
    const { success, reset } = await lighthouseCreateLimit.limit(ip)
    if (!success) {
      return Response.json(
        { error: "Muitas tentativas. Tente novamente em breve." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(reset / 1000)) } }
      )
    }

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