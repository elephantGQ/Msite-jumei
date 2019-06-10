import posController from './controllers/infDetail'
const indexTpl = require('./views/detail.html')
let compiled = _.template(indexTpl)
let str = compiled({})
$(".box").html(str)
posController.renderInfo()
