"use client"

import { useRef } from "react"
import { LighthouseHistory } from "./LighthouseHistory"

interface HistoryButtonProps {
  litDates: string[]
  startDate: string
}

export const HistoryButton = ({ litDates, startDate }: HistoryButtonProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        className="btn btn-ghost btn-circle text-xl"
        onClick={() => dialogRef.current?.showModal()}
        title="Histórico de sinais"
        aria-label="Histórico de sinais"
      >
        📜
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Histórico de sinais</h3>
          <LighthouseHistory litDates={litDates} startDate={startDate} />
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
