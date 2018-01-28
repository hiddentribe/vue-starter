<template>
  <div :class="$style.vueSlider" ref="slider">
    <div :class="$style.track">
      <div :class="$style.progress" :style="{width: progressWidth, marginLeft: progressLeft}"></div>
      <button
        :class="$style.handle"
        :style="{left: handleLeftPosition}"
        @mousedown="moveStart($event, 0)"
        @touchstart="moveStart($event, 0)"
        :aria-valuemax="max"
        :aria-valuemin="min"
        :aria-valuenow="currentMin"
        aria-disabled="false"
        role="slider"
        tabindex="0"
        type="button"
      ></button>
      <button
        :class="$style.handle"
        :style="{left: handleRightPosition}"
        @mousedown="moveStart($event, 1)"
        @touchstart="moveStart($event, 1)"
        :aria-valuemax="max"
        :aria-valuemin="min"
        :aria-valuenow="currentMax"
        aria-disabled="false"
        role="slider"
        tabindex="0"
        type="button"
      ></button>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'VueSlider',
    components: {},
    props: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true
      },
      values: {
        type: Array,
        required: true,
      },
    },
    data(): any {
      return {
        sliderBox: null,
        currentSlider: null,
        currentStartX: 0,
        currentMin: 0,
        currentMax: 0,
      };
    },
    computed: {
      handleLeftPosition() {
        return `${(this.currentMin * 100) / this.max}%`;
      },
      handleRightPosition() {
        return `${(this.currentMax * 100) / this.max}%`;
      },
      progressLeft() {
        return `${(this.currentMin * 100) / this.max}%`;
      },
      progressWidth() {
        return `${parseInt(this.handleRightPosition, 10) - parseInt(this.handleLeftPosition, 10)}%`;
      },
    },
    methods: {
      moveStart(e: any, index: number = 0) {
        this.currentSlider = index;
        this.currentStartX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;

        document.addEventListener('touchmove', this.moving, { passive: false });
        document.addEventListener('mousemove', this.moving);
        document.addEventListener('touchend', this.moveEnd, { passive: false });
        document.addEventListener('mouseup', this.moveEnd);
        document.addEventListener('mouseleave', this.moveEnd);
      },
      moveEnd() {
        if (this.currentSlider === null) {
          return;
        }

        document.removeEventListener('touchmove', this.moving);
        document.removeEventListener('mousemove', this.moving);
        document.removeEventListener('touchend', this.moveEnd);
        document.removeEventListener('mouseup', this.moveEnd);
        document.removeEventListener('mouseleave', this.moveEnd);

        this.$emit('change', { values: [this.currentMin, this.currentMax] });

        this.currentSlider = null;
      },
      moving(e: any) {
        const positionX: number = e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0].clientX : e.clientX;
        const percentageDiff: number = ((positionX - this.sliderBox.left) / this.sliderBox.width) * 100;
        const valueDiff: number = (this.max * percentageDiff) / 100;
        const valueId: string = this.currentSlider === 0 ? 'currentMin' : 'currentMax';
        const value: number = valueDiff;

        if (value < this.min) {
          this[valueId] = 0;
        } else if (valueId === 'currentMin' && value >= this.currentMax - 5) {
          this[valueId] = this.currentMax - 5;
        } else if (valueId === 'currentMax' && value <= this.currentMin + 5) {
          this[valueId] = this.currentMin + 5;
        } else if (valueId === 'currentMax' && value >= this.max) {
          this[valueId] = this.max;
        } else {
          this[valueId] = value;
        }
      },
      refresh() {
        this.sliderBox = this.$refs.slider.getBoundingClientRect();
      }
    },
    mounted() {
      this.currentMin = this.values ? this.values[0] : 0;
      this.currentMax = this.values ? this.values[1] : 0;
      this.sliderBox = this.$refs.slider.getBoundingClientRect();
      window.addEventListener('resize', this.refresh);
    },
    destroyed() {
      window.removeEventListener('resize', this.refresh);
    },
  };
</script>

<style lang="scss" module>
  @import "../../styles";

  .vueSlider {
    user-select: none;
    display:     block;
    margin:      24px 0;
    padding:     0 16px;
  }

  .track {
    position:         relative;
    width:            100%;
    height:           4px;
    background-color: lighten($bg-color, 15%);
    box-shadow:       $panel-shadow;
  }

  .progress {
    height:     4px;
    background: linear-gradient(to left, $brand-dark-primary 0%, $brand-accent 100%);
  }

  .handle {
    position:         absolute;
    top:              -16px;
    display:          block;
    padding:          0;
    margin:           0 -16px;
    width:            32px;
    height:           32px;
    border-radius:    50%;
    box-shadow:       $panel-shadow;
    background-color: $bg-color;
    cursor:           pointer;
    border:           2px solid $brand-accent;

    transition:       box-shadow $transition-duration / 2 ease-in-out;

    &:hover, &:active, &:focus {
      box-shadow: 0 0 0 8px rgba(red($brand-accent), green($brand-accent), blue($brand-accent), .5);
    }
  }
</style>
