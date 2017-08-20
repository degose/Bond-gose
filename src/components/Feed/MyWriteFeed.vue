<template lang="pug">
    div.all-wrapper(v-cloak)
      main-header
      .container
        //- 가입한 그룹의 feed
        .columns
          //- 그룹 정보 영역
          .column.is-3
            .card-content
              //- 가입하기 버튼
              .columns.is-mobile
                button.column.btn-default.btn-fill(@click="openModal") 그룹 만들기
            hr
            .card-content
              .columns.is-mobile
                h3.title.is-5 내 그룹
                  |  · 
                  | 5
            .card-content
              a.columns.is-mobile.group-small-list-group
                article.media.group-small-list
                  figure.media-left
                    p.image.is-32x32
                      img.group-img-small(src='http://bulma.io/images/placeholders/128x128.png')
                p.group-small-name 안녕


          
          
          //- feed 영역
          .column.is-9
            //- div.feed-box(v-show="post_data.length <= 0")
              .card
                .card-content
                  .content
                    | 그룹에 재미있는 이야기를 써보세요.


            //- 컨텐츠가 들어간 글
            div.feed-box
              .card(@add-post-data="addPostData" v-for="(post, i) in post_data")
                header.card-header
                  a.card-header-title.group-name
                    | &nbsp;  
                    | &nbsp;  
                    span.icon.icon-bond
                      img(src="../../assets/btn-bond-normal.svg")
                    | &nbsp;  
                    | 해당 그룹 이름
                .card-content
                  article.media
                    .media-left
                      figure.image.is-64x64.img-user
                        img.user-img(:src='post.author.profile_img', alt='Image')
                    .media-content
                      p.title.is-4.user-name {{ post.author.nickname }}
                      p.subtitle.is-6 {{ post.created_date }}

                    button.delete(@click="deletePost(post.pk, i)")


                  //- 글 (최상위)
                  .content
                    | {{ post.content }}

                    
                  //- 이미지
                  .content(v-if="post.image")
                    figure.image
                      img(:src='post.image')


                
                //- 좋아요, 댓글 개수
                footer.card-footer
                  button(type="submit" @click="addLike(post.pk)").card-footer-item.btn-show-like
                    span.icon-like
                      i.fa.fa-heart-o(v-show="!like")
                      i.fa.fa-heart(v-show="like")
                    | &nbsp;  
                    | {{ post.like_count }}
                  button(@click="showComment($event)").card-footer-item.btn-show-comment
                    | 댓글
                    | {{ post.comment_count }}
                    | &nbsp; 
                    span.icon.is-small(v-show="!showcomment")
                      i.fa.fa-angle-down(aria-hidden='true')
                    span.icon.is-small(v-show="showcomment")
                      i.fa.fa-angle-up(aria-hidden='true')
                      

              .card
                .card-content
                  //- 댓글 작성 영역
                  article.media
                    .media-content.columns.is-mobile
                      .field.column.is-10.is-3-mobile
                        .control
                          textarea.textarea.textarea-comment(placeholder='댓글을 달아주세요.' v-model="write_comment")
                      .field.column.is-2.is-1-mobile
                        .control
                          button.btn-comment.btn-default.is-hidden-mobile(type="button" @click="writeCommentSubmit(post.pk)") 댓글 달기
                          button.btn-comment.btn-default.is-hidden-desktop.is-hidden-tablet(type="button" @click="writeCommentSubmit(post.pk)")
                            span.icon
                              i.fa.fa-pencil
                  
                  //- 댓글 리스트 영역
                  article.media(v-show="showcomment" v-for="comment in comment_data" ref="togglecomment")
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


                    
      main-footer
      MakingGroupModal(ref="my_modal" close_message="close lightbox")
                            

        
</template>

<script>
import MainHeader from '../Header-Footer/MainHeader';
import MakingGroupModal from '../Group/MakingGroupModal';
import MainFooter from '../Header-Footer/MainFooter';

