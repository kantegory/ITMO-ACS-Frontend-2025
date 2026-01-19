<template>
    <Header />
    <div class="acct">
            <div></div>
            <div class="acctname">
                <h3 class="name">Venus O. C.</h3>
            </div>
            <div class="acctinfo">
                <h5 class="acctskill">Advanced</h5>
                <h5 class="acctplace">Pärnu, Estonia</h5>
                <h5 class="acctnums">Saved recipes: <span class="savednum">4</span></h5>
            </div>            
            <img src="src/assets/images/face.jpg" alt="profile picture">
    </div>
    <hr />
    <base-layout>
    </base-layout>
</template>

<script>
    import BaseLayout from '@/layouts/BaseLayout.vue'
    import Header from '@/components/Header.vue'
    export default {
        name: 'ProfilePage',


        components: { BaseLayout, Header }
    }
</script>