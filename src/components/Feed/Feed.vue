<template lang="pug">
  .wrapper
    header-main
    joined-group-feed
    //- none-joint-feed
    


</template>

<script>
import NoneJointFeed from './NoneJointFeed';
import JoinedGroupFeed from './JoinedGroupFeed';
import HeaderMain from './Header';
import WriteModal from './WriteModal';

export default {
  name: 'app',
  components: {
    NoneJointFeed,
    JoinedGroupFeed,
    HeaderMain,
    WriteModal
  },

}
</script>


<style lang="sass">




</style>
