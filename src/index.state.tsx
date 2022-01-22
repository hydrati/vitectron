import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'index',
  state: () => ({
    count: 0
  }),
  actions: {
    addOne () {
      this.count += 1
    }
  }
})
