import { customAlphabet } from "nanoid"
import { Lighthouse } from "@/models/Lighthouse"

const generate = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10)

export const generateUniqueSlug = async (): Promise<string> => {
  for (let i = 0; i < 5; i++) {
    const slug = generate()
    const exists = await Lighthouse.exists({ slug })
    if (!exists) return slug
  }
  throw new Error("Falha ao gerar slug único.")
}
