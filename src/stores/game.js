import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
    const permMember = ref(new Array())
    const permResult = ref(new Array())
    const permTurn = ref(new Array())
    const hash = ref();
    const lines = ref(new Array())
    const winner = ref(new Array())

    const shuffle = (array) => {
        for (let i = array.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const makeHash = () => {
        return 0;
    }

    const init = (nPeople) => {
        permMember.value = Array.from({length: nPeople}, (_, i) => i + 1);
        permResult.value = Array.from({length: nPeople}, (_, i) => i + 1);
        permTurn.value = Array.from({length: nPeople}, (_, i) => i + 1);
        shuffle(permMember.value)
        shuffle(permResult.value)
        shuffle(permTurn.value)
        hash.value = makeHash()
        return true
    }

    const win = (number, nWin) => {
        if(permResult.value[number] <= nWin){
            return '当選'
        }
        else return '落選'
    }

    const makeWinner = (nWin) => {
        const mem = [...permMember];
        for(let i = 0; i < lines.value.length; i++){
            [mem[lines.value[i][0]], mem[lines.value[i][1]]] = [mem[lines.value[i][1]], mem[lines.value[i][0]]];
        }
        for(let i = 0; i < mem.length; i++){
            if(permResult.value[i] <= nWin){
                winner.value.push(mem[i]);
            }
        }
    }

    return { permMember, permResult, permTurn, hash, lines, init, win, makeWinner }
})