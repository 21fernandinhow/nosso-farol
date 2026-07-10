export const formatStatus = (isLit: boolean, litAt: string | null): string => {
  if (!isLit) {
    if (!litAt) return "Ainda não houve sinais"
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const litDay = new Date(litAt)
    litDay.setHours(0, 0, 0, 0)
    const days = Math.round((today.getTime() - litDay.getTime()) / 86400000)
    if (days === 0) return "Último sinal hoje"
    if (days === 1) return "Último sinal ontem"
    return `Último sinal há ${days} dias`
  }
  if (!litAt) return "Acabou de acender"
  const minutes = Math.floor((Date.now() - new Date(litAt).getTime()) / 60000)
  if (minutes < 1) return "Acabou de acender"
  if (minutes < 60) return `Aceso há ${minutes} minuto${minutes !== 1 ? "s" : ""}`
  const hours = Math.floor(minutes / 60)
  return `Aceso há ${hours} hora${hours !== 1 ? "s" : ""}`
}
