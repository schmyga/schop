Vue.component('products', {
    data() {
        return {
            catalogUrl: '/catalogData.json',
            filtered: [],
            products: [],
        }
    },
    mounted() {
        this.$parent.getJson(`/api/products`)
            .then(data => {
                for (let item of data) {
                    this.$data.products.push(item);
                    this.$data.filtered.push(item);
                }
            });
    },
    methods: {
        filter(userSearch) {
            let regexp = new RegExp(userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
    template: ` <div class="products__items">
                    <product v-for="item of filtered" 
                    :key="item.id_product" 
                    :img="item.img_product"
                    :product="item"
                    @add-product="$parent.$refs.cart.addProduct"></product>
                </div>`
});
Vue.component('product', {
    props: ['product', 'img'],
    template: ` <div class="products__item">
                    <a href="product.html" class="products__item_link">
                        <figure class="product">
                            <img :src="img" alt="product" class="product__img">
                            <div class="product__block">
                                <h4 class="product__title">{{product.product_name}}</h4>
                                <p class="product__subtitle">{{product.product_text}}</p>
                                <p class="product__price color-emphasis font-size_16">&#36;{{product.price}}</p>
                            </div>
                        </figure>
                    </a>
                    <div class="product__add">
                        <button class="product__add_link" @click="$emit('add-product', product)">Add to Cart</button>
                    </div>
                </div>`
})
