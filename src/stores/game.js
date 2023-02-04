import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
    const permMember = ref(new Array())
    const permResult = ref(new Array())
    const permTurn = ref(new Array())
    const salt = ref();
    const hash = ref(0);
    const preHash = ref(0);
    const lines = ref(new Array())
    const winner = ref(new Array())
    const loser = ref(new Array())

    const shuffle = (array) => {
        for (let i = array.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const makeHash = async (member, nWin) => {
        var text = [];
        for(let i = 0; i < permMember.value.length; i++){
            text += member[permMember.value[i]]
        }
        for(let i = 0; i < permResult.value.length; i++){
            text += win(i, nWin)
        }
        text += salt.value;
        const uint8  = new TextEncoder().encode(text)
        const digest = await crypto.subtle.digest('SHA-256', uint8)
        hash.value = Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2,'0')).join('')
        preHash.value = text;
        return true;
    }

    const init = (nPeople) => {
        salt.value = Math.random().toString(32).substring(2);
        lines.value = []
        winner.value = []
        loser.value = []
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
        const mem = [...permMember.value];
        for(let i = 0; i < lines.value.length; i++){
            [mem[lines.value[i][0]], mem[lines.value[i][1]]] = [mem[lines.value[i][1]], mem[lines.value[i][0]]];
        }
        for(let i = 0; i < mem.length; i++){
            if(permResult.value[i] <= nWin){
                winner.value.push(mem[i]);
            }else{
                loser.value.push(mem[i]);
            }
        }
    }
    winner.value.sort();
    loser.value.sort();
    return { permMember, permResult, permTurn, salt, hash, preHash, lines, winner, loser, init, makeHash, win, makeWinner }
})