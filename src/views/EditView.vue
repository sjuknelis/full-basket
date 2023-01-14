<template>
  <div class="container">
    <div class="row">
      <div class="col-8">
        <img ref="headImage" class="w-100" :src="`http://localhost:8080/img/${listingData.img}`" :style="`opacity: ${listingData.img != '' ? 1 : 0}`" />
        <div class="image-info">
          <input ref="fileUpload" type="file" @change="fileChange" />
          <p class="small-text">Supply a 4:3 aspect ratio image.</p>
        </div>
        <h1>
          <input v-model="listingData.title" placeholder="Title" />
        </h1>
        <h4>
          <input v-model="listingData.organizer" placeholder="Organizer" />
        </h4>
        <p>
          <textarea v-model="listingData.description"></textarea>
        </p>
        <p>
          Address:<br />
          <input v-model="listingData.address.street" placeholder="Street address" /><br />
          <div class="row">
            <div class="col-4">
              <input v-model="listingData.address.city" placeholder="City" />
            </div>
            <div class="col-4">
              <input v-model="listingData.address.state" placeholder="State" />
            </div>
            <div class="col-4">
              <input v-model="listingData.address.zip" placeholder="ZIP Code" />
            </div>
          </div>
        </p>
      </div>
      <div class="col-4 info-col">
        <button class="btn btn-success" @click="saveAndExit">Back to dashboard</button>
        <br />
        <b>{{ listingData.organizer || "Organizer" }} is seeking totals of:</b>
        <ul>
          <li v-for="item in listingData.seeking">
            <input v-model="item.goal" type="number" />
            x {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref,onMounted } from "vue";
  import { useRouter,useRoute } from "vue-router";

  const router = useRouter();
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
  const oldSeeking = ref();
  const headImage = ref();
  const fileUpload = ref();

  onMounted(async () => {
    const response = await fetch(`http://localhost:8080/listing?id=${route.params.id}`);
    listingData.value = await response.json();
    oldSeeking.value = JSON.parse(JSON.stringify(listingData.value.seeking));
  });

  async function fileChange() {
    const files = fileUpload.value.files;
    if ( files && files[0] ) {
      headImage.value.src = URL.createObjectURL(files[0]);
      headImage.value.opacity = 1;
      const formData = new FormData();
      formData.append("image",files[0]);
      const response = await fetch(`http://localhost:8080/image?id=${route.params.id}`,{
        method: "POST",
        body: formData
      });
      const filename = await response.text();
      listingData.value.img = filename;
    }
  }

  async function saveAndExit() {
    for ( const newSeekingItem of listingData.value.seeking ) {
      for ( const oldSeekingItem of oldSeeking.value ) {
        if ( newSeekingItem.name == oldSeekingItem.name ) {
          newSeekingItem.amount += newSeekingItem.goal - oldSeekingItem.goal;
        }
      }
    }
    await fetch(`http://localhost:8080/edit?id=${route.params.id}&data=${JSON.stringify(listingData.value)}`);
    router.push({path: `/dashboard/${route.params.id}`})
  }
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
  .image-info {
    text-align-last: center;
    margin-top: 1rem;
  }
  button {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  input:not([type="file"]),textarea {
    width: 100%;
  }
  input[type="number"] {
    width: 3.5rem;
  }
  textarea {
    height: 50vh;
  }
  .info-col {
    border-left: 1px solid lightgray;
  }
</style>
