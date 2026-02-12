export interface fruit {
    id: number,
    name: string,
    x: number,
    y: number
    path: string
}

export const fruits = [
    {
        id: 0,
        name: "aubergine",
        x: 100,
        y: 100,
        path: ""
    }
] as fruit[]