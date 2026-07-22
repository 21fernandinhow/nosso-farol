import { connectDB } from "@/lib/mongodb"
import { checkSlugLimit } from "@/lib/ratelimit"
import { Lighthouse } from "@/models/Lighthouse"
import { type NextRequest } from "next/server"

const slugRegex = /^[a-z0-9-]{3,40}$/

export const GET = async (request: NextRequest) => {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "anonymous"
    const { success, reset } = await checkSlugLimit.limit(ip)
    if (!success) {
      return Response.json(
        { error: "Muitas tentativas. Tente novamente em breve." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(reset / 1000)) } }
      )
    }

    const slug = request.nextUrl.searchParams.get("slug") ?? ""

    if (!slugRegex.test(slug)) {
      return Response.json({ available: false })
    }

    await connectDB()
    const exists = await Lighthouse.exists({ slug })
    return Response.json({ available: !exists })
  } catch (error) {
    console.error("[GET /api/lighthouses/check]", error)
    return Response.json({ available: false })
  }
}