
export default {
  params: new URLSearchParams(globalThis.location?.search ?? ""),
  get(name) {
    return this.params.get(name)
  },
  set(name, value = null) {
    if (value === null) {
      this.params.delete(name)
    } else {
      this.params.set(name, value)
    }
    history.replaceState(null, "", location.pathname + (this.params.toString() ? "?"+this.params.toString() : ""))
  },
  build(qobj) {
    return "?"+(new URLSearchParams(qobj)).toString()
  }
}