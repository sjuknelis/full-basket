<template>
  <div class="container">
    <div class="row">
      <div class="col-8">
        <img class="w-100" :src="`http://localhost:8080/img/${listingData.img}`" />
        <br />
        <h1>{{ listingData.title }}</h1>
        <h4>{{ listingData.organizer }}, {{ listingData.address.city }}, {{ listingData.address.state }}</h4>
        <div class="progress">
          <div class="progress-bar" role="progressbar" :style="`width: ${goalPercent()}%`"></div>
        </div>
        <b class="percent">{{ listingData.organizer }} is {{ goalPercent() }}% of the way to its goal!</b>
        <br />
        <p>
          {{ listingData.description }}
        </p>
        <div class="row">
          <div class="col-4 address">
            <p>
              Address:<br />
              {{ listingData.address.street }}<br />
              {{ listingData.address.city }}, {{ listingData.address.state }} {{ listingData.address.zip }}
            </p>
          </div>
          <div class="col-8">
            <iframe frameborder="0" :src="`https://www.google.com/maps/embed/v1/place?q=${`${listingData.address.street}, ${listingData.address.city} ${listingData.address.state}`.split(' ').join('+')}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`"></iframe>
          </div>
        </div>
        
      </div>
      <div class="col-4">
        <router-link :to="{path: `/donate/${$route.params.id}`}">
          <button class="btn btn-primary big-button">Donate now!</button>
        </router-link>
        <br />
        <b>{{ listingData.organizer }} is seeking:</b>
        <ul>
          <li v-for="item in listingData.seeking.filter(item => item.amount > 0)">{{ item.amount }}x {{ item.name }}</li>
        </ul>
        <br />
        <b>Top donations to {{ listingData.organizer }}:</b>
        <ul>
          <li v-for="item in topFromRecents(listingData.recents)">{{ item.name }} donated {{ item.amount }} items</li>
        </ul>
        <br />
        <b>Recent donations to {{ listingData.organizer }}:</b>
        <ul>
          <li v-for="item in listingData.recents.reverse().slice(0,10)">{{ item.name }} donated {{ item.amount }} items</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref,onMounted } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();

  const listingData = ref({
    "title": "",
    "organizer": "",
    "description": "",
    "seeking": [],
    "recents": [],
    "address": {
      "street": "",
      "city": "",
      "state": "",
      "zip": ""
    }
  });

  function topFromRecents(recents) {
    return recents.sort((a,b) => b.amount - a.amount).slice(0,10);
  }

  function totalDonatedInCategory(name) {
    let total = 0;
    for ( const donation of listingData.value.recents ) {
      for ( const item of donation.donating ) {
        if ( item.name == name ) {
          total += item.donating;
          break;
        }
      }
    }
    return total;
  }

  function goalPercent() {
    let donated = 0;
    let goal = 0;
    for ( const item of listingData.value.seeking ) {
      donated += totalDonatedInCategory(item.name);
      goal += item.goal;
    }
    return Math.round(donated / goal * 100);
  }

  onMounted(async () => {
    const response = await fetch(`http://localhost:8080/listing?id=${route.params.id}`);
    listingData.value = await response.json();
  });
</script>

<style scoped>
  h1 {
    font-weight: bold;
  }
  img {
    display: block;
    border-radius: 20px;
    width: unset !important;
    height: 55vh;
    margin-left: auto;
    margin-right: auto;
  }
  button {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .col-4:not(.address) {
    border-left: 1px solid lightgray;
  }
  .progress {
    margin-top: 1.5rem;
  }
  .percent {
    display: block;
    margin-bottom: -0.5rem;
  }
  iframe {
    width: 100%;
    height: 400px;
  }
</style>
