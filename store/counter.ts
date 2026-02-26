
import { create } from "zustand"
import { persist, devtools } from "zustand/middleware"


interface CounterState {
    count: number
    increment: () => void
    decrement: () => void
    getCount: () => number
}


export const useCounterStore = create<CounterState>()(
  devtools(
    persist(
      (set, get) => ({
        count: 0,
        increment: () => set({ count: get().count + 1 }),
        decrement: () => set({ count: get().count - 1 }),
        getCount: () => get().count,
      }),
      { name: "counter-storage" }
    )
  )
)