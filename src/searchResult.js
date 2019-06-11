//建议的api
//http://mobile.jumei.com/msapi/search/suggestion.json?keyword=%E8%A1%A5%E6%B0%B4
//搜索出来的api
//https://h5.jumei.com/search/index?search=%E9%9D%A2%E8%86%9C&page=1&ajax=get
import fetch from './models/fetch'
const suggestTpl = require('./views/searchResultList.html')
let reder= async function(){
    let page=0;
    console.log("开始了");
    //http://localhost:8000/jumei/search/index?search=%E9%9D%A2%E8%86%9C%E8%A1%A5%E6%B0%B4&page=1&ajax=get
    let req1 = await fetch.get(`/jumei/search/index${location.search}&page=${++page}&ajax=get`)
    $(".otitle").html(req1.search)
    let compiled = _.template(suggestTpl)
    let str = compiled({
        "data": req1.data.item_list
    });
    $(".searchList").html(str);
    // Better scroll 实例化
    let bScroll = new BScroll('main', {
        probeType: 1,
        click: true
    })
    let foot = $('.foot img'),
        bottomImgHasClass = foot.hasClass('down')
    // 绑定滑动事件
    bScroll.on('scroll', function () {
        let y = this.y
        let maxY = this.maxScrollY - y
        // $(".topNav").css({
        //     top:-y
        // })
        // 上拉，当滚动到最底部时候触发
        if (maxY >= 0) {
            !bottomImgHasClass && foot.addClass('down')
            return
        }
    })
    bScroll.on('scrollEnd', async function () {
        // 下拉加载处理
        let maxY = this.maxScrollY - this.y
        if (maxY > -40 && maxY < 0) {
            this.scrollTo(0, this.maxScrollY + 40);
            foot.removeClass('down')
        } else if (maxY >= 0) {
            foot.attr('src', '/images/ajax-loader.gif')
            // 异步加载数据

            let data = await fetch.get(`/jumei/search/index${location.search}&page=${++page}&ajax=get`)
            console.log(data)
            let compiled = _.template(suggestTpl)
            let str = compiled({
                "data": data.data.item_list
            });
            $(".searchList").html($(".searchList").html() + str);
            bScroll.refresh() // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
            bScroll.scrollTo(0, bScroll.maxScrollY + 40)
            foot.removeClass('down')
            foot.attr('src', '/images/arrow.png')

        }
    })
}
reder();