<template>
  <div class="header-links">
    <div class="container">
      <div class="w-full flex items-center justify-between">
        <nuxt-link to="/">
          <span>Unbound</span>
        </nuxt-link>
        <Wallet />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.header-links {
  @apply border-b-2;
  @apply py-4;

  &__container {
    @apply flex-1;
    @apply items-center;
    @apply justify-center;
    @apply flex;

    .header-link {
      @apply px-4;
      @apply font-medium;
      @apply hidden;

      @media screen and (min-width: theme('screens.md')) {
        @apply block;
      }

      &.active {
        @apply text-green-600;
        @apply relative;

        &:after {
          @apply absolute;

          content: '';
          height: 2px;
          left: 0;
          right: 0;
          bottom: -36px;
          background: white;
        }
      }
    }
  }
}
</style>
