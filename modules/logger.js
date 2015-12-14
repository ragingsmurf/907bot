module.exports = function() {
  return {
    c: function(msg) {
      if (msg instanceof Array) {
        console.log(msg);
      } else {
        console.log('\t' + msg);
      }
    },
  };
}
