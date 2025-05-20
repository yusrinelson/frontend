<script setup>
import Navbar from '@/components/Navbar.vue';
import { RouterView } from 'vue-router'
import { useAuth } from './composable/useAuth';
import { onMounted } from 'vue';

const {init} = useAuth();

onMounted(() => {
  init();  //Check for tokens and load user data on app start or refresh
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
