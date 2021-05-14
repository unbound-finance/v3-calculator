<template>
  <transition name="modal-transition">
    <div
      v-show="modal"
      class="modal-backdrop flex justify-center items-center"
      @click="close"
    >
      <div class="modal-container mx-4 shadow-lg bg-white m-auto" @click.stop>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    value: Boolean,
    persistent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modal: this.value,
    }
  },
  watch: {
    value(a) {
      this.modal = a
    },
    modal(a) {
      if (a) {
        document.body.classList.add('overflow-hidden')
      } else {
        document.body.classList.remove('overflow-hidden')
      }
      this.$emit('input', a)
    },
  },
  mounted() {
    this.closeOnEsc()
  },
  methods: {
    close() {
      if (!this.persistent) {
        this.modal = false
        this.$emit('close')
      }
    },
    closeOnEsc() {
      if (!this.persistent) {
        document.addEventListener('keydown', (e) => {
          if (this.show && e.keyCode === 27) {
            this.close()
          }
        })
      }
    },
  },
}
</script>

<style>
.modal-backdrop {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  width: 100%;
  height: 100%;
}
.modal-container {
  width: 400px;
  max-height: 85%;
  overflow-x: auto;
  transition: all 0.3s ease;
  border-radius: 22px;
}
.modal-transition-enter,
.modal-transition-leave-active {
  opacity: 0;
}
.modal-transition-enter .modal-container,
.modal-transition-leave-active .modal-container {
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
}
</style>
