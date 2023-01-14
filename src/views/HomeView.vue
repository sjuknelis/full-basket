<template>
  <div id="bg-div">
    <img id="bg" src="@/assets/background.jpg" />
    <div id="bg-text">
      <div id="bg-text-content">
        <h1>Ending hunger together.</h1>
        <p>Select your donation preferences, then search below for organizations in need of your support.</p>
      </div>
    </div>
  </div>
  <div class="container">
    <br />
    <div class="accordion" id="accordionExample">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            Donation preferences
          </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            <p>I am able to donate:</p>
            <div class="row">
              <div v-for="item in preferences" class="col-4 donation-type-box">
                <b>{{ item.name }}</b>
                <br />
                <br />
                <i :class="`fa-solid fa-${ITEM_ICONS[item.name]}`"></i>
                <br />
                <br />
                <input v-model="item.amount" type="number" min="0" @change="updatePreferences" /> items
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <h4>Recommended for you</h4>
    <div class="row">
      <div v-for="(item,index) in recommended" class="col-4">
        <ListingCard :id="item.index" :data="item" :seeking="intersectionInLists(topThreeInList(item.seeking),topPreferences)" />
      </div>
    </div>
    <br />
    <h4>Others seeking help</h4>
    <div class="row">
      <div v-for="(item,index) in listings.filter(item => recommended.indexOf(item) == -1)" class="col-4" style="margin-bottom: 1rem;">
        <ListingCard :id="item.index" :data="item" :seeking="topThreeInList(item.seeking)[0]" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import ListingCard from '../components/ListingCard.vue';
  import { ref,computed,watch,onMounted } from 'vue';

  const ITEM_ICONS = {
    "Canned Fruit": "apple-whole",
    "Canned Vegetables": "carrot",
    "Rice": "bowl-rice",
    "Meat": "drumstick-bite",
    "Fish": "fish",
    "Wheat Products (inc. bread)": "wheat-awn"
  };

  const listings = ref([]);
  const recommended = ref([]);

  function topThreeInList(list) {
    const top = [
      {amount: 0},
      {amount: 0},
      {amount: 0}
    ];
    for ( const item of list ) {
      if ( item.amount > top[2].amount ) {
        if ( item.amount > top[1].amount ) {
          if ( item.amount > top[0].amount ) top.splice(0,0,item);
          else top.splice(1,0,item);
        } else {
          top.splice(2,0,item);
        }
        top.pop();
      }
    }
    return top;
  }

  function intersectionInLists(aList,bList) {
    for ( const aItem of aList ) {
      for ( const bItem of bList ) {
        if ( aItem.name && aItem.name == bItem.name ) return aItem;
      }
    }
    return false;
  }

  function computeListings() {
    recommended.value = [];
    for ( const listing of listings.value ) {
      const topSeeking = topThreeInList(listing.seeking);
      //console.log(topSeeking,topPreferences.value,intersectionInLists(topSeeking,topPreferences.value))
      if ( intersectionInLists(topSeeking,topPreferences.value) ) recommended.value.push(listing);
      if ( recommended.value.length >= 3 ) return;
    }
  }

  if ( ! localStorage.getItem("preferences") ) {
    const defaultPreferences = [];
    for ( const item of Object.keys(ITEM_ICONS) ) defaultPreferences.push({
      name: item,
      amount: 0
    });
    localStorage.setItem("preferences",JSON.stringify(defaultPreferences));
  }
  const preferences = ref(JSON.parse(localStorage.getItem("preferences")));
  const topPreferences = computed(() => topThreeInList(preferences.value));
  function updatePreferences() {
    localStorage.setItem("preferences",JSON.stringify(preferences.value));
    computeListings();
  }

  onMounted(async () => {
    const response = await fetch("http://localhost:8080/listings");
    listings.value = (await response.json()).filter(item => item.title != "");
    for ( let i = 0; i < listings.value.length; i++ ) {
      listings.value[i].index = i;
    }
    computeListings();
  });
</script>

<style scoped>
  #bg-div {
    max-height: 50vh;
    overflow-y: hidden;
    position: relative;
  }
  #bg {
    width: 100vw;
  }
  #bg-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 50vh;
    color: white;
  }
  #bg-text-content {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 5vw;
  }
  #bg-text-content h1 {
    font-weight: bold;
    text-decoration: underline;
  }
  .donation-type-box {
    text-align: center;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .donation-type-box:not(:nth-child(4)):not(:nth-child(5)):not(:nth-child(6)) {
    border-bottom: 2px solid lightgray;
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