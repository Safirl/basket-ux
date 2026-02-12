import './reset.css'
import './style.css'
import { fruits, type Fruit } from './data/fruits'

const app = document.getElementById('app')
if (!app) throw new Error('Missing #app')

const stage = document.createElement('div')
stage.className = 'stage'
app.appendChild(stage)

const basket = document.createElement('div')
basket.className = 'basket'
basket.innerHTML = `<div class="basket-title">Basket</div><div class="basket-subtitle"><span data-basket-count>0</span> / ${fruits.length}</div>`
stage.appendChild(basket)

const itemsLayer = document.createElement('div')
itemsLayer.className = 'items-layer'
stage.appendChild(itemsLayer)

type ItemState = {
  el: HTMLDivElement
  x: number
  y: number
  startX: number
  startY: number
  offsetX: number
  offsetY: number
  dragging: boolean
  pointerId: number | null
  inBasket: boolean
}

const items: ItemState[] = []

const stageRect = () => stage.getBoundingClientRect()

const inside = (x: number, y: number, rect: DOMRect) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom

const setPos = (state: ItemState, x: number, y: number) => {
  state.x = x
  state.y = y
  state.el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`
}

const animateTo = (state: ItemState, x: number, y: number) => {
  state.el.style.transition = 'transform 180ms ease'
  setPos(state, x, y)
  window.setTimeout(() => {
    if (!state.dragging) state.el.style.transition = ''
  }, 200)
}

const updateCount = () => {
  const el = basket.querySelector('[data-basket-count]')
  if (el) el.textContent = String(items.filter((i) => i.inBasket).length)
}

const layoutRing = () => {
  const r = stageRect()
  const cx = r.width / 2
  const cy = r.height / 2
  const radius = Math.min(r.width, r.height) * 0.36
  const movable = items.filter((i) => !i.inBasket && !i.dragging)
  movable.forEach((state, index) => {
    const angle = (index / movable.length) * Math.PI * 2 - Math.PI / 2
    const w = state.el.offsetWidth || 140
    const h = state.el.offsetHeight || 60
    setPos(state, cx + Math.cos(angle) * radius - w / 2, cy + Math.sin(angle) * radius - h / 2)
  })
}

const onDown = (state: ItemState, ev: PointerEvent) => {
  if (state.inBasket) {
    state.inBasket = false
    state.el.classList.remove('item--in-basket')
    updateCount()
  }

  state.dragging = true
  state.pointerId = ev.pointerId
  state.startX = state.x
  state.startY = state.y
  state.el.style.zIndex = '20'
  state.el.style.transition = 'none'

  const sr = stageRect()
  const er = state.el.getBoundingClientRect()
  state.offsetX = ev.clientX - sr.left - (er.left - sr.left)
  state.offsetY = ev.clientY - sr.top - (er.top - sr.top)

  state.el.setPointerCapture(ev.pointerId)
}

const onMove = (state: ItemState, ev: PointerEvent) => {
  if (!state.dragging || state.pointerId !== ev.pointerId) return

  const sr = stageRect()
  const w = state.el.offsetWidth
  const h = state.el.offsetHeight
  const x = Math.max(0, Math.min(sr.width - w, ev.clientX - sr.left - state.offsetX))
  const y = Math.max(0, Math.min(sr.height - h, ev.clientY - sr.top - state.offsetY))
  setPos(state, x, y)

  const br = basket.getBoundingClientRect()
  basket.classList.toggle('basket--active', inside(ev.clientX, ev.clientY, br))
}

const onUp = (state: ItemState, ev: PointerEvent) => {
  if (!state.dragging || state.pointerId !== ev.pointerId) return

  state.dragging = false
  state.pointerId = null
  basket.classList.remove('basket--active')

  const br = basket.getBoundingClientRect()
  const ir = state.el.getBoundingClientRect()
  const cx = ir.left + ir.width / 2
  const cy = ir.top + ir.height / 2

  if (!inside(cx, cy, br)) {
    state.el.style.zIndex = state.inBasket ? '5' : '1'
    animateTo(state, state.startX, state.startY)
    return
  }

  const sr = stageRect()
  const bx = br.left - sr.left + br.width / 2 - ir.width / 2
  const by = br.top - sr.top + br.height / 2 - ir.height / 2
  state.inBasket = true
  state.el.classList.add('item--in-basket')
  state.el.style.zIndex = '5'
  updateCount()
  animateTo(state, bx, by)
}

const makeItem = (fruit: Fruit) => {
  const el = document.createElement('div')
  el.className = 'item'
  el.innerHTML = `<div class="item-head"><img class="item-image" src="${fruit.image}" alt="${fruit.name}" draggable="false" /><div class="item-name">${fruit.name}</div></div><div class="item-id">#${fruit.id}</div>`
  itemsLayer.appendChild(el)

  const state: ItemState = {
    el,
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    pointerId: null,
    inBasket: false,
  }

  items.push(state)
  setPos(state, 0, 0)
  el.addEventListener('pointerdown', (ev) => onDown(state, ev))
  el.addEventListener('pointermove', (ev) => onMove(state, ev))
  el.addEventListener('pointerup', (ev) => onUp(state, ev))
  el.addEventListener('pointercancel', (ev) => onUp(state, ev))
}

fruits.forEach(makeItem)
requestAnimationFrame(layoutRing)
window.addEventListener('resize', layoutRing)