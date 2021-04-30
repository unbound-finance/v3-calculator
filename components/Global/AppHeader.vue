<template>
  <div class="header-links">
    <div class="header-links__container">
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
    @apply max-w-6xl;
    @apply mx-auto;
    @apply flex-1;
    @apply items-center;
    @apply justify-center;
    @apply flex;
  }
}
</style>
