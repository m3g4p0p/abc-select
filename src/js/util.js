export function fromHTML (html, attr = 'data-ref', remove = true) {
  const container = document.createElement('div')

  container.innerHTML = html

  const refs = container.querySelectorAll(`[${attr}]`)

  return Array.from(refs).reduce((carry, current) => {
    const prop = current.getAttribute(attr)

    if (remove) {
      current.removeAttribute(attr)
    }

    carry[prop] = current

    return carry
  }, {})
}