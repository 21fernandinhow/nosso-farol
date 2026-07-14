import mongoose from "mongoose"
import { Signal } from "./Signal"

const validationError = async (doc: InstanceType<typeof Signal>) => {
  try {
    await doc.validate()
    return undefined
  } catch (error) {
    return error as mongoose.Error.ValidationError
  }
}

describe("Signal schema", () => {
  it("não gera erros de validação com lighthouseId preenchido", async () => {
    const error = await validationError(new Signal({ lighthouseId: new mongoose.Types.ObjectId() }))
    expect(error).toBeUndefined()
  })

  it("exige lighthouseId", async () => {
    const error = await validationError(new Signal({}))
    expect(error?.errors.lighthouseId).toBeDefined()
  })

  it("tem índice composto por lighthouseId e createdAt desc", () => {
    const indexes = Signal.schema.indexes()
    expect(indexes).toContainEqual([{ lighthouseId: 1, createdAt: -1 }, expect.anything()])
  })
})
