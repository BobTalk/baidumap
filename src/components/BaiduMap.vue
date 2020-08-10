/* eslint-disable */ /** * @summary: 百度地图 */
<template>
  <div>
    <baidu-map
      style="height: 100vh"
      class="map"
      :center="center"
      :zoom="zoom"
      @ready="handler"
      :scroll-wheel-zoom="false"
      ak="nPLzTYCVl8nTAVPLgHXHfEDdieBTHSMY"
    >
      <!--缩放 放大  -->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
      <bm-marker :position="center" :dragging="true" @dragend="dragendHandle"></bm-marker>
      <bm-view
        :style="{
          width: '100%',
          height: '100%',
          flex: 1,
          marginBottom: '-30px'
        }"
      ></bm-view>
      <bm-control :offset="{ top: '15px', left: '15px' }">
        <div class="search-btn">
          <el-input v-model="keyword" placeholder="请输入地址wq" @input="inputHandler"></el-input>
          <p @click="handlerInput(keyword)" class="map-btn">搜索d</p>
        </div>
        <div class="item-list" v-show="clickToggle" style=" height: calc(100vh - 50)">
          <p
            v-for="(i, idx) in searchCompleteData"
            :key="idx + _uid"
            @click="itemhandler(i)"
          >{{ i.province }}{{ i.city }}{{ i.district }}{{ i.name }}</p>
        </div>
        <!-- 这里指代一个自定义搜索框组件 -->
      </bm-control>
    </baidu-map>
  </div>
</template>

<script>
import {
  BaiduMap,
  BmControl,
  BmNavigation,
  BmView,
  BmMarker,
  BmGeolocation
} from "vue-baidu-map";
export default {
  name: "mapDialog",
  props: {
    address: {
      type: String,
      default: ""
    }
  },
  components: {
    BaiduMap,
    BmNavigation,
    BmView,
    BmControl,
    BmMarker,
    BmGeolocation
  },
  computed: {},
  data() {
    return {
      isSite: false, //控制是否有经纬度
      keywordCopy: "",
      clickToggle: false,
      searchCompleteData: [],
      keyword: "",
      cityVal: "",
      cascaderVal: "",
      cascaderProps: {
        value: "label",
        label: "regionName",
        lazy: true,
        lazyLoad: (node, resolve) => {
          this.getCityData(node, resolve);
        }
      },
      cascaderOptions: [],
      center: {},
      zoom: 18,
      // 经纬度 以及 街道信息
      locData: {
        longitude: "",
        latitude: "",
        address: ""
      }
    };
  },
  methods: {
    // 点击下拉数据事件
    itemhandler(item) {
      this.clickToggle = false;
      let keyword = item.province + item.city + item.district + item.name;
      this.keyword = keyword;
      this.handlerInput(keyword);
    },
    // 关键字搜索
    handlerInput(keyword = "") {
      if (!keyword) return;
      this.$axios
        .get("/place/v2/suggestion", {
          headers: {
            "Content-Type": "application/json",
            charset: "utf-8"
          },
          params: {
            ak: "nPLzTYCVl8nTAVPLgHXHfEDdieBTHSMY",
            query: keyword,
            region: "上海",
            city_limit: false, //取值为"true"，仅返回region中指定城市检索结果
            output: "json"
          }
        })
        .then(res => {
          let rs = res?.data?.result;
          if (!rs) {
            this.$message.info(res?.data?.message);
            return;
          }
          this.getLoctionSuccess({
            lng: rs[0]?.location?.lng,
            lat: rs[0]?.location?.lat
          });
        });
    },
    // 根据经纬度查出对应的建筑物
    siteToName(site) {
      // let _this = this;
      let point = new window.BMap.Point(site.lng, site.lat);
      let gc = new window.BMap.Geocoder();
      gc.getLocation(point, function(rs) {
        console.log(rs);
      });
    },
    // 通过地理位置查找对应的经纬度
    nameTosite(addressName) {
      this.$axios
        .get("/geoconv/v3/", {
          headers: {
            "Content-Type": "application/json",
            charset: "utf-8"
          },
          params: {
            ak: "nPLzTYCVl8nTAVPLgHXHfEDdieBTHSMY",
            address: addressName,
            output: "json"
          }
        })
        .then(res => {
          let site = {
            lng: res.data.result[0].x,
            lat: res.data.result[0].y
          };
          console.log(site, "根据name查询回来的");
        });
    },
    // 初始masker拖拽
    dragendHandle({ point }) {
      this.getLoctionSuccess(point);
    },
    // 添加拖拽事件
    markerDrageHandler(myMarker) {
      var p = myMarker.getPosition(); // 拖拽后的经纬度
      this.siteToName(p);
    },
    // 设置位置标识
    getLoctionSuccess(point) {
      let myMarker = new window.BMap.Marker(
        new window.BMap.Point(point.lng, point.lat)
      );
      myMarker.enableDragging();
      this.markerDrageHandler(myMarker);
      myMarker.addEventListener("dragend", () => {
        this.markerDrageHandler(myMarker);
      }); // 监听图标拖拽事件
      this.center = point;
      window?.map?.clearOverlays();
      window.map.addOverlay(myMarker);
    },
    // 根据关键字查询
    selectData(keyword) {
      this.$axios
        .get("/place/v2/suggestion", {
          headers: {
            "Content-Type": "application/json",
            charset: "utf-8"
          },
          params: {
            ak: "nPLzTYCVl8nTAVPLgHXHfEDdieBTHSMY",
            query: keyword,
            region: " ",
            city_limit: false, //取值为"true"，仅返回region中指定城市检索结果
            output: "json"
          }
        })
        .then(res => {
          this.searchCompleteData = res?.data?.result || [];
          this.clickToggle = this.searchCompleteData.length;
        });
    },
    // input 框事件
    inputHandler(newVal) {
      if (!newVal) {
        this.searchCompleteData = [];
        return;
      }
      this.clickToggle = true;
      this.selectData(newVal);
    },
    //   页面加载完成 则执行
    handler({ BMap, map }) {
      window.map = map;
      window.BMap = BMap;
      if (this.isSite) {
        //是否有经纬度
        this.dragendHandle({
          point: {
            lng: 121.48789949,
            lat: 31.24916171
          }
        });
        window.map.clearOverlays();
      } else {
        this.keyword = "闵行区旭辉集团";
        this.handlerInput("闵行区旭辉中心");
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.map {
  >>>.BMap_cpyCtrl {
    display: none;
  }

  .item-list {
    background: #FFF;
    overflow: auto;

    p {
      line-height: 35px;
      padding-left: 20px;
      cursor: pointer;
    }
  }

  >>>.anchorBL {
    display: none;
  }

  .control {
    display: flex;
    align-items: center;

    >>>.el-cascader-panel {
      background: #FFF;
    }

    .city {
      position: relative;

      .select {
        display: none;
        position: absolute;
        top: 0.35rem;
        left: 0;
      }

      &:hover .select {
        display: inline-block;
      }
    }
  }
}

.detail-addr {
  margin: 0.1rem 0.2rem;
}

.btn-list {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.search-btn {
  display: flex;
  align-items: center;
  padding: 5px 5px 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;

  >>>.el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .map-btn {
    height: 0.35rem;
    line-height: 0.35rem;
    padding: 0 15px;
    background: #2761ff;
    color: #fff;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    cursor: pointer;
  }
}
</style>
