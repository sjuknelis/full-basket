<template>
  <div class="container">
    <h1>Thank you for donating!</h1>
    <br />
    <p>{{ listingData.organizer }} will be able to see your donation in their dashboard.</p>
    <br />
    <router-link :to="{path: `/listing/${$route.params.id}`}">
      <button class="btn btn-primary">Back to listing</button>
    </router-link>
  </div>
</template>

<script setup>
  import { ref,onMounted } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();

  const listingData = ref({
    "organizer": ""
  });

  onMounted(async () => {
    const response = await fetch(`http://localhost:8080/listing?id=${route.params.id}`);
    listingData.value = await response.json();
  });
</script>

<style scoped>
  .container {
    text-align: center;
  }
</style>