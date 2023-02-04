<template>
    <form @submit="checkForm($event)">
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
        <p v-if="OptionStore.errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in OptionStore.errors" :key="error">{{ error }}</li>
            </ul>
        </p>
        <div style="text-align:center; width=100% ">
            <input type="submit" value="Submit">
        </div>
    </form>
</template>

<script setup>
    import { useOptionStore } from '../stores/options'
    import { useRouter } from 'vue-router'
    const OptionStore = useOptionStore();
    const router = useRouter();
    function forPlaceHolder(i){
        return i + "人目の名前"
    }
    function checkForm(e){
        OptionStore.errors = [];
        if(!OptionStore.nPeople || !OptionStore.nWin || OptionStore.nPeople < OptionStore.nWin){
            OptionStore.errors.push("人数の指定に誤りがあります");
        }
        if(OptionStore.nMember < OptionStore.nPeople){
            OptionStore.errors.push("名前に空欄か重複している箇所があります");
        }
        if(OptionStore.errors.length === 0){
            OptionStore.complete = true;
            router.push('/game');
            return true;
        }
        e.preventDefault();
        return false;
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