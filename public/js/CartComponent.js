// const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

Vue.component('cart', {
    data() {
        return {
            cartUrl: '/getBasket.json',
            cartItems: [],
            showCart: false
        }
    },
    mounted() {
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for (let item of data.contents) {
                    item.imgPath = `img/${item.id_product}.jpg`;
                    this.$data.cartItems.push(item);
                }
            });
    },
    methods: {
        addProduct(item) {
            let find = this.cartItems.find(el => el.id_product === item.id_product);
            if (find) {
                this.$parent.putJson(`/api/cart/${find.id_product}`, { quantity: 1 })
                    .then(data => {
                        if (data.result === 1) {
                            find.quantity++;
                        }
                    })
            } else {
                const prod = Object.assign({ quantity: 1 }, item);
                this.$parent.postJson(`/api/cart`, prod)
                    .then(data => {
                        if (data.result === 1) {
                            this.cartItems.push(prod)
                        }
                    })
            }

            // this.$parent.getJson(`${API}/addToBasket.json`)
            //     .then(data => {
            //         if(data.result === 1){
            //             let find = this.cartItems.find(el => el.id_product === item.id_product);
            //             if(find){
            //                 find.quantity++;
            //             } else {
            //                 const prod = Object.assign({quantity: 1}, item);
            //                 this.cartItems.push(prod)
            //             }
            //         }
            //     })
        },
        remove(item) {
            let find = this.cartItems.find(el => el.id_product === item.id_product);
            if (find.quantity > 1) {
                this.$parent.putJson(`/api/cart/${find.id_product}`, { quantity: -1 })
                    .then(data => {
                        if (data.result === 1) {
                            find.quantity--;
                        }
                    })
            } else {
                this.$parent.delJson(`/api/cart/${find.id_product}`, item)
                    .then(data => {
                        if (data.result === 1) {
                            this.cartItems.splice(this.cartItems.indexOf(item), 1);
                        }
                    })
            }
        },
        cartCount() {
            return this.cartItems.reduce((summ, item) => summ + item.quantity, 0);
        },
        cartSumm() {
            return this.cartItems.reduce((summ, item) => summ + item.quantity * item.price, 0);
        }
    },
    template: ` <li class="header__top_list test">

                    <div class="header__basket_icon">
                        <button class="btn-cart" type="button"><img src="img/basket.svg"
                                alt="basket"></button>
                        <span id="basket-count">{{ cartCount() }}</span>
                    </div>
                    <div class="header__basket">
                        <p class="cross close basket-close">&#10006;</p>
                        <h3 class="header__basket_header color-emphasis font-size_16">Shopping cart</h3>
                        <h4 v-if="cartItems.length === 0">Cart is empty </h4>
                        <cart-item v-else v-for="item of cartItems" :key="item.id_product" :img="item.img_product" :cart-item="item" :cart-count="cartCount" :cart-summ="cartSumm" @remove="remove" @add-product="addProduct"> </cart-item>
                        <div class="header__basket_title font-size_16">Total amound: <span
                                class="header__basket_totalamound color-emphasis">&#36;{{ cartSumm() }}</span></div>

                    </div>
                </li>`
});

Vue.component('cart-item', {
    props: ['img', 'cartItem'],
    template: ` <div class="header__basket_product cart-item">
                    <img :src="img" alt="product" class="header__basket_img">
                    <div class="header__basket_block">
                        <div class="header__basket_name font-size_16">{{ cartItem.product_name }}</div>
                        <div class="header__basket_subtitle">Quantity: <span class="header__basket_count color-emphasis">{{ cartItem.quantity }}</span></div>
                        <div class="header__basket_subtitle">Price: <span class="header__basket_price color-emphasis">&#36;{{ cartItem.price }}</span></div>
                        <div class="header__basket_subtitle">Amount: <span class="header__basket_amount color-emphasis">{{ cartItem.price * cartItem.quantity }}</span></div>
                    </div>
                    <div class="header__basket_buttons">
                        <button class="header__basket_button btnInCart" @click="$emit('add-product', cartItem)">+</button>
                        <button class="header__basket_button del-btn btnInCart" @click="$emit('remove', cartItem)">-</button>
                    </div>
                </div>`
})