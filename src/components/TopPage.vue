<template>
    <div>
        <h1>ランダムあみだくじ</h1>
        <div class="btn-start">
            <router-link to="/settings" href="" class="btn btn-malformation btn-malformation--pastel">はじめる</router-link>
        </div>
        <div style="text-align: center; margin: 40px 0">
            <router-link to="/about" style="font-size:14px">about</router-link>
        </div>
    </div>
</template>

<style>

@import '../assets/custom-button.css';

h1 {
    width: 100%;
    font-size: 50px;
    text-align: center;
    margin-top: 2rem;
}

.btn-start {
    text-align: center;
    padding-top: 100px;
}

</style>