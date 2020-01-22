import jq from 'jquery'
import config from './config.js'

var URL = 'http://192.168.3.111/rpgmoba'
// URL = config.url;

export default {
  get: function(path) {
    jq.get({
      url: URL + '/api/yy/summary',
      success: function() {}
    })
  },
  ajax: function(path,data,success) {
    jq.ajax({
      url: URL + path,
      data: data,
      success: success
    })
  }
}
