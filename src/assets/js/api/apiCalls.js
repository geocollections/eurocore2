import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

const api = {
  url: 'https://api.eurocore.rocks/'
};

function fetch (child) {
  return new Promise((resolve, reject) => {
    Vue.http.get(api.url + child, {}).then(response => {
      console.log(response)
      resolve(response);
    }, errResponse => {
      console.log('ERROR: ' + JSON.stringify(errResponse));
      reject(errResponse)
    });
  });
}



export function fetchPage(page) {
  return fetch(`page/?id=${page}&format=json`)
}
