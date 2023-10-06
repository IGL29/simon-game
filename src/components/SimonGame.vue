<template>
  <div class="wrapper">
    <div class="wrapper__inner-wrapper inner-wrapper">
      <div class="container">
        <GameButtons
          :isLightRed="isLightRed"
          :isLightBlue="isLightBlue"
          :isLightGreen="isLightGreen"
          :isLightYellow="isLightYellow"
          :redLight="buttonsId.redLight"
          :greenLight="buttonsId.greenLight"
          :yellowLight="buttonsId.yellowLight"
          :blueLight="buttonsId.blueLight"
          @press-button="addPressButton($event)"
        />

        <div class="panel">
          <h1 class="title">Simon</h1>

          <div class="wrapper-range">
            <div class="wrapper-range__container-range container-range">
              <div class="container-range__range-track"></div>
              <label class="container-range__label" for="rangeFrom">Speed</label>

              <input
                class="container-range__range range range--1"
                type="range"
                id="rangeFrom"
                min="1"
                max="3"
                v-model.number="difficultyLevel"
              />
            </div>
          </div>

          <div class="container-start">
            <span class="container-start__span span">Start</span>
            <button
              class="container-start__button button"
              :class="{ 'start-active': isPowerOn }"
              @click="startGame()"
            ></button>
          </div>

          <p class="logo" :class="{ 'logo--active': isPowerOn }">VL</p>

          <div class="display">{{ displayedInformation }}</div>

          <div class="container-power">
            <span class="container-power__span span">Power</span>

            <button
              class="container-power__button button"
              :class="{ 'power-active': isPowerOn }"
              @click="switchPower()"
            ></button>
          </div>
        </div>
      </div>
    </div>

    <div class="container-start container-start--mobile">
      <span class="container-start__span span">Start</span>
      <button
        class="container-start__button button"
        :class="{ 'start-active': isPowerOn }"
        @click="startGame()"
      ></button>
    </div>

    <div class="container-range container-range--mobile">
      <input
        class="container-range__input input"
        type="range"
        id="level"
        min="1"
        max="3"
        v-model.number="difficultyLevel"
      />
      <label class="container-input label" for="volume">Skill level</label>
    </div>

    <div class="container-power container-power--mobile">
      <span class="container-power__span span">Power</span>

      <button
        class="container-power__button button"
        :class="{ 'power-active': isPowerOn }"
        @click="switchPower()"
      ></button>
    </div>
  </div>
</template>

<script>
import GameButtons from '@/components/GameButtons.vue';

const BUTTONS_ID = Object.freeze({
  redLight: 1,
  greenLight: 2,
  yellowLight: 3,
  blueLight: 4,
});

