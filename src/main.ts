import './reset.css'
import './style.css'
import { fruits, type fruit } from './data/fruits'

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

const fruitDivs: { isDragged: boolean, div: HTMLDivElement }[] = []

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
  fruitDivs.push({ isDragged: false, div })
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
  const fruitDivRight = Number(relatedFruitDiv.div.style.right.replace('px', ''))
  const distX = fruitDivLeft - 
}

const onFruitDragEnd = (div: HTMLDivElement, ev: PointerEvent) => {

}

const update = () => {
  requestAnimationFrame(update)

}