import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useOptionStore = defineStore('options', () => {
  const nPeople = ref(6)
  const nWin = ref(5)
  const member = ref(new Array())
  const errors = ref(new Array())
  const complete = ref(false)
  const turnpercap = 3; // num of lines which one person can draw
  const member_sliced = computed(() => {
    return member.value.slice(1, nPeople.value + 1)
  })
  const nMember = computed(() => {
    var s = new Set(member_sliced.value);
    return s.size;
  })

  // for debug
  member.value = [0, "a", "b", "c", "d", "e", "f"];

  return { nPeople, nWin, member, errors, complete, turnpercap, nMember}
})
