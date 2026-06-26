import { connectDB } from "@/lib/mongodb"
import { Lighthouse } from "@/models/Lighthouse"
import { Signal } from "@/models/Signal"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  password: z.string().min(1),
})

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    await connectDB()

    const { slug } = await params
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return Response.json({ error: "Dados inválidos." }, { status: 400 })
    }

    const { password } = result.data

    const lighthouse = await Lighthouse.findOne({ slug }).select("+passwordHash")

    if (!lighthouse) {
      return Response.json({ error: "Farol não encontrado." }, { status: 404 })
    }

    const isValid = await bcrypt.compare(password, lighthouse.passwordHash)

    if (!isValid) {
      return Response.json({ error: "Senha incorreta." }, { status: 401 })
    }

    lighthouse.isLit = true
    lighthouse.litAt = new Date()
    await lighthouse.save()

    await Signal.create({ lighthouseId: lighthouse._id })

    return Response.json({ isLit: true, litAt: lighthouse.litAt.toISOString() })
  } catch (error) {
    console.error("[POST /api/lighthouses/[slug]/signal]", error)
    return Response.json({ error: "Erro interno." }, { status: 500 })
  }
}
