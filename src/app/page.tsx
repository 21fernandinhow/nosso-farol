import { CreateForm } from "@/components/create/CreateForm"
import { LighthouseIcon } from "@/components/lighthouse/LighthouseIcon"

const HomePage = () => {
  return (
    <main className="flex flex-col">
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="flex flex-col items-center gap-10 max-w-sm w-full text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">Nosso Farol</h1>

          <div className="flex flex-col gap-5 text-base-content/70 leading-relaxed">
            <p>
              Existem pessoas que continuam iluminando um pedaço da nossa história,
              mesmo à distância.
            </p>

            <p>Nosso Farol é uma forma silenciosa de dizer:</p>

            <p className="font-serif text-xl text-base-content/90 italic">
              "Hoje pensei em você."
            </p>

            <p>
              Crie um farol, compartilhe o link e, sempre que lembrar dessa pessoa,
              acenda a luz.
            </p>

            <p>Ela poderá visitar o farol quando quiser.</p>

            <p className="text-base-content/50">
              Sem mensagens. Sem notificações. Sem esperar uma resposta. Apenas carinho.
            </p>
          </div>

          <CreateForm />
        </div>
      </div>

      <footer className="text-center px-6 py-3 bg-base-200">
        <p className="text-xs text-base-content/30">
          Feito com carinho por{" "}
          <a
            href="https://tudoaqui.click/founder"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-base-content/60 transition-colors underline underline-offset-2"
          >
            Fernando
          </a>
        </p>
      </footer>
    </main>
  )
}

export default HomePage
