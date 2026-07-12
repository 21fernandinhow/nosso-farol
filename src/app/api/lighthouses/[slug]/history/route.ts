import mongoose from "mongoose"
import { connectDB } from "@/lib/mongodb"
import { Signal } from "@/models/Signal"

export const revalidate = false

const tzOffsetToString = (tz: number): string => {
  // getTimezoneOffset() = minutes west of UTC (Brazil UTC-3 → 180 → "-03:00")
  const sign = tz > 0 ? "-" : "+"
  const abs = Math.abs(tz)
  const hours = Math.floor(abs / 60)
  const minutes = abs % 60
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

export const GET = async (request: Request) => {
  try {
    const url = new URL(request.url)
    const startDate = url.searchParams.get("start")
    const lighthouseId = url.searchParams.get("id")
    const tz = parseInt(url.searchParams.get("tz") ?? "0", 10)

    if (!startDate || !lighthouseId || !mongoose.Types.ObjectId.isValid(lighthouseId) || isNaN(tz)) {
      return Response.json({ error: "Parâmetros inválidos." }, { status: 400 })
    }

    await connectDB()

    const timezone = tzOffsetToString(tz)

    const historyRaw = await Signal.aggregate<{ _id: string }>([
      {
        $match: {
          lighthouseId: new mongoose.Types.ObjectId(lighthouseId),
          createdAt: { $gte: new Date(startDate) },
        },
      },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone } } } },
      { $sort: { _id: 1 } },
    ])

    return Response.json({
      litDates: historyRaw.map((d) => d._id),
      startDate,
    })
  } catch (error) {
    console.error("[GET /api/lighthouses/[slug]/history]", error)
    return Response.json({ error: "Erro interno." }, { status: 500 })
  }
}
