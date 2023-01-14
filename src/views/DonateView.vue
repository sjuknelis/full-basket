<template>
  <div class="container">
    <div class="row top-row">
      <div class="col">
        <p>
          Donating to
          <b>{{ listingData.title }}</b><br />
          {{ listingData.organizer }}, {{ listingData.address.city }}, {{ listingData.address.state }}
        </p>
      </div>
      <div class="col">
        <router-link :to="{path: `/listing/${$route.params.id}`}">
          <button class="btn btn-primary">Back to listing</button>
        </router-link>
      </div>
    </div>
    <hr />
    <h4>1. What are you able to donate today?</h4>
    <div class="row">
      <div v-for="item in listingData.seeking.filter(item => item.amount > 0)" class="col-4 donation-type-box">
        <b>{{ item.name }}</b>
        <br />
        <br />
        <i :class="`fa-solid fa-${ITEM_ICONS[item.name]}`"></i>
        <br />
        <br />
        <input v-model="item.donating" type="number" min="0" :max="item.amount" /> items
      </div>
    </div>
    <hr />
    <h4>2. Would you like to update your [donation] preferences now?</h4>
    <div class="form-check">
      <input v-model="updateSelection" class="form-check-input" type="radio" name="updateRadio" id="updateRadio1" value="yes" checked>
      <label class="form-check-label" for="updateRadio1">
        Yes
      </label>
    </div>
    <div class="form-check">
      <input v-model="updateSelection" class="form-check-input" type="radio" name="updateRadio" id="updateRadio2" value="no">
      <label class="form-check-label" for="updateRadio2">
        No
      </label>
    </div>
    <p>You are currently interested in donating up to:</p>
    <ul>
      <li v-for="item in preferences">{{ item.amount - (updateSelection == "yes" ? getDonatingAmount(item.name) : 0) }} items of {{ item.name }}</li>
    </ul>
    <p>You can always update your donation preferences from the home page.</p>
    <hr />
    <h4>3. To what name would you like to credit this donation?</h4>
    <p>This name will be listed on the [] website and potentially in {{ listingData.organizer }}'s publications.</p>
    <div class="form-check">
      <input v-model="nameSelection" class="form-check-input" type="radio" name="nameRadio" id="nameRadio1" value="name" checked>
      <label class="form-check-label" for="nameRadio1">
        <input v-model="name" type="text" placeholder="Enter a name..." :disabled="nameSelection != 'name' " />
      </label>
    </div>
    <div class="form-check">
      <input v-model="nameSelection" class="form-check-input" type="radio" name="nameRadio" id="nameRadio2" value="anonymous">
      <label class="form-check-label" for="nameRadio2">
        Make my donation anonymous
      </label>
    </div>
    <hr />
    <h4>4. Deliver your donation</h4>
    <p>Package and deliver your donation (by hand or, if possible, by mail) to the following address:</p>
    <p>
      {{ listingData.organizer }}<br />
      {{ listingData.address.street }}<br />
      {{ listingData.address.city }}, {{ listingData.address.state }} {{ listingData.address.zip }}
    </p>
    <p>We will tell {{ listingData.organizer }} about your donation so they're ready for it.</p>
    <hr />
    <button class="btn btn-success big-button" @click="submitForm">I'm done!</button>
  </div>
</template>

<script setup>
  import { ref,onMounted } from "vue";
  import { useRouter,useRoute } from "vue-router";

  const router = useRouter();
  const route = useRoute();

  const ITEM_ICONS = {
    "Canned Fruit": "apple-whole",
    "Canned Vegetables": "carrot",
    "Rice": "bowl-rice",
    "Meat": "drumstick-bite",
    "Fish": "fish",
    "Wheat Products (inc. bread)": "wheat-awn"
  };

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

  const updateSelection = ref("yes");
  const nameSelection = ref("name");
  const name = ref("");

  const preferences = ref(JSON.parse(localStorage.getItem("preferences")));

  onMounted(async () => {
    const response = await fetch(`http://localhost:8080/listing?id=${route.params.id}`);
    listingData.value = await response.json();
    for ( const seekingItem of listingData.value.seeking ) {
      seekingItem.donating = 0;
    }
  });

  function getDonatingAmount(name) {
    for ( const seekingItem of listingData.value.seeking ) {
      if ( seekingItem.name == name ) return seekingItem.donating;
    }
    return 0;
  }

  async function submitForm() {
    const obj = {
      donating: listingData.value.seeking,
      name: nameSelection.value == "name" ? name.value : "Anonymous"
    };
    await fetch(`http://localhost:8080/donation?id=${route.params.id}&data=${JSON.stringify(obj)}`);
    router.push({path: `/thankyou/${route.params.id}`});
  }
</script>

<style scoped>
  button {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .top-row p {
    margin-bottom: 0.5rem;
  }
  .top-row button {
    margin-right: 0;
  }
  .donation-type-box {
    text-align: center;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .donation-type-box:nth-child(3n + 2) {
    border-left: 2px solid lightgray;
    border-right: 2px solid lightgray;
  }
  .donation-type-box input {
    width: 3.5rem;
  }
  .fa-solid {
    font-size: 4rem;
  }
</style>