"use client"

import { useEffect, useRef, useState } from "react"
import { LuSmartphone, LuShare, LuEllipsisVertical, LuMenu } from "react-icons/lu"

const DISMISSED_KEY = "nosso-farol:install-dismissed"

type Platform = "ios" | "android" | "other"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void
}

const detectPlatform = (userAgent: string): Platform => {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios"
  if (/Android/i.test(userAgent)) return "android"
  return "other"
}

export const InstallButton = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [show, setShow] = useState(false)
  const [platform, setPlatform] = useState<Platform>("other")
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches
    const dismissed = localStorage.getItem(DISMISSED_KEY) === "true"
    if (!standalone && !dismissed) setShow(true)

    setPlatform(detectPlatform(navigator.userAgent))

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
  }, [])

  if (!show) return null

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true")
    setShow(false)
    dialogRef.current?.close()
  }

  const handleInstall = () => {
    deferredPrompt?.prompt()
    setDeferredPrompt(null)
  }

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        className="fixed bottom-26 right-4 z-40 md:hidden btn btn-circle bg-base-200 shadow-md opacity-70 hover:opacity-100 focus:opacity-100 transition-opacity"
        aria-label="Instalar aplicativo"
      >
        <LuSmartphone size={20} />
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Instalar o Nosso Farol</h3>
          <p className="text-center text-base-content/80 mt-2 mb-8">
            Instale como app e abra em segundos, sem navegador.
          </p>

          {deferredPrompt ? (
            <div>
              <p className="text-sm text-base-content/80">Instale com um clique:</p>
              <button className="btn btn-primary w-full mt-2" onClick={handleInstall}>
                Instalar app
              </button>
            </div>
          ) : platform === "ios" ? (
            <div>
              <p className="text-sm text-base-content/80">Para instalar, use o botão de compartilhar:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm mt-2">
                <li>
                  Toque em <strong>Compartilhar</strong>{" "}
                  <span className="inline-flex align-middle">
                    <LuShare size={16} />
                  </span>
                </li>
                <li>Toque em <strong>Adicionar à Tela de Início</strong>.</li>
                <li>Confirme em <strong>Adicionar</strong>.</li>
              </ol>
            </div>
          ) : platform === "android" ? (
            <div className="alert alert-warning">
              <span className="text-sm">
                Abra o menu{" "}
                <span className="inline-flex align-middle">
                  <LuEllipsisVertical size={16} />
                </span>{" "}
                e toque em <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.
              </span>
            </div>
          ) : (
            <p className="text-sm text-base-content/80">
              No seu navegador, abra o menu{" "}
              <span className="inline-flex align-middle">
                <LuMenu size={16} />
              </span>{" "}
              e procure por <strong>Adicionar à tela inicial</strong> ou <strong>Instalar app</strong>.
            </p>
          )}

          <div className="modal-action mt-8">
            <button className="btn btn-ghost btn-sm" onClick={handleDismiss}>
              Agora não
            </button>
            <form method="dialog">
              <button className="btn btn-sm">Fechar</button>
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
