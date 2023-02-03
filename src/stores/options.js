import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useOptionStore = defineStore('options', () => {
  const nPeople = ref(6)
  const nWin = ref(5)
  const member = ref(new Array())
  const errors = ref(new Array())
  const member_sliced = computed(() => {
    return member.value.slice(1, nPeople.value + 1)
  })
  const nMember = computed(() => {
    var s = new Set(member_sliced.value);
    return s.size;
  })
  function increment() {
    
  }

  return { nPeople, nWin, member, errors, nMember, increment }
})
