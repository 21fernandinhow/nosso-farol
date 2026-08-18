"use client"

import Link from "next/link"
import { useRef } from "react"
import { LuBookmark } from "react-icons/lu"
import { useSavedLighthouses } from "@/hooks/useSavedLighthouses"

export const MyLighthouses = () => {
  const { list, remove, hydrated } = useSavedLighthouses()
  const dialogRef = useRef<HTMLDialogElement>(null)

  if (!hydrated || list.length === 0) return null

  const sorted = [...list].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  )

  return (
    <>
      <button
        className="btn btn-ghost btn-sm gap-2"
        onClick={() => dialogRef.current?.showModal()}
      >
        <LuBookmark size={16} />
        Meus faróis
        <span className="badge badge-sm">{list.length}</span>
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Meus faróis</h3>
          <ul className="flex flex-col rounded-box border border-base-300 overflow-hidden">
            {sorted.map((lighthouse) => (
              <li
                key={lighthouse.slug}
                className="flex items-center justify-between px-4 py-3 border-b border-base-300 last:border-b-0 hover:bg-base-200 transition-colors"
              >
                <Link
                  href={`/${lighthouse.slug}`}
                  className="flex-1 text-sm font-medium truncate pr-2"
                  onClick={() => dialogRef.current?.close()}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {lighthouse.name}
                </Link>
                <button
                  onClick={() => remove(lighthouse.slug)}
                  className="btn btn-ghost btn-xs opacity-40 hover:opacity-100"
                  aria-label={`Remover ${lighthouse.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
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
