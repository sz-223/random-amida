<template>
    <div style="text-align: center">
        <div v-if="GameStore.winner.length != 0">
            <h2 style="text-align: left">抽選結果:</h2>
            <div style="display: inline-flex ">
                <div>
                    <div style="font-size:20px;  margin: 30px 50px">当選：</div>
                    <ul style="font-size:18px;  margin: 30px 50px">
                        <li v-for="i in GameStore.winner" v-bind:key="i">
                            {{ OptionStore.member[i] }}
                        </li>
                    </ul>
                </div>
                <div>
                    <div style="font-size:20px;  margin: 30px 50px">落選：</div>
                    <ul style="font-size:18px;  margin: 30px 50px">
                        <li v-for="i in GameStore.loser" v-bind:key="i">
                            {{ OptionStore.member[i] }}
                        </li>
                    </ul>
                </div>
            </div>
            <div style="text-align: right; font-size:8px; margin: 30px 0">
                <p>Hashに入力された値: {{ GameStore.preHash }}</p>
                <p>sha256: {{ GameStore.hash }}</p>
            </div>
        </div>
        <router-link to="/" style="font-size:16px">タイトルに戻る</router-link>
    </div>
</template>
<script setup>
    import { useOptionStore } from '../stores/options'
    import { useGameStore } from '../stores/game'
    const OptionStore = useOptionStore();
    const GameStore = useGameStore();
</script>