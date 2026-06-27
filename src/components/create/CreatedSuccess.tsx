"use client"

import { useState } from "react"
import Link from "next/link"

interface CreatedSuccessProps {
  slug: string
  name: string
  onClose: () => void
}

export const CreatedSuccess = ({ slug, name, onClose }: CreatedSuccessProps) => {
  const url = `${window.location.origin}/${slug}`
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-bold text-lg">Farol criado</h3>
        <p className="text-sm opacity-60 mt-1">{name}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm opacity-70">Link do farol:</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            readOnly
            className="input input-bordered w-full text-sm"
          />
          <button className="btn btn-primary shrink-0" onClick={handleCopy}>
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
      </div>

      <div className="alert text-sm">
        <span>Guarde o link e a senha. A senha não pode ser recuperada.</span>
      </div>

      <div className="modal-action">
        <button className="btn btn-ghost btn-sm" onClick={onClose}>
          Fechar
        </button>
        <Link href={`/${slug}`} className="btn btn-sm btn-primary">
          Ver o farol →
        </Link>
      </div>
    </div>
  )
}
