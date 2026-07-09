import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/mongodb"
import { Lighthouse } from "@/models/Lighthouse"
import { Signal } from "@/models/Signal"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  password: z.string().min(1),
  tz: z.number().int().optional(),
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

    const { password, tz = 0 } = result.data

    const lighthouse = await Lighthouse.findOne({ slug }).select("+passwordHash")

    if (!lighthouse) {
      return Response.json({ error: "Farol não encontrado." }, { status: 404 })
    }

    const isValid = await bcrypt.compare(password, lighthouse.passwordHash)

    if (!isValid) {
      return Response.json({ error: "Senha incorreta." }, { status: 401 })
    }

    // Compute today's midnight in the user's local timezone.
    // tz = getTimezoneOffset() = minutes west of UTC (e.g. Brazil UTC-3 → tz=180).
    const now = new Date()
    const localNow = new Date(now.getTime() - tz * 60 * 1000)
    localNow.setUTCHours(0, 0, 0, 0)
    const todayLocal = new Date(localNow.getTime() + tz * 60 * 1000)

    if (lighthouse.litAt && lighthouse.litAt >= todayLocal) {
      return Response.json({ error: "O farol já está aceso hoje.", litAt: lighthouse.litAt.toISOString() }, { status: 409 })
    }

    lighthouse.litAt = new Date()
    await lighthouse.save()

    await Signal.create({ lighthouseId: lighthouse._id })

    revalidatePath(`/${slug}`)

    return Response.json({ isLit: true, litAt: lighthouse.litAt.toISOString() })
  } catch (error) {
    console.error("[POST /api/lighthouses/[slug]/signal]", error)
    return Response.json({ error: "Erro interno." }, { status: 500 })
  }
}
