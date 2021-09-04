Vue.component('filter-el', {
    data() {
        return {
            userSearch: ''
        }
    },
    template: `<form action="#" class="header__top_form" @submit.prevent="$parent.$refs.products.filter(userSearch)">
                    <button type="submit" class="header__top_button button">
                        <img src="img/search.svg" alt="search" class="header__top_search">
                    </button>
                    <input type="text" placeholder="Search" class="header__top_input input-text" v-model="userSearch">
                </form>`
})

