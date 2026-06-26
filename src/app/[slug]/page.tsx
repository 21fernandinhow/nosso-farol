const LighthousePage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params

  return <h1>pagina de farol - {slug}</h1>
}

export default LighthousePage
