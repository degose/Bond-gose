<template lang="pug">
  .modal(v-if="visible" class="is-active")
    .modal-background(@click="closeModal")
    .modal-card
      header.modal-card-head
        p.modal-card-title 글 삭제하기
      section.modal-card-body
        nav.level
          .level-item.has-text-centered
              p 
              strong 회원님, 정말 이 글을 삭제하시겠습니까?
      footer.modal-card-foot
        button.button.is-primary(@click="deletePost") 확인
        button.button(@click="closeModal") 취소
      // level-right 요소로 우측정렬 가능.. 빈 요소라도 level-left는 언제나 필수! 
</template>

<script>
export default {
  props: {
    close_message: {
      type: String,
      default: 'Close Modal'
    },
    is_visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.is_visible
    }
  },
  methods: {
    closeModal(){
      this.visible = false;
    },
    deletegroup(pk){
      console.log('pkstpk::',pk);
      let user_token = window.localStorage.getItem('token');
      this.$http.delete('http://bond.ap-northeast-2.elasticbeanstalk.com/api/post/' + `${pk}`+ '/',
       { headers: {'Authorization' : `Token ${user_token}`}})
                .then(response=> {
                  // this.group_data = response.data;
                  // console.log('this.group_datalist:',this.group_data);
                  // console.log('response:',response);
                })
                .catch(error => console.log(error.response));         
    }
  }
}
</script>
<style lang="sass" scoped>
</style>