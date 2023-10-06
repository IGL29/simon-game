<template>
  <button class="btn-mute-sounds" :class="{ mute: isMuteSound }" @click.prevent="muteSounds"></button>
</template>

<script>
export default {
  props: ['isMuteSound'],

  methods: {
    muteSounds() {
      this.$emit('update:isMuteSound', !this.isMuteSound);
    },
  },
};
</script>
