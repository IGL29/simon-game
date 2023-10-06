<template>
  <div>
    <audio ref="soundRed" :src="audioSrc.soundRed" preload="auto"></audio>

    <audio ref="soundGreen" :src="audioSrc.soundGreen" preload="auto"></audio>

    <audio ref="soundYellow" :src="audioSrc.soundYellow" preload="auto"></audio>

    <audio ref="soundBlue" :src="audioSrc.soundBlue" preload="auto"></audio>

    <SimonGame :sounds="soundsElements" />
    <ButtonMuteSound v-model:isMuteSound="isMuteSound" />
  </div>
</template>

<script>
import SimonGame from '@/components/SimonGame.vue';
import ButtonMuteSound from '@/components/ButtonMuteSound.vue';

import soundRed from '@public/audio/simonSound1.mp3';
import soundGreen from '@public/audio/simonSound2.mp3';
import soundYellow from '@public/audio/simonSound3.mp3';
import soundBlue from '@public/audio/simonSound4.mp3';

const audioSrc = Object.freeze({ soundRed, soundGreen, soundYellow, soundBlue });

export default {
  data() {
    return {
      isMuteSound: false,
      soundsElements: {},
      audioSrc,
    };
  },

  mounted() {
    this.soundsElements = { ...this.$refs };
  },

  watch: {
    isMuteSound() {
      Object.values(this.$refs).forEach((value) => {
        const sound = value;
        sound.muted = this.isMuteSound;
      });
    },
  },

  components: { SimonGame, ButtonMuteSound },
};
</script>
