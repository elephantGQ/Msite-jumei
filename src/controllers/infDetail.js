const productListTpl = require('../views/infDetail.html')
import fetch from '../models/fetch'
let search = window.location.search;
const renderInfo = async () => {
    let req1 = await fetch.get(`/jumei/product/ajaxStaticDetail${search}`)
    var compiled = _.template(productListTpl);
    // console.log(compiled)
    let data = req1.data;
    var str = compiled({
        "data": data
    });
    $(".wrap").html(str);
    var mySwiper = new Swiper('.swiper-container', {})
    $(".description").html(req1.data.description_info.description);
    let req = await fetch.get(`/jumei/product/ajaxDynamicDetail${search}`)
    console.log(req);
    console.log(req.data.result.size[0].jumei_price);
    $(".jumeiPrice").html("￥" + req.data.result.size[0].jumei_price);
    $(".marketPrice").html("￥" + req.data.result.size[0].market_price);
    $(".shop-label").html(req.data.result.shop_info.store_content);
    $(".shop-left>img").prop("src", req.data.result.shop_info.logo_url['800']);
}




export default {
    renderInfo
}
