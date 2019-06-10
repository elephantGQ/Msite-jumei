const tuanListTpl = require('../views/cartList.html')
import fetch from '../models/fetch'
let page = 0;
const renderList = async () => {
let compiled = _.template(tuanListTpl);
let str = compiled({
});
$(".container").html(str);
}
export default {
    renderList
}