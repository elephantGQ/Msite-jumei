import posController from './controllers/cartList'
const cartTpl = require('./views/cart.html')
let compiled = _.template(cartTpl)
let str = compiled({})
$(".box").html(str)
posController.renderList()