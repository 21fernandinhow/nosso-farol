import { connectDB } from "@/lib/mongodb"
import { Lighthouse } from "@/models/Lighthouse"
import { type NextRequest } from "next/server"

const slugRegex = /^[a-z0-9-]{3,40}$/

export const GET = async (request: NextRequest) => {
  try {
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