import mongoose from "mongoose"
import { Lighthouse } from "./Lighthouse"

const valid = {
  name: "Farol da Ana",
  slug: "farol-da-ana",
  passwordHash: "hashed",
}

const validationError = async (doc: InstanceType<typeof Lighthouse>) => {
  try {
    await doc.validate()
    return undefined
  } catch (error) {
    return error as mongoose.Error.ValidationError
  }
}

describe("Lighthouse schema", () => {
  it("não gera erros de validação com os campos obrigatórios preenchidos", async () => {
    const error = await validationError(new Lighthouse(valid))
    expect(error).toBeUndefined()
  })

  it("exige name", async () => {
    const error = await validationError(new Lighthouse({ ...valid, name: undefined }))
    expect(error?.errors.name).toBeDefined()
  })

  it("limita name a 80 caracteres", async () => {
    const error = await validationError(new Lighthouse({ ...valid, name: "a".repeat(81) }))
    expect(error?.errors.name).toBeDefined()
  })

  it("exige slug", async () => {
    const error = await validationError(new Lighthouse({ ...valid, slug: undefined }))
    expect(error?.errors.slug).toBeDefined()
  })

  it("exige passwordHash", async () => {
    const error = await validationError(new Lighthouse({ ...valid, passwordHash: undefined }))
    expect(error?.errors.passwordHash).toBeDefined()
  })

  it("passwordHash não é retornado por padrão (select: false)", () => {
    const path = Lighthouse.schema.path("passwordHash")
    expect(path.options.select).toBe(false)
  })

  it("permite description nula por padrão", () => {
    const doc = new Lighthouse(valid)
    expect(doc.description).toBeNull()
  })

  it("limita description a 256 caracteres", async () => {
    const error = await validationError(new Lighthouse({ ...valid, description: "a".repeat(257) }))
    expect(error?.errors.description).toBeDefined()
  })

  it("litAt é nulo por padrão", () => {
    const doc = new Lighthouse(valid)
    expect(doc.litAt).toBeNull()
  })
})
