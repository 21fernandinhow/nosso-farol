"use client"

import { useRef } from "react"

interface InfoButtonProps {
  name: string
  description: string | null
}

export const InfoButton = ({ name, description }: InfoButtonProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        className="btn btn-ghost btn-circle text-xl"
        onClick={() => dialogRef.current?.showModal()}
        title="Sobre este farol"
        aria-label="Sobre este farol"
      >
        ℹ️
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-serif font-bold text-xl">{name}</h3>
          {description && (
            <p className="mt-2 text-base-content/70">{description}</p>
          )}
          <div className="divider" />
          <p className="text-sm text-base-content/60 leading-relaxed">
            Nosso Farol é um sinal silencioso. Quando alguém acende este farol,
            significa que pensou em você — sem precisar de resposta, sem pressão,
            só um gesto contemplativo de presença.
          </p>
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
