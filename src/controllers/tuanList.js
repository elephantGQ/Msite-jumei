// http://localhost:8000/tuanInit?tab=coutuan_home&page=1&per_page=20
const tuanListTpl = require('../views/tuanList.html')
import fetch from '../models/fetch'
let page = 0;
const renderList = async () => {
    let data = await fetch.get(`jumei/yiqituan/tab_list?tab=coutuan_home&page=${++page}&per_page=20`)
    let compiled = _.template(tuanListTpl)
    let str = compiled({
        "data": data.data
    });
    $(".container").html(str);
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

            let data = await fetch.get(`jumei/yiqituan/tab_list?tab=coutuan_home&page=${++page}&per_page=20`)
            let compiled = _.template(tuanListTpl)
            let str = compiled({
                "data": data.data
            });
            $(".container").html($(".container").html() + str);
            bScroll.refresh() // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
            bScroll.scrollTo(0, bScroll.maxScrollY + 40)
            foot.removeClass('down')
            foot.attr('src', '/images/arrow.png')

        }
    })
}

export default {
    renderList
}