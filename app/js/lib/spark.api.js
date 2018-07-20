var spark = {
  utils: {

    getExchangeRate: function(token, currency) {
      return new Promise(resolve => {
        spark.utils.ajax(`https://min-api.cryptocompare.com/data/generateAvg?fsym=${token}&tsym=${currency}&e=CCCAGG`)
          .then(function(result) {
            resolve(result.RAW.PRICE);
          })
          .catch(function(e) {
            console.log(`error: ${e}`);
          });
      });
    },

    getAddress: function(account) {
      return new Promise(resolve => {
        if (account.startsWith('xpub')) {
          console.log('xpub coming soon.')
          swal("Sorry", "XPUB coming soon :(", "error");
        } else {
          resolve(account);
        }
      });
    },

    latestTx: function(url) {
      return new Promise(resolve => {
        spark.utils.ajax(url)
          .then(function(result) {
            console.log(result);
            let id = '0';
            if (result.txs.length > 0) {
              id = result.txs[0].txid;
            }
            console.log(id);
            resolve(id);
          })
          .catch(function(e) {
            console.log(`error: ${e}`);
          });
      });
    },

    verify: function(url, initial, price) {
      return new Promise(resolve => {
        spark.utils.ajax(url)
          .then(function(result) {
            let status = false;
            let latest = '0';
            let found = 0;
            let temp = 0;
            let expected = parseFloat(price).toFixed(8);
            if (result.txs.length > 0) {
              latest = result.txs[0].txid;
              temp = result.txs[0].vout[0].value;
              if (latest != initial) {
                app.$data.locked = result.txs[0].txlock;
                result.txs[0].vout.forEach(function(output) {
                  if (output.scriptPubKey.addresses[0] === app.$data.address) {
                    found = output.value;
                    app.$data.price.received = found;
                  }
                });
              }
            }
            console.log(result);
            console.log(`expected amount: ${expected}`);
            console.log(`found amount: ${found}`);
            console.log(`actual found: ${temp}`);
            if (latest != initial && found >= expected && expected != 0) {
              status = true;
            }
            resolve(status);
          })
          .catch(function(e) {
            console.log(`error: ${e}`);
          });
      });
    },

    ajax: function(url) {
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(JSON.parse(this.responseText));
        };
        xhr.onerror = reject;
        xhr.open('GET', url);
        xhr.send();
      });
    }

  }
};
