import posController from './cartList'
const cartTpl = require('../views/cart.html')
export default {
    render() {
let compiled = _.template(cartTpl)
let str = compiled({})
$(".box").html(str)
posController.renderList()
    }
}