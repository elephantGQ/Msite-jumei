import posController from './product'
const indexTpl = require('../views/index.html')
export default {
  render() {
    let compiled = _.template(indexTpl)
    let str = compiled({})
    $(".box").html(str)
    posController.renderList()
  }
}

