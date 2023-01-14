<template>
  <router-link :to="{path: `/listing/${id}`}">
    <div class="card" style="width: 100%;">
      <img :src="`http://localhost:8080/img/${data.img}`" class="card-img-top" alt="...">
      <div class="card-body">
        <h4 class="card-title">{{ data.title }}</h4>
        <p class="card-text">
          {{ data.organizer }}, {{ data.address.city }}, {{ data.address.state }}<br />
          Seeking {{ seeking.amount }}x {{ seeking.name }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps(["id","data","seeking"]);
</script>

<style scoped>

</style>