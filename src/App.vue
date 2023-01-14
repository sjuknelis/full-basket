<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <router-link :to="{path: '/'}" class="navbar-brand">Full Basket</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent" v-if="$route.name != 'dashboard' && $route.name != 'edit'">
        <button class="btn btn-outline-success" @click="signIn">Manage a campaign</button>
      </div>
    </div>
  </nav>
  <br v-if="$route.name != 'home'" />
  <RouterView />
  <br />
</template>

<script setup>
  import { RouterLink,RouterView,useRouter } from 'vue-router';
  import { useFirebaseAuth } from 'vuefire';
  import { GoogleAuthProvider,signInWithPopup } from 'firebase/auth';

  const router = useRouter();

  const auth = useFirebaseAuth();
  const provider = new GoogleAuthProvider();

  function signIn() {
    signInWithPopup(auth, provider)
      .then(async result => {
        const email = result.user.email;
        const listingsResponse = await fetch("http://localhost:8080/listings");
        const listings = await listingsResponse.json();
        let i;
        for ( i = 0; i < listings.length; i++ ) {
          console.log(listings[i].email)
          if ( listings[i].email == email ) break;
        }
        if ( i < listings.length ) {
          localStorage.setItem("managing",i);
          router.push({path: `/dashboard/${i}`});
        } else {
          const createResponse = await fetch(`http://localhost:8080/create?email=${email}`);
          const createdID = parseInt(await createResponse.text());
          localStorage.setItem("managing",createdID);
          router.push({path: `/edit/${createdID}`});
        }
      }).catch(error => {

      });
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
  * {
    font-family: "Montserrat";
  }
  a {
    text-decoration: none !important;
    color: black;
  }
  .big-button {
    font-size: 1.5rem;
    padding: 1.2rem;
    font-weight: bold;
  }
</style>