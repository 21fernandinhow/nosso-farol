import Link from "next/link"

const NotFound = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="opacity-20 text-9xl select-none">🏮</div>
      <h1 className="font-serif text-2xl">Este farol não existe</h1>
      <p className="text-base-content/60 max-w-sm leading-relaxed">
        Ou talvez nunca tenha existido. Alguns sinais se perdem no caminho.
      </p>
      <Link href="/" className="btn btn-ghost btn-sm">
        Voltar ao início
      </Link>
    </main>
  )
}

export default NotFound
