<template lang="pug">
  div(v-cloak)
    .page-wrapper
      .container.grouplist
        .columns.grouplist-wrapper
          
          //- 그룹 정보 영역
          .column.is-3(v-for="group in group_list")
            a(@click.prevent="goGroup(group.pk, $event)")
              .card
                .card-image
                  figure.image.is-desktop-16by9.is-mobile-1by1.is-tablet-2by1.img-grouplist-wrapper
                    img(:src="group.profile_img" alt='Image')
                .card-content
                  .media
                    .media-content.has-text-centered.ellipsis-wrapper
                      p.title.is-4.ellipsis {{ group.name }}

              
          .column.is-3
            .card
              a(@click="openModal")
                .card-image.makegroup
                  figure.image.is-desktop-16by9.is-mobile-1by1.is-tablet-2by1.img-grouplist-wrapper.is-hidden-mobile
                      img(src='../../assets/group-add-hoverx2-tablet.png', alt='Image').is-hidden-tablet.is-hidden-mobile
                      img(src='../../assets/group-add-hoverx2.png', alt='Image').is-hidden-mobile
                .card-content
                  .media
                    .media-content.has-text-centered
                      strong.title.is-4.make-group-title 그룹 만들기
                      
        nav.pagination.is-centered
          button.pagination-previous.pagination-btn(@click="prevPage()" :disabled='pagination.prev === null') 이전 페이지
          button.pagination-next.pagination-btn(@click="nextPage()" :disabled='pagination.next === null') 다음 페이지 
           
      MakingGroupModal(
        ref="my_modal"
        close_message="close lightbox"
      )

</template>

<script>
import MakingGroupModal from '../Group/MakingGroupModal';
export default {
  components: {
    MakingGroupModal
  },
  created() {
    this.getMyGroupList();
  },
  data () {
    return {
      uploadGroupImg: '',
      group_list: [],
      group_pk: '',
      group: {},
      page_num: '',
      pagination:{
        next: '', 
        prev: '',
        all: ''
      },
      my_group_pk:[]
    }
  },
  methods: {
    openModal(){
      this.$refs.my_modal.visible = true;
    },
    getMyGroupList(direction){
      const loadingComponent = this.$loading.open()
      setTimeout(() => loadingComponent.close(), 1 * 1000)
      let user_token = window.localStorage.getItem('token');
      let path = null;
      let page_num = 1;
      if ( this.page_num.trim() === '' ) {
        path = "https://api.thekym.com/group/my-group/?page="+`${page_num}`
      }
      else {
        path = this.pagination[direction];
        page_num = this.page_num;
      }
      this.$http.get(path, 
        {headers: { 'Authorization' : `Token ${user_token}` }}
      )
      .then(response => {
        let data = response.data;
        this.group_list = data.results;
        this.pagination.next = data.next;
        this.pagination.prev = data.previous;
        // 총 페이지 수. 11은 그룹리스트 페이지네이션 기준 값..
        this.pagination.all = Math.ceil(data.count / 11)
        this.$router.push({ path: '/MainPage/', query: { page: `${page_num}` }});
        // console.log(response)
      })
      .catch(error => {
        console.log(error.message);
      })
    },
    // "https://api.thekym.com/group/my-group/?page=2".slice(73)  => "2"
    nextPage(){
      let api_path = this.pagination.next;
      if (api_path !== null) {
      // let first = api_path.indexOf('?page=');
      // let last = api_path.indexOf('&');
      let page_path = api_path.slice(-1);
      this.page_num = page_path
      this.getMyGroupList('next');
      // console.log('작동된다')
      }
    },
    prevPage(){
      let api_path = this.pagination.prev;
      // let last = api_path.indexOf('&');
      // let first = api_path.indexOf('?page=');
      let page_path = api_path.slice(-1);
      this.page_num = page_path

      if(this.page_num >= 3){
      let page_path = api_path.slice(-1);
      this.page_num = page_path;
      this.getMyGroupList('prev');}
      else{
         let path = this.pagination.prev
         this.getMyGroupList('prev');
      }
    },    
    goGroup(pk, e){
      this.$router.push({ path: '/JointGroup/'});
      // this.$router.push({ path: '/JointGroup/', query: { group: `${pk}` }});
      window.localStorage.setItem('this_group',pk);
    }
}}
</script>

<style lang="sass" scoped>
@import "~bulma"
@import "~style"

.make-group-title,
.pagination-btn
  color: $bond
.page-wrapper
  min-height: 87vh
.dropdownhr
  margin: 5px
.grouplist-nav
  margin-top: 100px
  // margin-bottom: 200px
.plusgroup
  background: yellow
.img-grouplist-wrapper
  width: auto
  height: auto
  min-height: 100px
  max-height: 135px
  overflow: hidden
  // background: #eee
.grouplist-wrapper
  min-height: 80vh
  flex-wrap: wrap

.ellipsis-wrapper
  overflow: auto

.ellipsis
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.pagination
  // position: absolute
  // bottom: 0
</style>