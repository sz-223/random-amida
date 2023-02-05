<template>
    <div v-if="OptionStore.complete">
        <div style="text-align: center">
            <div v-if="whosturn < OptionStore.nPeople">
                <div style="font-size:30px" :key="whosturn">
                    {{ OptionStore.member[GameStore.permTurn[whosturn]] }} の番です。あと {{ nturn }} 回操作できます
                    <button @click="endTurn">操作を終える</button>
                </div>
            </div>
            <div v-else-if="!flagAnimationDone">
                <button @click="startAnimation">抽選をはじめる！</button>
            </div>
            <div v-else>
                <div :key="flagAnimationDone" class="btn-result">
                    <router-link to="/result" style="font-size:30px">結果表示</router-link>
                </div>
            </div>
        </div>
        <div style="text-align: right; font-size: 12px;">
            <p>salt: {{ GameStore.salt }}</p>
            <p>sha256: {{ GameStore.hash }}</p>
        </div>
        <canvas width="900" height="600" ref="canvas" @mouseover="onMouseOver" @mouseout="onMouseOut" @mousemove="onMouseMove" @click="onClick"></canvas>
    </div>
    <div v-else style="text-align: center">
        <p style="font-size: 18px">入力情報に誤りがあります</p>
        <div>
            <router-link to="/settings">設定をやり直す</router-link>
        </div>
    </div>
