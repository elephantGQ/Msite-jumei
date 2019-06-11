//建议的api
//http://mobile.jumei.com/msapi/search/suggestion.json?keyword=%E8%A1%A5%E6%B0%B4
//搜索出来的api
//https://h5.jumei.com/search/index?search=%E9%9D%A2%E8%86%9C&page=1&ajax=get
import fetch from './models/fetch'
const suggestTpl = require('./views/suggestList.html')
function thorttle(fn,wait){
    let pre=new Date().getTime();
    return function(){
        let now=new Date().getTime();
        if(now-pre>wait){
            fn();
            pre=new Date().getTime();
        }
    }
}
$("#search_input").on("input",  thorttle(async function(){
    let req1 = await fetch.get(`/searchSuggest/msapi/search/suggestion.json?keyword=${$("#search_input").val()}`)
    
    let compiled = _.template(suggestTpl)
    let str = compiled({
        "data": JSON.parse(req1).data
    });
    $(".recommend_lists").html(str);
},300))
