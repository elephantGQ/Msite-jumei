export default {
  get(url) {
    return $.ajax({
      url,
      type: 'get',
      success:function(result) {
        return result
      }
    })
  }
}