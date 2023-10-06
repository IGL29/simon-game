<template>
  <div class="btn red" :class="{ 'red-active': isLightRed }" @click="pressButton(redLight)"></div>

  <div class="btn green" :class="{ 'green-active': isLightGreen }" @click="pressButton(greenLight)"></div>

  <div class="btn yellow" :class="{ 'yellow-active': isLightYellow }" @click="pressButton(yellowLight)"></div>

  <div class="btn blue" :class="{ 'blue-active': isLightBlue }" @click="pressButton(blueLight)"></div>
</template>

<script>
export default {
  name: 'GameButtons',
  props: [
    'isLightYellow',
    'isLightRed',
    'isLightGreen',
    'isLightBlue',
    'redLight',
    'greenLight',
    'yellowLight',
    'blueLight',
  ],
  emits: ['pressButton'],
  methods: {
    pressButton(button) {
      this.$emit('pressButton', button);
    },
  },
};
</script>

<style scoped lang="scss">
.btn {
  position: relative;
  z-index: 2;
  display: inline-block;
  width: 46%;
  height: 46%;
  border: pxToRem(1px) solid #191919;
  cursor: pointer;
  transition: background 0.1s, box-shadow 0.1s;
}

.red {
  border-top-left-radius: 100%;
  background: radial-gradient(circle at 67% 67%, #bb2c39, #bd2f3d, #90242e);
  box-shadow: pxToRem(0px) pxToRem(0px) pxToRem(14px) pxToRem(5px) #44171b inset;
}

.green {
  border-top-right-radius: 100%;
  background: radial-gradient(circle at 33% 67%, #0b8041, #187d47, #138548);
  box-shadow: pxToRem(0px) pxToRem(0px) pxToRem(14px) pxToRem(5px) #052d14 inset;
}

.yellow {
  border-bottom-left-radius: 100%;
  background: radial-gradient(circle at 67% 33%, #b59c06, #ab9308, #7b6a00);
  box-shadow: pxToRem(0px) pxToRem(0px) pxToRem(14px) pxToRem(5px) #2b2608 inset;
}

.blue {
  border-bottom-right-radius: 100%;
  background: radial-gradient(circle at 33% 33%, #0c6594, #17638a, #083b56);
  box-shadow: pxToRem(0px) pxToRem(0px) pxToRem(14px) pxToRem(5px) #072738 inset;
}

.green-active {
  background: radial-gradient(circle at 45% 54%, #29ff8d, #22ad63, #168449);
  box-shadow: pxToRem(0px) pxToRem(0px) pxToRem(19px) pxToRem(5px) #0e9240 inset;
}

.yellow-active {
  background: radial-gradient(circle at 55% 46%, #fbee9f, #e0c41d, #e0c624);
  box-shadow: pxToRem(0px) pxToRem(0px) pxToRem(19px) pxToRem(5px) #bda515 inset;
}

.blue-active {
  background: radial-gradient(circle at 55% 46%, #72ceff, #1b90ce, #2676a0);
  box-shadow: pxToRem(0px) pxToRem(0px) pxToRem(19px) pxToRem(5px) #0d5073 inset;
}

.red-active {
  background: radial-gradient(circle at 55% 54%, #ff9aa4, #f7384b, #ff1025);
  box-shadow: pxToRem(0px) pxToRem(0px) pxToRem(16px) pxToRem(5px) #b53742 inset;
}
</style>
