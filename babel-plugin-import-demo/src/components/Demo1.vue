<template>
  <div class="demo1">
    <van-tabs v-model="active">
      <van-tab title="tab1" name="1">
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid veniam minima reprehenderit, quaerat accusamus ratione, magni pariatur optio voluptate debitis, laboriosam vel dolore deleniti corporis. Libero excepturi quas explicabo asperiores!</p>
      </van-tab>
      <van-tab title="tab2" name="2">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore eius cumque quaerat quae ea. Vel aliquid non corrupti amet, ea temporibus iusto voluptatum nobis tempore reiciendis, quis accusamus ducimus sit?Possimus id quasi a dolor, porro accusamus hic nesciunt in iusto libero corporis, sint itaque fuga accusantium? Nisi dolorem aperiam impedit molestias assumenda ipsum odio. Nemo quod ut nam rem.</p>
      </van-tab>
      <van-tab title="tab3" name="3">
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora blanditiis nemo vel maiores voluptas magni neque aperiam libero ullam nobis totam quaerat, laudantium, quidem, alias nostrum quod consequatur saepe! Qui.
        Assumenda minima aliquam animi delectus eos laudantium libero quo ipsam in iure repellat debitis earum totam, minus, sint nihil. Voluptatibus dolorem consequatur placeat eum minima aliquid vitae dolores. Unde, vel.
        Repellendus ducimus autem iusto, consequatur fugit laudantium rerum debitis tempore, fuga dolore delectus similique. Ab provident sit perspiciatis labore tenetur, recusandae ut in error quaerat dicta quia, itaque veniam inventore!</p>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tab, Tabs } from 'vant'
export default {
  name: 'Demo1',
  components: {
    'van-tab': Tab,
    'van-tabs': Tabs
  },
  data () {
    active: 1
  }
}
</script>

<style lang="less" scoped>

</style>