</template>
<script setup>
    import { useOptionStore } from '../stores/options'
    import { useGameStore } from '../stores/game'
    import { ref, onMounted, getCurrentInstance } from 'vue'
    import distinctColors from 'distinct-colors'
    const OptionStore = useOptionStore();
    const GameStore = useGameStore();
    const instance = getCurrentInstance();
    if(OptionStore.complete){
        GameStore.init(OptionStore.nPeople);
        GameStore.makeHash(OptionStore.member, OptionStore.nWin);
    }

    const canvas = ref();
    var xpos = []; let xwidth;
    const drawinit = () => {
        const widmargin = 100;
        const widspace = canvas.value.width - 2 * widmargin;
        for(let i = 0; i < OptionStore.nPeople; i++){
            xpos.push(widspace * i / (OptionStore.nPeople - 1) + widmargin);
        }
        xwidth = widspace / (OptionStore.nPeople - 1) - 10;
    };
    var nturn = OptionStore.turnpercap;
    var whosturn = ref(0);
    var lineno = 0;

    var flagMousemove = false;
    var flagMouseHover = false;
    var moveActions;
    var startPoint = -1;
    var mouseX = 0;
    var mouseY = 0;

    var flagAnimationDone = false;
    var flagAnimationBegin = false;
    var drawAnimation;
    let AnimeInterid;
    const animeSpeed = 1.5;
    var curY = 80; var curHor = 0; const vertMove = 20; var curVert = 0; const VerCut = 10
    const discolor = distinctColors({count: OptionStore.nPeople, lightMin: 70})
    const discolor_first = [...discolor];

    const drawCanvas = () => {
        if (canvas.value === undefined) return;
        drawinit();
        const context = canvas.value.getContext('2d');
        if (context === null) return;
        context.lineWidth = 1.5;

        context.setTransform(1 , 0 , 0 , 1 , 0 , 0);

        // background
        context.fillStyle = '#FCEBC5';
        context.fillRect(0, 0, canvas.value.width, canvas.value.height);

        for(let i = 0; i < OptionStore.nPeople; i++){
           // base line
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo( xpos[i] , 100.0 );
            context.lineTo( xpos[i] , 500.0 );
            context.stroke();
        }


        // line

        const linesTop = 140;
        const linesBottom = 480;
        const widlines = (linesBottom - linesTop) / (OptionStore.turnpercap * OptionStore.nPeople);

        context.strokeStyle = "#44CC44";
        for(let i = 0; i < GameStore.lines.length; i++){
            context.beginPath();
            context.moveTo( xpos[GameStore.lines[i][0]] , linesTop + i * widlines );
            context.lineTo( xpos[GameStore.lines[i][1]] , linesTop + i * widlines );
            context.stroke();
        }

        const radius = 2.5;
        const arccol = "#226622";
        context.strokeStyle = arccol;
        for(let i = 0; i < GameStore.lines.length; i++){
            context.beginPath();
            context.arc(xpos[GameStore.lines[i][0]], linesTop + i * widlines, radius, 0, 2 * Math.PI, false);
            context.fillStyle = arccol;
            context.fill()
            context.stroke();
            context.beginPath();
            context.arc(xpos[GameStore.lines[i][1]], linesTop + i * widlines, radius, 0, 2 * Math.PI, false);
            context.fillStyle = arccol;
            context.fill()
            context.stroke();
        }


        // new line

        const heightInput = linesTop + lineno * widlines;
        const inarccol = '#5555FF'
        const inradius = 4;


        moveActions = {
            timer: null,
            updateTargetFlag: function(e) {
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                mouseX = x; mouseY = y;
                const halfsize = 40;

                targetFlag = (function (){
                    for(let i = 0; i < OptionStore.nPeople; i++){
                        const w = xpos[i];
                        const h = heightInput;
                        var a = (x > w - halfsize);
                        var b = (x < w + halfsize);
                        var c = (y > h - halfsize);
                        var d = (y < h + halfsize);
                        if(a && b && c && d) return i;
                    }
                    return -1;
                }());
            },
            throttle: function(targetFunc, time) {
                var _time = time || 100;
                clearTimeout(this.timer);
                this.timer = setTimeout(function () {
                    targetFunc();
                }, _time);
            },
            out: function() {
                outPoint();
            },
            over: function() {
                overPoint();
            }
        };

        function outPoint() {
            flagMouseHover = false;
        }
        function overPoint() {
            flagMouseHover = true;
        }


        if(nturn > 0 && whosturn.value < OptionStore.nPeople){
            for(let i = 0; i < OptionStore.nPeople; i++){
                context.strokeStyle = inarccol;
                context.beginPath();
                context.arc(xpos[i], heightInput, inradius, 0, 2 * Math.PI, false);
                context.fillStyle = inarccol;
                context.fill()
                context.stroke();
            }

            if(flagMouseHover && targetFlag != startPoint){
                context.strokeStyle = inarccol;
                context.beginPath();
                context.arc(xpos[targetFlag], heightInput, inradius * 2, 0, 2 * Math.PI, false);
                context.fillStyle = inarccol;
                context.fill()
                context.stroke();
            }

            if(startPoint != -1){
                context.strokeStyle = arccol;
                context.beginPath();
                context.arc(xpos[startPoint], heightInput, inradius * 1.3, 0, 2 * Math.PI, false);
                context.fillStyle = arccol;
                context.fill()
                context.stroke();
                context.strokeStyle = "#44CC44";
                context.beginPath();
                context.moveTo(xpos[startPoint], heightInput);
                context.lineTo(mouseX, mouseY);
                context.stroke();
            }
        }


        // Animation

        if(flagAnimationBegin){
            const curHorLayer = Math.trunc(curHor / VerCut);

            const xmove = (xpos[GameStore.lines[curHorLayer][1]] - xpos[GameStore.lines[curHorLayer][0]]) * curVert / vertMove;
            for(let i = 0; i < OptionStore.nPeople; i++){
                context.strokeStyle = discolor[i];
                context.beginPath();
                if(i == GameStore.lines[curHorLayer][0]){
                    context.arc(xpos[i] + xmove, curY, 12, 0, 2 * Math.PI, false);
                } else if(i == GameStore.lines[curHorLayer][1]){
                    context.arc(xpos[i] - xmove, curY, 12, 0, 2 * Math.PI, false);
                } else {
                    context.arc(xpos[i], curY, 12, 0, 2 * Math.PI, false);
                }
                context.stroke();
                context.fillStyle = discolor[i];
                context.fill();
            }
        }

        drawAnimation = () => {
            if(curY < linesTop){
                curY += animeSpeed;
                if(curY > linesTop) curY = linesTop;
            }else if(curY > linesTop + (GameStore.lines.length - 0.5) * widlines){
                curY += animeSpeed;
                if(curY > linesBottom + 40) {
                    clearInterval(AnimeInterid);
                    flagAnimationDone = true;
                    instance?.proxy?.$forceUpdate();
                }
            }else{
                if(curHor % VerCut != 0){
                    curY += widlines / VerCut;
                    curHor += 1;
                }else if(curVert != vertMove){
                    curVert++;
                }else {
                    const curHorSheet = Math.floor(curHor / VerCut);
                    curVert = 0;
                    [discolor[GameStore.lines[curHorSheet][0]], discolor[GameStore.lines[curHorSheet][1]]] = [discolor[GameStore.lines[curHorSheet][1]], discolor[GameStore.lines[curHorSheet][0]]];
                    curY += widlines / VerCut;
                    curHor += 1;
                }
            }
        }


        // name and result box

        for(let i = 0; i < OptionStore.nPeople; i++){
            // name frame
            context.fillStyle = discolor_first[i];
            context.fillRect(xpos[i] - (xwidth / 2), 50, xwidth, 50);

            // name 
            if(flagAnimationBegin){
                context.fillStyle = '#000000';
                context.textAlign = 'center';
                context.font = '30px serif';
                context.fillText(OptionStore.member[GameStore.permMember[i]], xpos[i], 90, xwidth - 10);
            }

            // result frame
            context.fillStyle = '#FFFFFF';
            context.fillRect(xpos[i] - (xwidth / 2), 500, xwidth, 50);

            // result
            if(flagAnimationBegin){
                context.fillStyle = '#000000';
                context.textAlign = 'center';
                context.font = '30px serif';
                context.fillText(GameStore.win(i, OptionStore.nWin), xpos[i], 540, xwidth - 10);
            }
        }

        requestAnimationFrame(drawCanvas);
    };


    var rect = null;
    var targetFlag = -1; 

    const onMouseOver = (e) => {
        rect = e.target.getBoundingClientRect();
        flagMousemove = true;
    }

    const onMouseOut = () => {
        flagMousemove = false;
    }
    const onMouseMove = (e) => {
        if(!flagMousemove) return;
        moveActions.updateTargetFlag(e);

        if (targetFlag != -1) {
            moveActions.throttle(moveActions.over, 50);
        } else {
            moveActions.throttle(moveActions.out, 50);
        }
    }
    const onClick = () => {
        if(targetFlag == -1 || nturn == 0) return;
        if(startPoint == -1) {
            startPoint = targetFlag;
            return;
        }else{
            if(startPoint == targetFlag) return;
            if(startPoint < targetFlag) GameStore.lines.push([startPoint, targetFlag]);
            else GameStore.lines.push([targetFlag, startPoint]);
            startPoint = -1;
            nturn--;
            lineno++;
            instance?.proxy?.$forceUpdate();
        }
    }

    const endTurn = () => {
        whosturn.value++;
        nturn = OptionStore.turnpercap;
    }

    const startAnimation = () => {
        AnimeInterid = setInterval(drawAnimation, 50)
        flagAnimationBegin = true;
        GameStore.makeWinner(OptionStore.nWin);
    }

    onMounted(() => {
        drawCanvas();
    });
</script>
