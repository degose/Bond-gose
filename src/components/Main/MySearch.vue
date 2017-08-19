<template lang="pug">  
div.all-wrapper
  .page-wrapper
    .container
      .columns
        .column.is-10.is-offset-1
          .box.fetched-data
            article.media.fetched-data-item(v-for = "group in group_list")
              a(@click.prevent ="goGroup(group.pk, $event)")
                .media-left
                  figure.image.is-64x64
                    img(:src='group.profile_img', alt='Image')
                .media-content
                  .content
                    p
                      strong {{group.name}}
                      br
                      |           {{group.description}}
                    div
                      span.icon.is-small.member
                        i.fa.fa-users(aria-hidden='true')
                      small    {{group.num_of_members}}
                      span.icon.is-small.leader
                        i.fa.fa-user-circle-o(aria-hidden='true')
                      small    {{group.owner.nickname}}

      .columns
        .column
          nav.pagination.is-centered
            a.pagination-previous(@click="prevPage()") 이전 페이지
            a.pagination-next(@click="nextPage()") 다음 페이지 


</template>

<script>
export default {
  data(){
    return{
      group_list: [],
      page_num: '',
      pagination:{
        next: '', 
        prev: ''
      }
    }
  },
  created(){
    this.fetched();
  },
  methods: {
    // fetched(){
    //   let search = window.localStorage.getItem('searchKeyword');
    //   this.$http.get('http://bond.ap-northeast-2.elasticbeanstalk.com/api/'+'group/?search='+`${search}`)
    //             .then(response => {
    //               this.group_list = response.data.results;
    //               console.log(this.group_list);
    //               // this.$router.push({ path: '/SearchResult/group/', query: { search: `${search}` }});
    //             })
    //             .catch(error => console.error(error.message))
    // },
    fetched(direction){
      let path = null;
      let search = null;
      if ( this.page_num.trim() === '' ) {
        search = window.localStorage.getItem('searchKeyword');
        path = 'http://bond.ap-northeast-2.elasticbeanstalk.com/api/group/?search='+`${search}`;
      }
      else {
        path = this.pagination[direction];
        search = this.page_num;
      }
      this.$http
          .get(path)
          .then(response => {
            let data = response.data;
            this.group_list = data.results;
            this.pagination.next = data.next;
            this.pagination.prev = data.previous;
            this.$router.push({ path: '/SearchResult/group/', query: { search: `${search}` }});
          })
          .catch(error => console.error(error.message));
    },
    nextPage(){
      let api_path = this.pagination.next;
      let first = api_path.indexOf('?page=');
      let last = api_path.indexOf('&');
      let page_path = api_path.slice(first, last);
      this.page_num = page_path[page_path.length - 1];
      this.fetched('next');
      // let path = this.$route.path;
      // let query = {
      //   search: page_num
      // }
      // this.$router.push({
      //   path, query
      // });
    },
    prevPage(){
      let api_path = this.pagination.prev;
      let first = api_path.indexOf('?page=');
      let last = api_path.indexOf('&');
      let page_path = api_path.slice(first, last);
      this.page_num = page_path[page_path.length - 1];
      this.fetched('prev');
    },
    goGroup(pk, e){
      let user_token = window.localStorage.getItem('token');
      this.$http.get('http://bond.ap-northeast-2.elasticbeanstalk.com/api/group/my-group/', 
        {headers: { 'Authorization' : `Token ${user_token}` }}
      )
      .then(response => {
        let data = response.data.results;
        let data_pk = []
        console.log('data::',data);
        data.pk.forEach(item => {
          // if(data.includes(pk))
          data_pk.push(item);
        });
        console.log('data_pk::',data_pk);
      })
      .catch(error => {
        console.log(error.message);
      })

      // if(this.data.includes(pk)){
      //   this.$router.push({ path: '/JointGroup/', query: { group: `${pk}` }});
      // } else {
        //   this.$router.push({ path: '/NoneJointGroupFeed/', query: { group: `${pk}` }});
      // }
        this.$router.push({ path: '/NoneJointGroupFeed/', query: { group: `${pk}` }});

        // this.$router.push({ path: '/JointGroup/', query: { group: `${pk}` }});
      window.localStorage.setItem('this_group',pk);
      // this.$http.get('http://bond.ap-northeast-2.elasticbeanstalk.com/api/group/')
      // console.log(pk);
    }
  },
  watch: {
    $route(newVal, oldVal) {
      newVal.query.search !== oldVal.query.search && this.fetched();
    },
  },
}
</script>

<style lang="sass" scoped>
@import "~bulma"
@import "~style"
.all-wrapper
  background: #eee
  // height: 100vh
.page-wrapper
  min-height: 87vh

</style>
