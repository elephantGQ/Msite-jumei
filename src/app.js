import posController from './controllers/product'
const indexTpl = require('./views/index.html')
let compiled = _.template(indexTpl)
let str = compiled({})
$(".box").html(str)
 posController.renderList()