export default {
  components: {
    MainHeader,
    MakingGroupModal,
    MainFooter
  },
  created(){
    this.fetchGroupData();
    this.fetchPostData();
    this.fetchCommentData();
    // bus.$on('add-post-data')
    // this.deletePost();
  },
  watch: {
    deletePost(){}
  },
  data() {
    return {
      write_comment: '',
      visible: false,
      dropdownpost: false,
      dropdowncomment: false,
      showcomment: false,
      like: false,
      like_or_not: '',
      write: {
        // 텍스트 내용
        content:'',
        // 그룹 pk값..임의로 정해둠
        group: 29
      },
      group_data:[],
      post_data:[],
      comment_data:[],
      // target: ''
      pk:'',
    }
  },
  methods: {
    addPostData(o){
      console.log(this.post_data);
      this.post_data.unshift(o);
      console.log(this.post_data);
    },
    openModal(){
      this.$refs.my_modal.visible = true;
    },
    deletePost(pk, i){
      // console.log('pkstpk::',pk);
      // console.log('i', this.post_data[i]);
      // let post_num = this.post_data[i];
      // post_num.splice(0,1);
      // this.post_data.post[i].splice(i, 1);
      console.log('i',this.post_data);
      // console.log('i',post_num);
      let user_token = window.localStorage.getItem('token');
      this.$http.delete('http://bond.ap-northeast-2.elasticbeanstalk.com/api/post/' + `${pk}`+ '/',
       { headers: {'Authorization' : `Token ${user_token}`}})
                .then(response=> {
                  // post_num.splice(0,1);
                  // console.log('i',this.post_data);
                  // console.log('i',post_num);
                  this.post_data.post[i].splice(i, 1);
                })
                .catch(error => console.log(error.response));
    },
    openWriteModal(){
      this.$refs.write_modal.visible = true;
    },
    openLeaveGroupModal(){
      this.$refs.leave_group_modal.visible = true;
    },
    fetchGroupData(){
      let user_token = window.localStorage.getItem('token');
      let pk = window.localStorage.getItem('this_group');
      this.$http.get('http://bond.ap-northeast-2.elasticbeanstalk.com/api/group/' + `${pk}`+ '/',
       { headers: {'Authorization' : `Token ${user_token}`}})
                .then(response=> {
                  this.group_data = response.data;
                  // console.log('this.group_datalist:',this.group_data);
                  // console.log('response:',response);
                })
                .catch(error => console.log(error.response));
    },
    fetchPostData(){
      let user_token = window.localStorage.getItem('token');
      let pk = window.localStorage.getItem('this_group');
      this.$http.get('http://bond.ap-northeast-2.elasticbeanstalk.com/api/post/?group=' + `${pk}`,
       { headers: {'Authorization' : `Token ${user_token}`} })
                .then(response=> {
                  // this.post_data = response.data.results;
                  let data = response.data.results;
                  data.forEach(item => {
                    this.post_data.push(item);
                  });
                  console.log(data);
                  // console.log('this.post_data:',this.post_data);
                })
                // .then(write => {const datalist = Object.values(write);
                // this.datalist = datalist;
                // })
                // 
                // .then(data => console.log(data))
                .catch(error => console.log(error.response));
    },
    deletegroup(){
      let pk = window.localStorage.getItem('this_group');
      console.log(pk)
      let user_token = window.localStorage.getItem('token');
      console.log(user_token)
      this.$http.delete('http://bond.ap-northeast-2.elasticbeanstalk.com/api/group/' + `${pk}` + '/',
                { headers: {'Authorization' : `Token ${user_token}`}})
                .then(response => {
                  // console.log(response)
                  this.$router.push({ path: '/MainPage'});
                })
                .catch(error =>{
                  console.error(error.response)
                  if(error.response.status === 401)
                    alert(error.response.data.detail)
                })
    },
    deletemembership(){
          let pk = window.localStorage.getItem('this_group');
          console.log(pk)
          let user_token = window.localStorage.getItem('token');
          console.log(user_token)
          this.$http.delete('http://bond.ap-northeast-2.elasticbeanstalk.com/api/member/membership/',
                  {group: pk},
                  { headers: {'Authorization' : `Token ${user_token}`}})
                  .then(response => {
                    console.log(response)
                    // this.$router.push({ path: '/NoneJointGroupFeed/', query: { group: `${pk}` }});
                  })
                  .catch(error =>{
                    console.error(error.response)
                    if(error.response.status === 401)
                    alert(error.response.data.detail)
                  })
    },
    writeCommentSubmit(pk){
      let user_token = window.localStorage.getItem('token');
      let comment_data = {
        post: pk,
        content: this.write_comment
      }
      this.$http.post('http://bond.ap-northeast-2.elasticbeanstalk.com/api/post/comment/', 
        comment_data,
        { 
          headers: {
            'Authorization' : `Token ${user_token}`,
            // 'Content-Type': 'multipart/form-data'
          }
        })
        .then(function (response) {
            console.log(response);

        }).catch(function (error) {
        console.error(error.message);
      });
    },
    fetchCommentData(post_pk){
      // let user_token = window.localStorage.getItem('token');
      // let pk = window.localStorage.getItem('this_group');
      // // let ppk = this.post.pk;
      // this.$http.get('http://bond.ap-northeast-2.elasticbeanstalk.com/api/group=' + `${pk}` + '/post=' + `${ppk}`,
      //  { headers: {'Authorization' : `Token ${user_token}`} })
      //           .then(response=> {
      //             this.comment_data = response.data.results;
      //             console.log('this.comment_data:',this.comment_data);
      //           })
      //           // .then(write => {const datalist = Object.values(write);
      //           // this.datalist = datalist;
      //           // })
      //           // 
      //           // .then(data => console.log(data))
      //           .catch(error => console.log(error.response));
    },
    openDropdownPost(e) {
      // this.e.target
      // let el = this.$refs.dropdownpostref
      // let target = e.target
      // console.log(el);
      // console.log(target);
      // if(el !== target && !el.contains(target)){
      //   this.visible = false;
      // }
      // this.dropdownpost = !this.dropdownpost;
    },
    openDropdownComment(e) {
      
      this.dropdowncomment = !this.dropdowncomment;
    },
    showComment(e) {
      let el = this.$refs.togglecomment
      let target = e.target
      // console.log(el);
      // console.log(target);
      // if(el !== target && !el.includes(target)){
      //   // this.visible = false;
      // this.showcomment = !this.showcomment;
      // }
    },
    addLike(pk) {
      let user_token = window.localStorage.getItem('token');
      console.log('pk:',pk);
      console.log('token:',user_token);
      // /api/post/<pk>/post-like-toggle
      this.$http.post('http://bond.ap-northeast-2.elasticbeanstalk.com/api/post/' + `${pk}`+ '/post-like-toggle/',
       { headers: {'Authorization' : `Token ${user_token}`}})
                .then(response=> {
                  // this.like_or_not = response.like_or_not;
                  // console.log('this.group_datalist:',this.group_data);
                  // this.like_or_not = response.data;
                  console.log('like.response:',response);
                })
                .catch(error => console.log(error.response));
      // this.like = !this.like;
    },
    delData(){
      this.$http.delete(this.$store.state.api_write, this.write)
      .then(response => console.log(response)
      //  { return response.json()}
       ).catch(error => console.log(error.message));
    },
  } 
}
</script>


<style lang="sass" scoped>
@import "~bulma"
@import "~style"

.all-wrapper
  background: #eee
body
  // background: #eee

.icon-more
  font-size: 1.5rem
  color: $grey
  &:hover
    color: $bond
  &:focus
    color: $bond
  &:active
    color: $bond
.card
  margin-bottom: 20px



.dropdownhr
  margin: 5px

.group-img-small
  border-radius: 10%

.group-small-list-group
  line-height: 38px
.group-small-list
  margin-bottom: 8px
.group-small-name
  margin-top: -4px

.group-name
  color: $primary

.btn-show-comment,
.btn-show-like
  font-size: 1rem
  color: $primary

.fa-heart,
.fa-heart-o
  font-size: 1rem
  margin-top: 1px

</style>
