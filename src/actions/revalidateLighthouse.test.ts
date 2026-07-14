import { revalidatePath } from "next/cache"
import { revalidateLighthouse } from "./revalidateLighthouse"

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

describe("revalidateLighthouse", () => {
  it("revalida o caminho do farol pelo slug", async () => {
    await revalidateLighthouse("para-ana")
    expect(revalidatePath).toHaveBeenCalledWith("/para-ana")
    expect(revalidatePath).toHaveBeenCalledTimes(1)
  })
})
