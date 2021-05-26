//キャラクターごとのデータ
const characters = [
  { //エース
    image: 'img/character/img_001.png',
    spText: 'img/spText/text_01.png',
    spImage: 'img/spImg/img_01.jpg',
    spIcon: 'img/spIcon/icon_01.png',
    probability: 8,
    medal: 3,
  },
  { //レオナ
    image: 'img/character/img_002.png',
    spText: 'img/spText/text_02.png',
    spImage: 'img/spImg/img_02.jpg',
    spIcon: 'img/spIcon/icon_02.png',
    probability: 7,
    medal: 5,
  },
  { //カリム
    image: 'img/character/img_003.png',
    spText: 'img/spText/text_03.png',
    spImage: 'img/spImg/img_03.png',
    spIcon: 'img/spIcon/icon_03.png',
    probability: 6,
    medal: 8,
  },
  { //ジェイド
    image: 'img/character/img_004.png',
    spText: 'img/spText/text_04.png',
    spImage: 'img/spImg/img_04.jpg',
    spIcon: 'img/spIcon/icon_04.png',
    probability: 5,
    medal: 10,
  },
  { //フロイド
    image: 'img/character/img_005.png',
    spText: 'img/spText/text_05.png',
    spImage: 'img/spImg/img_05.jpg',
    spIcon: 'img/spIcon/icon_04.png',
    probability: 4,
    medal: 13,
  },
  { //リドル
    image: 'img/character/img_006.png',
    spText: 'img/spText/text_06.png',
    spImage: 'img/spImg/img_06.jpg',
    spIcon: 'img/spIcon/icon_01.png',
    probability: 3,
    medal: 18,
  },
  { //エペル
    image: 'img/character/img_007.png',
    spText: 'img/spText/text_07.png',
    spImage: 'img/spImg/img_07.png',
    spIcon: 'img/spIcon/icon_05.png',
    probability: 2,
    medal: 20,
  },
  { //マレウス
    image: 'img/character/img_008.png',
    spText: 'img/spText/text_08.png',
    spImage: 'img/spImg/img_08.png',
    spIcon: 'img/spIcon/icon_06.png',
    probability: 1,
    medal: 25,
  },
];

let currentImage; //表示された画像
let leftMedal;    //残りのメダル枚数

//スロット部分
var slotComponent = Vue.extend({
  data: function () {
    return {
      image: this.getRandomImage(),
      timeOutId: undefined,
      isSelected: true
    }
  },
  template: '<section class="panel"><img v-bind:src="image"></img><div class="stop" :class={inactive:isSelected} @click="stop">STOP</div></section>',
  methods: {
    getRandomImage: function () {

      //確率操作 修正済み
      const randomImage = [];

      for (let n = 0; n < characters.length; n++) {
        let X = characters[n].probability;
        for (let i = 0; i < X; i++) {
          randomImage.push(characters[n].image);
        }
      }

      return randomImage[Math.floor(Math.random() * randomImage.length)];
    },

    spin: function () {
      this.timeOutId = setTimeout(() => {
        this.image = this.getRandomImage();
        currentImage = this.image; // specialComponentで使えるようにグローバル変数に入れる
        this.spin();
      }, 750)

    },

    stop: function () {
      if (this.isSelected) {
        return;
      }
      this.isSelected = true;
      clearTimeout(this.timeOutId);
      this.$emit('count');
    },

    activate: function () {
      this.isSelected = false;
    }
  },
});

//スペシャル画像
var specialComponent = Vue.extend({
  data: function () {
    return {
      specialText: '',
      specialImg: '',
      specialIcon: '',
    }
  },
  template: '<div class="special"><img class="spText" v-bind:src="specialText"><img class="spImg" v-bind:src="specialImg"><img class="spIcon" v-bind:src="specialIcon"></div>',

  methods: {
    //修正済み
    displaySpecial: function () {
      for (let i = 0; i < characters.length; i++) {
        if (currentImage === characters[i].image) {
          this.specialText = characters[i].spText;
          this.specialImg = characters[i].spImage;
          this.specialIcon = characters[i].spIcon;
        }
      }
    },

    hideSpecial: function () {
      this.specialText = undefined;
      this.specialImg = undefined;
      this.specialIcon = undefined;
    }
  }
});

//メダル機能
var medalComponent = Vue.extend({
  data: function () {
    return {
      medal: 30, //初期値
      betMedal: 1,
      usedMedal: false
    }
  },
  template: ' <div class="foo2"><div class="medal"><i class="fas fa-coins"></i>メダル<span>{{ medal }}</span>枚</div><div class="bet"><i class="fas fa-minus-square" @click="decreaseBetMedal"></i>BET {{ betMedal }} 枚<i class="fas fa-plus-square" @click="addBetMedal"></i></div></div>',

  methods: {
    addBetMedal: function () {
      if (this.betMedal >= this.medal || this.usedMedal === true) {
        return;
      }
      this.betMedal++;
    },
    decreaseBetMedal: function () {
      if (this.betMedal === 1 || this.usedMedal === true) {
        return;
      }

      this.betMedal--;
    },
    //メダルを使う
    useMedal: function () {
      if (this.medal === 0) {
        return;
      }
      this.medal -= this.betMedal;
      leftMedal = this.medal;
      this.usedMedal = true;
    },

    //揃ったときにメダルが増える
    //修正済み
    addMedal: function () {
      for (let i = 0; i < characters.length; i++) {
        if (currentImage === characters[i].image) {
          this.medal += characters[i].medal * this.betMedal;
        }
      }
    },
    initialMedal: function () {
      this.betMedal = 1;
      this.usedMedal = false;
    },
    //panelsLeftが0になったら実行され、usedMedal, betMedal をリセット
    resetBet: function () {
      this.initialMedal();
    }
  }
});




new Vue({
  el: '#app',
  components: {
    'slot-component': slotComponent,
    'special-component': specialComponent,
    'medal-component': medalComponent,
  },
  data: {
    isActive: false,
    panelsLeft: 3,
    dialog: false,
  },
  methods: {
    spin: function () {
      if (this.isActive || leftMedal === 0) {
        return;
      }
      this.isActive = true;
      //spin activateまとめる
      //修正済み

      const componentNum = 3;

      for(let i =1; i <= componentNum; i++){
        const componentName = `component${i}`;
        this.$refs[componentName].spin();
        this.$refs[componentName].activate();
      }

      this.$refs.component4.hideSpecial();
      this.$refs.component5.useMedal();
    },
    //初期値に戻す
    initial() {
      this.isActive = false;
      this.panelsLeft = 3;
    },
    //panelを減らす
    reducePanel: function () {
      this.panelsLeft--;
    },
    countPanel: function () {
      this.reducePanel();
      if (this.panelsLeft === 0) {
        this.initial(),
          this.checkResult();
        this.$refs.component5.resetBet(); //bet出来るようにする
      }
    },
    checkResult: function () {
      if (this.$refs.component1.image === this.$refs.component2.image
        && this.$refs.component1.image === this.$refs.component3.image) {
        this.isMathed();
      }
    },

    //画像が揃うと実行される
    isMathed() {
      //specialComponent 内のメソッドを呼び出す
      this.$refs.component4.displaySpecial();
      //medalComponent内のメソッドを使ってメダルを増やす
      this.$refs.component5.addMedal();
    },
  }
});

