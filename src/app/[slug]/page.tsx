import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { connectDB } from "@/lib/mongodb"
import { Lighthouse } from "@/models/Lighthouse"
import { Signal } from "@/models/Signal"
import { LighthouseDisplay } from "@/components/lighthouse/LighthouseDisplay"
import { LighthouseStatus } from "@/components/lighthouse/LighthouseStatus"
import { LightButton } from "@/components/lighthouse/LightButton"
import { InfoButton } from "@/components/lighthouse/InfoButton"
import { HistoryButton } from "@/components/lighthouse/HistoryButton"

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  await connectDB()
  const { slug } = await params
  const lighthouse = await Lighthouse.findOne({ slug })
  if (!lighthouse) return { title: "Farol não encontrado — Nosso Farol" }
  return {
    title: `${lighthouse.name} — Nosso Farol`,
    description: "Um sinal silencioso de que alguém pensou em você.",
    openGraph: {
      title: lighthouse.name,
      description: "Um sinal silencioso de que alguém pensou em você.",
      images: [{ url: "/og-default.png" }],
    },
  }
}

const LighthousePage = async ({ params }: PageProps) => {
  await connectDB()
  const { slug } = await params

  const lighthouse = await Lighthouse.findOne({ slug })
  if (!lighthouse) notFound()

  if (lighthouse.isLit && lighthouse.litAt) {
    if (Date.now() - lighthouse.litAt.getTime() > 24 * 60 * 60 * 1000) {
      lighthouse.isLit = false
      await lighthouse.save()
    }
  }

  const startDate = lighthouse.createdAt

  const historyRaw = await Signal.aggregate<{ _id: string }>([
    { $match: { lighthouseId: lighthouse._id, createdAt: { $gte: startDate } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } } },
    { $sort: { _id: 1 } },
  ])
  const litDates = historyRaw.map((d) => d._id)

  const isLit = lighthouse.isLit
  const litAt = lighthouse.litAt?.toISOString() ?? null

  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-center px-6 pt-10 pb-2">
        <h1 className={"font-serif text-4xl text-center"}>{lighthouse.name}</h1>
      </header>

      <section className="flex-1 flex items-center justify-center px-4">
        <LighthouseDisplay isLit={isLit} />
      </section>

      <footer className="flex items-center justify-between px-6 py-4">
        <LighthouseStatus isLit={isLit} litAt={litAt} />
        <div className="flex items-center gap-1">
          <InfoButton name={lighthouse.name} description={lighthouse.description ?? null} />
          <LightButton slug={slug} isLit={isLit} />
          <HistoryButton litDates={litDates} startDate={startDate.toISOString()} />
        </div>
      </footer>
    </main>
  )
}

export default LighthousePage
