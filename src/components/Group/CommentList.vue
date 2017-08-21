<template lang="pug">
              div()
                //- 댓글 리스트 영역
                //- article.media(v-show="showcomment" v-for="comment in comment_data" ref="togglecomment")
                article.media(v-for="comment in comment_data")
                  figure.media-left
                    p.image.is-48x48
                      img.user-img(:src='comment.author.profile_img')
                  .media-content
                    .content
                      p
                        strong {{ comment.author.nickname }}
                        br
                        | {{ comment.content }}
                        br
                        small
                          | {{ comment.created_date }}
                  button.delete(@click="deleteComment(comment.pk, post.pk)")


        
</template>

<script>

export default {
  created(){
    // this.fetchGroupData();
    // this.fetchPostData();
    // this.fetchCommentData();
    // bus.$on('add-post-data')
    // this.deletePost();
  },
  props:['post'],
  data() {
    return {
      write_comment: '',
      visible: false,
      // dropdownpost: false,
      // dropdowncomment: false,
      showcomment: false,
      // like: false,
      // like_or_not: '',
      // write: {
      //   // 텍스트 내용
      //   content:'',
      //   // 그룹 pk값..임의로 정해둠
      //   group: 29
      // },
      author: {},
      // group_data:[],
      post_data:[],
      comment_data:[],
      // target: ''
      pk:'',
      page_num: '',
      pagination:{
        next: '', 
        prev: '',
        all: ''
      },
    }
  },
  components: {
  },
  methods: {
    // writeCommentSubmit(pk){
    //   let user_token = window.localStorage.getItem('token');
    //   let user_img = window.localStorage.getItem('user_img');
    //   let user_nickname = window.localStorage.getItem('user_nickname');
    //   let comment_submit_data = {
    //     post: pk,
    //     content: this.write_comment
    //   }
    //   this.$http.post('http://bond.ap-northeast-2.elasticbeanstalk.com/api/post/comment/', 
    //     comment_submit_data,
    //     { headers: {'Authorization' : `Token ${user_token}`,}})
    //     .then(function (response) {
    //         let data = response.data;
    //     }).catch(function (error) {
    //     console.error(error.message);
    //   });
    // },
    fetchCommentData(post_pk){
      let user_token = window.localStorage.getItem('token');
      let pk = window.localStorage.getItem('this_group');
      // let ppk = post_pk;
      console.log('postpk', post_pk);
      // let post = {
      //   post: ppk
      // }
      this.$http.get('https://api.thekym.com/post/comment/', post_pk,
      // this.$http.get('http://bond.ap-northeast-2.elasticbeanstalk.com/api/group=' + `${pk}` + '/post=' + `${ppk}`,
       { headers: {'Authorization' : `Token ${user_token}`} })
                .then(response=> {
                  this.comment_data = response.data.results;
                  // console.log('this.comment_data:',this.comment_data);
                  console.log('comment::',response);
                })
                .catch(error => console.log(error.response));
    },
    // showComment(e) {
    //   let el = this.$refs.togglecomment
    //   let target = e.target
    //   console.log(el);
    //   console.log(target);
    //   if(el !== target && !el.includes(target)){
    //     // this.visible = false;
    //   this.showcomment = !this.showcomment;
    //   }
    // },
    // addLike(pk) {
    //   let user_token = window.localStorage.getItem('token');
    //   // console.log('pk:',pk);
    //   // console.log('token:',user_token);
    //   // /api/post/<pk>/post-like-toggle
    //   this.$http.post('http://bond.ap-northeast-2.elasticbeanstalk.com/api/post/' + `${pk}`+ '/post-like-toggle/', true,
    //    { headers: {'Authorization' : `Token ${user_token}`}})
    //             .then(response=> {
    //               // console.log('like.response:',response);
    //               let data = response.data;
    //               // this.post.like_count
    //             })
    //             .catch(error => console.log(error.response));
    //   // this.like = !this.like;
    // },
    deleteComment(pk,ppk){
      // console.log(pk);
      // console.log(ppk);
      let post = {
        post: ppk
      }
      let user_token = window.localStorage.getItem('token');
      this.$http.delete('https://api.thekym.com/post/comment/' + `${pk}` + '/',
      { headers: {'Authorization' : `Token ${user_token}`}})
      .then(response => {
        this.$http.get('https://api.thekym.com/post/comment/', post,
        { headers: {'Authorization' : `Token ${user_token}`}})
        .then(response=> {
          this.comment_data = response.data.results;
            // console.log('this.comment_data:',this.comment_data);
            console.log('comment::',response);
          })
          .catch(error => console.log('get-error:',error.response));
        console.log(response);
        })
      .catch(error => console.log('delete-error:',error.response));
    },
  }
}
</script>


<style lang="sass" scoped>
@import "~bulma"
@import "~style"

.group_profile-wrapper
  width: auto
  height: auto
  min-height: 100px
  max-height: 135px
  overflow: hidden

.group_profile_img
  background: url('http://bulma.io/images/placeholders/1280x960.png')
  // overflow: hidden
.user-img
  background: #eee

body
  background: #eee

.page-wrapper
  min-height: 87vh

.card-wrapper
  margin-bottom: 20px


.icon-more
  font-size: 1.5rem
  color: $grey
  &:hover
    color: $bond
  &:focus
    color: $bond
  &:active
    color: $bond



.navbar-burger.burger
  padding-top: 8px
  padding-left: 10px

.dropdownhr
  margin: 5px

.btn-show-comment,
.btn-show-like
  font-size: 1rem
  color: $primary

.fa-heart,
.fa-heart-o
  font-size: 1rem
  margin-top: 1px



</style>
