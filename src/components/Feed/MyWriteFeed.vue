<template lang="pug">
    div.all-wrapper(v-cloak)
      main-header
      .container
        //- 가입한 그룹의 feed
        .columns
          //- 그룹 정보 영역
          .column.is-3.is-hidden-mobile
            .card-content
              //- 가입하기 버튼
              .columns.is-mobile
                button.column.btn-default.btn-fill(@click="openModal") 그룹 만들기
            hr
            .card-content
              .columns.is-mobile
                h3.title.is-5 내 그룹
            .card-content(v-for = 'group in group_list')
              a.columns.is-mobile.group-small-list-group(@click="goGroup(group.pk)")
                article.media.group-small-list
                  figure.media-left
                    p.image.is-32x32.group-img-small-wrapper
                      img.group-img-small(:src='group.profile_img')
                p.group-small-name {{group.name}}
            .card-content
              .columns.is-mobile
                router-link(to='/MainPage')
                    span.icon.is-small
                      i.fa.fa-plus-circle(aira-hidden='true')
                    |
                    | 더보기

          //- feed 영역
          .column.is-9
            .feed-box-wrapper
              div.feed-box(v-show="data_list.length <= 0")
                .card
                  .card-content
                    .content
                      | 그룹에 재미있는 이야기를 써보세요.


              div.feed-box
                .card(v-for = "data in data_list")
                  header.card-header
                    a.card-header-title.group-name(@click.prevent ="goGroup(data.group.pk)") 
                      | &nbsp;  
                      | &nbsp;  
                      span.icon.icon-bond
                        img(src="../../assets/btn-bond-normal.svg")
                      | &nbsp;  
                      | {{data.group.name}}
                  .card-content
                    article.media
                      .media-left
                        figure.image.is-64x64.img-user-64.is-1by1
                          img.img-user-profile(:src='data.author.profile_img', alt='Image')
                      .media-content
                        p.title.is-4.user-name {{data.author.nickname}}
                        p.subtitle.is-6 {{calcDate (data.created_date)}}
                      button.delete(@click="deletePost(data.pk)")
                    //- 글 (최상위)
                    .content
                      p(style='white-space: pre-line')
                        | {{data.content}}
                    //- 이미지 - 1개일 때
                    .content
                      figure.image
                        img(:src='data.image')
                .columns
                  .column
                    nav.pagination.is-centered
                      button.pagination-previous.pagination-btn(@click="prevPage()" :disabled='pagination.prev === null') 이전 페이지
                      button.pagination-next.pagination-btn(@click="nextPage()" :disabled='pagination.next === null') 다음 페이지                        

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
  data() {
    return {
      dropdownpost: false,
      dropdowncomment: false,
      showcomment: false,
      like: false,
      data_list: [],
      group_list: [],
      page_num: '',
      pagination:{
        next: '', 
        prev: '',
        all: ''
      },
    }
  },
  created(){
    this.openMywrite();
    this.getMyGroupList();
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
    deletePost(pk){
      let user_pk = window.localStorage.getItem('pk');
      let user_token = window.localStorage.getItem('token');
      let user_nickname = window.localStorage.getItem('user_nickname');
      let confirmPostDelete = confirm(`${user_nickname}` + '님, 정말 이 글을 삭제하시겠습니까?');
      if ( confirmPostDelete === true ){
        this.$http.delete('https://api.thekym.com/post/' + `${pk}`+ '/',
          { headers: {'Authorization' : `Token ${user_token}`}})
          .then(response=> {
            let group_pk = window.localStorage.getItem('this_group');
            this.$http.get('https://api.thekym.com/post/?author=' + `${user_pk}`,
              { headers: {'Authorization' : `Token ${user_token}`} })
              .then(response=> {
                let data = response.data.results;
                let post_data = []
                data.forEach(item => {
                  post_data.push(item);
                });
                this.data_list = post_data;
              })
          })
          .catch(error => {
            if (error.response.status === 403){
              alert('작성자만 요청할 수 있는 작업입니다.');
            }
            console.log(error.response);
          });
      }
    },
    getMyGroupList(){
        let user_token = window.localStorage.getItem('token');
        
        this.$http.get('https://api.thekym.com/group/my-group/', 
          {headers: { 'Authorization' : `Token ${user_token}` }}
        )
        .then(response => {
          this.group_list = response.data.results;
        })
        .catch(error => {
          console.log(error.message);
        })
    },
    openMywrite(direction){
      let pk = window.localStorage.getItem('pk');
      let path = null;
      let page_num = 1;
      if (this.page_num.trim() === ''){
        path = 'https://api.thekym.com/post/?author='+`${pk}` + '&page=' +`${page_num}`
      }
      else{
        path = this.pagination[direction];
        page_num = this.page_num;
      }
      this.$http.get(path)
                .then(response => {
                  let data = response.data;
                  this.data_list = data.results;
                  
                  this.pagination.next = response.data.next;
                  this.pagination.prev = response.data.previous;
                  this.$router.push({ path: '/MyWriteFeed', query: { page: `${page_num}` }});

                })
                .catch(error => console.error(error.response))
    },
    nextPage(){
      let api_path = this.pagination.next;
      if (api_path !== null) {
      let page_path = api_path.slice(-1);
      this.page_num = page_path
      this.openMywrite('next');
      }
    },
    prevPage(){
      let api_path = this.pagination.prev;
      if(this.page_num >= 3){
      let page_path = api_path.slice(-1);
      this.page_num = page_path;
      this.openMywrite('prev');}
      else{
         let path = this.pagination.prev
         this.openMywrite('prev');
      }
    },
    goGroup(pk){
      window.localStorage.setItem('this_group', pk);
      this.$router.push({ path: '/JointGroup/', query: { group: `${pk}` }});
    },
    calcDate(content){
      return content.slice(0,19).split("T").toString().replace(',', ' ').slice(0,-3)
    }
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

.feed-box-wrapper
  min-height: 80vh

.dropdownhr
  margin: 5px
.group-img-small-wrapper
  width: 32px
  height: 32px
  overflow: hidden
  border-radius: 10%

.group-img-small
  width: 100%
  min-height: 100%

.group-small-list-group
  line-height: 38px
.group-small-list
  margin-bottom: 8px
.group-small-name
  margin-top: -4px

.group-name
  color: $primary

.img-user-64
  background: #eee
  width: 64px
  height: 64px
  overflow: hidden
  border-radius: 50%

.img-user-profile
  width: 100%
  height: 100%

.btn-show-comment,
.btn-show-like
  font-size: 1rem
  color: $primary

.fa-heart,
.fa-heart-o
  font-size: 1rem
  margin-top: 1px
.pagination-btn
  color: $bond

</style>
