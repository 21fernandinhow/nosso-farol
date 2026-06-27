const LighthousePageSkeleton = () => (
  <main className="flex flex-col">
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-center px-6 pt-10 pb-2">
        <div className="skeleton h-10 w-48 rounded" />
      </header>

      <section className="flex-1 flex items-center justify-center px-4">
        <div className="skeleton w-56 rounded-lg" style={{ aspectRatio: "80/200" }} />
      </section>

      <footer className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="skeleton h-4 w-36 rounded" />
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div className="skeleton w-10 h-10 rounded-full" />
          <div className="skeleton w-10 h-10 rounded-full" />
        </div>
      </footer>
    </div>

    <div className="bg-base-200 py-3 px-6">
      <div className="skeleton h-3 w-32 mx-auto rounded" />
    </div>
  </main>
)

export default LighthousePageSkeleton
