/** * @summary: Home */
<template>
  <div class="home">
    <BaiduMap></BaiduMap>
  </div>
</template>

<script>
import BaiduMap from "../components/BaiduMap";
export default {
  name: "Home",
  components: {
    BaiduMap
  },
  created() {},
  data() {
    return {};
  }
};
</script>

<style scoped lang="stylus"></style>
