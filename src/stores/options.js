import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useOptionStore = defineStore('options', () => {
  const nPeople = ref(6)
  const nWin = ref(5)
  const member = ref(new Array())
  function increment() {
    
  }

  return { nPeople, nWin, member, increment }
})
