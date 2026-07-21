export const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
}

window.addEventListener("keydown", (e) => {
  if (e.key in keys) {
    e.preventDefault();
    keys[e.key] = true;
  }
})

window.addEventListener("keyup", (e) => {
  if (e.key in keys) {
    e.preventDefault();
    keys[e.key] = false;
  }
})
