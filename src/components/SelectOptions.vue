<template>
    <div>
        <div class="selectwrap">
            <div class="selectbox">
                参加人数:
                <div include="form-input-select()">
                    <select type="number" name="npeople" v-model.number="OptionStore.nPeople">
                        <option v-for="n in 19" v-bind:value="n + 1" v-bind:key="n">{{ n + 1 }}人</option>
                    </select>
                </div>
            </div>
            <div class="selectbox">
                当選人数:
                <div include="form-input-select()">
                    <select type="number" name="nwin" v-model.number="OptionStore.nWin">
                        <option v-for="n in OptionStore.nPeople" v-bind:value="n" v-bind:key="n">{{ n }}人</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="inputboxes">
            <div v-for="i in OptionStore.nPeople" :key="i" style="display: inline-flex">
                <input type="text" v-model="OptionStore.member[i]" :placeholder="forPlaceHolder(i)">
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useOptionStore } from '../stores/options'
    const OptionStore = useOptionStore();
    function forPlaceHolder(i){
        return i + "人目の名前"
    }
</script>

<style lang="scss">
@import '../assets/select.scss';
@import '../assets/inputbox.scss';

.inputboxes {
    text-align: center;
    margin: 50px auto 50px;
}
.selectbox {
    width: 160px;
    margin: 0 auto;
    display: block;
}
.selectwrap {
    display: flex;
    width: 75%;
    margin: 0 auto;
    @media (min-width: 640px) {
        width: 480px;
    }
}
</style>