export default {
  name: 'SimonGame',
  components: { GameButtons },
  props: ['sounds'],
  data() {
    return {
      roundSeries: [],
      playerSeries: [],
      isPowerOn: false,
      isRunningGame: false,
      isUserСlickAllowed: false,
      isLightRed: false,
      isLightBlue: false,
      isLightGreen: false,
      isLightYellow: false,
      buttonsId: BUTTONS_ID,
      isWin: false,
      isShowError: false,
      maxRound: 3,
      currentRound: 0,
      difficultyLevel: 2,
      timeBetweenSeries: 1000,
      timersId: [],
    };
  },

  computed: {
    displayedInformation() {
      let result = null;
      if (this.isShowError) {
        result = 'X';
      } else if (this.isWin) {
        result = 'WIN';
      } else if (this.currentRound) {
        result = this.currentRound;
      } else if (this.isPowerOn) {
        result = ' - - ';
      } else {
        result = '';
      }
      return result;
    },

    timeDurationLight() {
      return this.timeBetweenButtons - this.timeBetweenButtons / 4;
    },

    timeBetweenButtons() {
      let time = null;
      switch (this.difficultyLevel) {
        case 1:
          time = 900;
          break;
        case 2:
          time = 500;
          break;
        case 3:
          time = 400;
          break;
        default:
          break;
      }
      return time;
    },

    buttonExpectedFromUser() {
      return this.roundSeries[this.playerSeries.length - 1];
    },

    lastButtonPressedUser() {
      return this.playerSeries[this.playerSeries.length - 1];
    },
  },

  methods: {
    async startGame() {
      if (this.isPowerOn) {
        this.isRunningGame = true;
        this.resetData();
        this.newRound();
      }
    },

    async newRound() {
      this.isUserСlickAllowed = false;
      if (this.maxRound !== this.currentRound) {
        this.currentRound += 1;
        this.playerSeries = [];
        this.addTone();
        setTimeout(this.playSeries, this.timeBetweenSeries);
      } else {
        this.isWin = true;
        await this.soundWinNotification();
        this.resetData();
      }
    },

    soundWinNotification() {
      return new Promise((resolve) => {
        setTimeout(
          () =>
            this.playVictoryMelody({
              sound: this.lastButtonPressedUser,
              numberSounds: 11,
              resolve,
            }),
          1000,
        );
      });
    },

    async playVictoryMelody({ sound, numberSounds, resolve }) {
      await this.playSound({ sound, delay: 200, speedSound: 1.5 });
      if (numberSounds > 1) {
        this.playVictoryMelody({ sound: sound <= 0 ? 4 : sound - 1, numberSounds: numberSounds - 1, resolve });
      }
      return resolve();
    },

    switchPower() {
      this.isPowerOn = !this.isPowerOn;
      if (!this.isPowerOn) {
        this.hardReset();
      }
    },

    addTone() {
      this.roundSeries.push(this.getRandomNumber());
    },

    getRandomNumber() {
      return Math.floor(Math.random() * (5 - 1)) + 1;
    },

    addPressButton(button) {
      if (!this.isUserСlickAllowed) {
        return;
      }
      this.playerSeries.push(button);
      this.playSound({ sound: button });
    },

    notifyAboutError() {
      return new Promise((resolve) => {
        this.showError = true;
        this.playSound({ sound: this.buttonExpectedFromUser });
        setTimeout(() => resolve(), this.timeDurationLight);
      });
    },

    playSeries() {
      this.timersId = [];
      let delay = 0;
      this.roundSeries.forEach((item) => {
        delay += this.timeBetweenButtons;
        const id = setTimeout(() => {
          this.playSound({ sound: item });
        }, delay);
        this.timersId.push(id);
      });
      const totalWaitingTime = delay + this.timeDurationLight;
      const id = setTimeout(() => {
        this.isUserСlickAllowed = true;
      }, totalWaitingTime);
      this.timersId.push(id);
    },

    resetData() {
      this.roundSeries = [];
      this.playerSeries = [];
      this.currentRound = 0;
      this.isWin = false;
      this.isUserСlickAllowed = false;
    },

    playSound({ sound, delay = this.timeDurationLight, speedSound = 1 }) {
      switch (sound) {
        case 1:
          this.isLightRed = true;
          this.sounds.soundRed.pause();
          this.sounds.soundRed.currentTime = 0;
          this.sounds.soundRed.playbackRate = speedSound;
          this.sounds.soundRed.play();
          break;
        case 2:
          this.isLightGreen = true;
          this.sounds.soundGreen.pause();
          this.sounds.soundGreen.currentTime = 0;
          this.sounds.soundGreen.playbackRate = speedSound;
          this.sounds.soundGreen.play();
          break;
        case 3:
          this.isLightYellow = true;
          this.sounds.soundYellow.pause();
          this.sounds.soundYellow.currentTime = 0;
          this.sounds.soundYellow.playbackRate = speedSound;
          this.sounds.soundYellow.play();
          break;
        case 4:
          this.isLightBlue = true;
          this.sounds.soundBlue.pause();
          this.sounds.soundBlue.currentTime = 0;
          this.sounds.soundBlue.playbackRate = speedSound;
          this.sounds.soundBlue.play();
          break;
        default:
          break;
      }

      return new Promise((resolve) => {
        const id = setTimeout(() => {
          this.resetLight(sound);
          resolve();
        }, delay);
        this.timersId.push(id);
      });
    },

    hardReset() {
      this.timersId.forEach((timerId) => {
        clearTimeout(timerId);
      });
      this.isRunningGame = false;
      this.stopSounds();
      this.resetLight();
      this.resetData();
    },

    stopSounds() {
      this.sounds.soundYellow.pause();
      this.sounds.soundGreen.pause();
      this.sounds.soundBlue.pause();
      this.sounds.soundRed.pause();
      this.sounds.soundYellow.currentTime = 0;
      this.sounds.soundGreen.currentTime = 0;
      this.sounds.soundBlue.currentTime = 0;
      this.sounds.soundRed.currentTime = 0;
    },

    resetLight(sound) {
      switch (sound) {
        case 1:
          this.isLightRed = false;
          break;
        case 2:
          this.isLightGreen = false;
          break;
        case 3:
          this.isLightYellow = false;
          break;
        case 4:
          this.isLightBlue = false;
          break;
        default:
          this.isLightRed = false;
          this.isLightGreen = false;
          this.isLightYellow = false;
          this.isLightBlue = false;
          break;
      }
    },

    async checkButtonPressedCorrectly() {
      if (this.currentRound === 0) return;

      if (this.lastButtonPressedUser === this.buttonExpectedFromUser) {
        if (this.playerSeries.length === this.roundSeries.length) {
          this.newRound();
        }
      } else {
        await this.notifyAboutError();
        this.showError = false;
        this.startGame();
      }
    },
  },

  watch: {
    playerSeries: {
      handler() {
        this.checkButtonPressedCorrectly();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  max-width: pxToRem(800px);
  width: 100%;
  padding: pxToRem(60px);
  transform: translate(-50%, -50%);
}

.inner-wrapper {
  position: relative;
  padding-bottom: 100%;
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 82%;
  height: 82%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
  transform: translate(-50%, -50%);
}

.container:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  height: 120%;
  width: 120%;
  background: radial-gradient(circle, #3c3c3c, #282928, #262726);
  border-radius: 50%;
  box-shadow: pxToRem(15px) pxToRem(-15px) pxToRem(45px) pxToRem(18px) #000000 inset,
    pxToRem(0px) pxToRem(0px) pxToRem(5px) pxToRem(3px) #000000;
  transform: translate(-50%, -50%);
}

.logo {
  font-family: serif, sans-serif;
  color: #2c3e50;
  text-shadow: 0 0 1rem #ffac2b;
  font-weight: 600;
  font-size: pxToRem(15px);
  transition: color 0.3s;

  &--active {
    color: #ffac2b;
  }

  @media (max-width: 576px) {
    font-size: pxToRem(10px);
  }
}

.panel {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 5;
  width: 50%;
  height: 50%;
  background: linear-gradient(45deg, #c2c1c3, #979698, #c2c1c3, #979698, #c2c1c3);
  border: pxToRem(23px) solid rgb(45, 45, 45);
  border-radius: 50%;
  box-shadow: pxToRem(0px) pxToRem(0px) pxToRem(5px) pxToRem(3px) #2d2d2d,
    pxToRem(0px) pxToRem(0px) pxToRem(6px) pxToRem(5px) #656565 inset;
  transform: translate(-50%, -50%);
}

.display {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 5;
  width: 40%;
  height: 17%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: pxToRem(5px);
  font-size: pxToRem(32px);
  text-align: center;
  box-shadow: pxToRem(0px) pxToRem(0px) pxToRem(6px) pxToRem(4px) #210304 inset,
    pxToRem(0px) pxToRem(0px) pxToRem(2px) pxToRem(4px) #150202;
  color: #55e0ff;
  background-color: white;
  background: linear-gradient(45deg, #320003, #5a2428, #47181b, #320003);
  transform: translate(-50%, -50%);
  user-select: none;
}

.button {
  width: 60%;
  height: 60%;
  border-radius: 50%;
  border: none;
  transition: background 0.3s, background-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.container-power__button {
  background: radial-gradient(circle, #b10000, #9f0000);
  box-shadow: pxToRem(-1px) pxToRem(1px) pxToRem(4px) pxToRem(3px) #584747,
    pxToRem(0px) pxToRem(0px) pxToRem(3px) pxToRem(4px) #841313 inset;
}

.container-start__button {
  background: radial-gradient(circle, #005605, #044908);
  box-shadow: pxToRem(-1px) pxToRem(1px) pxToRem(4px) pxToRem(3px) #584747,
    pxToRem(0px) pxToRem(0px) pxToRem(3px) pxToRem(4px) #094a1a inset;
}

.power-active {
  background: radial-gradient(circle, #f11515, #bb0000);
  box-shadow: pxToRem(-1px) pxToRem(1px) pxToRem(4px) pxToRem(3px) #584747,
    pxToRem(0px) pxToRem(0px) pxToRem(3px) pxToRem(4px) #9c1414 inset;
}

.start-active {
  background: radial-gradient(circle, #039e0c, #036f09);
  box-shadow: pxToRem(-1px) pxToRem(1px) pxToRem(4px) pxToRem(3px) #584747,
    pxToRem(0px) pxToRem(0px) pxToRem(3px) pxToRem(4px) #0b6122 inset;
}

.container-power {
  position: absolute;
  bottom: 22%;
  left: 9%;
  display: block;
  width: 20%;
  height: 20%;
  text-align: center;
}

.container-start {
  position: absolute;
  right: 9%;
  bottom: 22%;
  width: 20%;
  height: 20%;
  text-align: center;
}

.container-range {
  position: absolute;
  top: 77%;
  left: 50%;
  width: 39%;
  text-align: center;
  transform: translateX(-50%);
}

.input {
  width: 100%;
}

.span,
.label {
  display: block;
  margin-bottom: pxToRem(4px);
  font-size: pxToRem(13px);
}

.title {
  position: absolute;
  top: 10%;
  left: 50%;
  margin: 0;
  font-size: pxToRem(50px);
  transform: translateX(-50%);
}

.container-power--mobile,
.container-start--mobile,
.container-range--mobile {
  display: none;
  visibility: hidden;
  bottom: 0;
}

.container-power--mobile,
.container-start--mobile {
  width: pxToRem(75px);
  height: pxToRem(75px);
}

.container-range--mobile {
  top: initial;
}

.btn-mute-sounds {
  position: absolute;
  top: pxToRem(15px);
  right: pxToRem(15px);
  width: pxToRem(60px);
  height: pxToRem(60px);
  background-image: url('/public/images/mute.svg');
  background-color: transparent;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
}

.btn-mute-sounds::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  display: block;
  width: 97%;
  border-bottom: pxToRem(5px) solid #ca2626;
  transform: rotateZ(45deg);
  opacity: 0;
  transition: opacity 0.1s;
}

.mute::after {
  opacity: 1;
}

input[type='range'] {
  width: 100%;
  height: 0.5rem;

  &::-moz-range-thumb {
    width: 0.7rem;
    height: 0.7rem;
    margin-top: -0.1rem;
    line-height: 0;
    background-color: #b8b8b8;
    border: pxToRem(1px) solid #000000;
    border-radius: 50%;
    cursor: pointer;
    appearance: none;
    pointer-events: auto;
  }

  &::-webkit-slider-thumb {
    width: 0.7rem;
    height: 0.7rem;
    margin-top: -0.1rem;
    line-height: 0;
    background-color: #b8b8b8;
    border: pxToRem(1px) solid #000000;
    border-radius: 50%;
    cursor: pointer;
    -webkit-appearance: none;
    pointer-events: auto;
  }

  &::-ms-thumb {
    width: 0.7rem;
    height: 0.7rem;
    margin-top: -0.1rem;
    line-height: 0;
    background-color: #b8b8b8;
    border: pxToRem(1px) solid #000000;
    border-radius: 50%;
    cursor: pointer;
    appearance: none;
    pointer-events: auto;
  }
}

input[type='range']::-ms-track {
  width: 100%;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}

.wrapper-range {
  position: absolute;
  top: 77%;
  left: 50%;
  width: 39%;
  text-align: center;
  transform: translateX(-50%);

  &__container-range {
    position: relative;
    height: 10px;
    width: 100%;
    margin-bottom: 10px;
  }
}

.container-range {
  &__range {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: transparent;
    appearance: none;
    pointer-events: none;
    background-color: #252525;
    border-radius: pxToRem(4px);

    &::-webkit-slider-runnable-track {
      height: 8px;
      appearance: none;
    }

    &::-moz-range-track {
      height: 8px;
      appearance: none;
    }

    &::-ms-range-track {
      height: 8px;
      appearance: none;
    }
  }

  &__label {
    position: absolute;
    display: block;
    top: pxToRem(12px);
    left: 50%;
    width: 100%;
    font-size: pxToRem(13px);
    transform: translateX(-50%);
  }

  &__range-track {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: pxToRem(8px);
    margin: auto 0;
    background-color: #282928;
    border-radius: pxToRem(3px);
  }
}

.range {
  &:focus {
    outline: none;

    &::-webkit-slider-thumb {
      outline: 2px solid #00d885;
      outline-offset: 2px;
    }

    &::-ms-range-thumb {
      outline: 2px solid #00d885;
      outline-offset: 2px;
    }
  }
}

@media (max-width: 768px) {
  .display {
    width: 50%;
    height: 23%;
  }

  .container-power,
  .container-range,
  .container-start {
    display: none;
  }

  .title {
    font-size: 5vw;
  }

  .container-power--mobile,
  .container-start--mobile,
  .container-range--mobile {
    display: inline-block;
    font-size: pxToRem(20px);
    color: #fff;
    visibility: visible;
  }
}

@media (max-width: 576px) {
  .wrapper {
    padding: 0;
  }

  .container-power--mobile,
  .container-start--mobile,
  .container-range--mobile {
    bottom: pxToRem(-55px);
  }

  .panel {
    border-width: pxToRem(13px);
  }

  .title {
    font-size: 6vw;
  }

  .display {
    font-size: 6vw;
  }

  .container-power--mobile {
    left: 5%;
  }

  .container-start--mobile {
    right: 5%;
  }
}
</style>
