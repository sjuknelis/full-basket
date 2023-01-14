<template>
  <div class="container">
    <div class="row no-border">
      <div class="col">
        <p>
          Dashboard for <b>{{ listingData.title }}</b><br />
          Organized by {{ listingData.organizer }}, {{ listingData.address.city }}, {{ listingData.address.state }}<br />
          <b>{{ goalPercent() }}%</b> to goal
        </p>
      </div>
      <div class="col edit-col">
        <router-link :to="{path: `/edit/${$route.params.id}`}">
          <button class="btn btn-primary">Edit listing</button>
        </router-link>
      </div>
    </div>
    <hr />
    <h5>Donation summary</h5>
    <div class="row">
      <div class="col" scope="col"><b>Name</b></div>
      <div class="col" v-for="item in listingData.seeking.filter(item => item.goal > 0)" scope="col"><b>{{ item.name }}</b></div>
    </div>
    <div class="row" v-for="donation in listingData.recents">
      <tdiv class="col">{{ donation.name }}</tdiv>
      <div class="col" v-for="item in donation.donating.filter(item => itemHasGoal(item.name))">{{ item.donating }}</div>
    </div>
    <div class="row">
      <div class="col"><b>Total donated</b></div>
      <div class="col" v-for="item in listingData.seeking.filter(item => item.goal > 0)">{{ totalDonatedInCategory(item.name) }}</div>
    </div>
    <div class="row">
      <div class="col"><b>Remaining to goal</b></div>
      <div class="col" v-for="item in listingData.seeking.filter(item => item.goal > 0)">{{ item.amount }}</div>
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

  function itemHasGoal(name) {
    for ( const item of listingData.value.seeking ) {
      if ( item.name == name ) return item.goal > 0;
    }
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
  .row:not(.no-border) {
    border-bottom: 1px solid lightgray;
  }
  .edit-col {
    text-align: right;
  }
</style>