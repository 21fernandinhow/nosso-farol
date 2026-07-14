import "@testing-library/jest-dom/vitest"

// jsdom não implementa os métodos de <dialog>; a UI usa <dialog> nativo em vários componentes.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute("open", "")
  }
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute("open")
  }
}
