import './reset.css'
import './style.css'
import { fruits, type fruit } from './data/fruits'
import gsap from "gsap";

let appContainer = document.getElementById('app')
if (!appContainer) {
  console.error("app container is not valid")
}

let mouseX = 0
let mouseY = 0

document.addEventListener("mousemove", (ev: MouseEvent) => {
  mouseX = ev.clientX
  mouseY = ev.clientY
})

document.addEventListener("mouseup", () => {
  fruitDivs.forEach((fruitDiv) => {
    fruitDiv.isDragged = false
  })
})

const fruitDivs: { distX: number, distY: number, isDragged: boolean, div: HTMLDivElement }[] = []

const createFruit = (fruit: fruit) => {
  if (!appContainer) return;
  const div = document.createElement("div");
  appContainer.appendChild(div)
  div.style.backgroundColor = "red"
  div.style.width = "200px"
  div.style.height = "200px"
  div.style.position = "absolute"
  div.style.left = fruit.x.toString() + "px"
  div.style.top = fruit.y.toString() + "px"
  div.addEventListener("pointerdown", (ev: PointerEvent) => onFruitDragStart(div, ev))
  div.addEventListener("pointerup", (ev: PointerEvent) => onFruitDragEnd(div, ev))
  fruitDivs.push({ distX: 0, distY: 0, isDragged: false, div })
}

fruits.forEach((fruit: fruit) => {
  if (fruit) {
    createFruit(fruit)
  }
})

const onFruitDragStart = (div: HTMLDivElement, ev: PointerEvent) => {
  const relatedFruitDiv = fruitDivs.find((fruitDiv) => div === fruitDiv.div)
  if (!relatedFruitDiv) return;
  const fruitDivLeft = Number(relatedFruitDiv.div.style.left.replace('px', ''))
  const fruitDivTop = Number(relatedFruitDiv.div.style.top.replace('px', ''))
  const distX = Math.abs(fruitDivLeft - mouseX)
  const distY = Math.abs(fruitDivTop - mouseY)
  relatedFruitDiv.isDragged = true
  relatedFruitDiv.distX = distX
  relatedFruitDiv.distY = distY
}

const onFruitDragEnd = (div: HTMLDivElement, ev: PointerEvent) => {
  const relatedFruitDiv = fruitDivs.find((fruitDiv) => div === fruitDiv.div)
  if (!relatedFruitDiv) return;
  relatedFruitDiv.isDragged = false
  relatedFruitDiv.distX = 0
  relatedFruitDiv.distY = 0
}

const update = () => {
  requestAnimationFrame(update)
  fruitDivs.forEach((fruitDiv) => {
    if (fruitDiv.isDragged) {
      gsap.to(fruitDiv.div.style, {
        left: fruitDiv.div.style.left = (mouseX - fruitDiv.distX).toString() + 'px'
      })
      gsap.to(fruitDiv.div.style, {
        top: fruitDiv.div.style.top = (mouseY - fruitDiv.distY).toString() + 'px'
      })
      fruitDiv.div.style.left = (mouseX - fruitDiv.distX).toString() + 'px'
      fruitDiv.div.style.top = (mouseY - fruitDiv.distY).toString() + 'px'
    }
  })
}

update();