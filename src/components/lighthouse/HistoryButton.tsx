"use client"

import { useRef, useState } from "react"
import { LuCalendarDays } from "react-icons/lu"
import { LighthouseHistory } from "./LighthouseHistory"

interface HistoryButtonProps {
  slug: string
  startDate: string
  lighthouseId: string
}

interface HistoryData {
  litDates: string[]
  startDate: string
}

export const HistoryButton = ({ slug, startDate, lighthouseId }: HistoryButtonProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [data, setData] = useState<HistoryData | null>(null)
  const [loading, setLoading] = useState(false)

  const handleOpen = async () => {
    dialogRef.current?.showModal()
    if (data) return
    setLoading(true)
    const tz = new Date().getTimezoneOffset()
    const res = await fetch(`/api/lighthouses/${slug}/history?start=${startDate}&id=${lighthouseId}&tz=${tz}`)
    setData(await res.json())
    setLoading(false)
  }

  return (
    <>
      <button
        className="btn btn-ghost btn-circle tooltip tooltip-top"
        data-tip="Histórico"
        onClick={handleOpen}
        aria-label="Histórico"
      >
        <LuCalendarDays size={20} />
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Histórico de sinais</h3>
          {loading && (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md" />
            </div>
          )}
          {data && <LighthouseHistory litDates={data.litDates} startDate={data.startDate} />}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Fechar</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>fechar</button>
        </form>
      </dialog>
    </>
  )
}
