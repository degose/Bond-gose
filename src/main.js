import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import {routes} from './routes';
// import axios from 'axios';

Vue.use(VueRouter);
Vue.use(VueResource);

// Global Settings
// firebase 주소값(App.vue 에서 get,post 주소값은 생략 가능)
// Vue.http.options.root = 'https://bond-43bc3.firebaseio.com/write_text.json';
// Vue.http.options.root = 'https://bond-43bc3.firebaseio.com/signup.json';

// 만약 토큰값이 있다면
// Vue.http.headers.common['Authorization'] = 'Token 값 ';

// // interceptors
// Vue.http.interceptors.push((request, next) => {
//   // request를 가로채서 서버에 통신 요청할 때 변경 사항을 반영
//   console.log(request);
//   if ( request.method === 'POST' ){
//     request.method = 'PUT';
//   }
//   next(response => {
//     // 응답받은 데이터 보여지게 하기
//     response.json = ()=>{ return {data: response.body}};
//   });
// });


// Vue.prototype.$http = axios;
// Vue.http = axios;

// methods: {
//   temp: () => {
//     this.$http.get('api').then(res=>{
//       console.log(res); // res.data
//     });

//     let data = window.JSON.stringify({});

//     this.$http.post('api', data).then(res=>{
//       console.log(res); // res.data
//     });
//   }
// }

const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});