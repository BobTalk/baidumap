/** * @summary: 按钮集合 */
<template>
  <div class="button-list">
    <slot name="btn">
      <el-button class="btn submit" v-if="submitToggle" @click="submitHander">
        {{ submitName }}
      </el-button>
      <el-button
        class="btn temporary"
        v-if="temporaryToggle"
        @click="temporaryHandler"
        >{{ temporaryName }}</el-button
      >
      <el-button
        class="btn temporary sawOA"
        v-if="sawOAToggle"
        @click="sawOAHandler"
        >{{ sawOAName }}</el-button
      >
      <el-button
        class="btn cancle"
        :class="{ dialoguse: inDialog }"
        v-if="cancleToggle"
        @click="cancleHandler"
        >{{ cancleName }}</el-button
      >
    </slot>
  </div>
</template>

<script>
export default {
  name: "BtnList",
  props: {
    inDialog: {
      type: Boolean,
      default: false
    },
    submitToggle: {
      type: Boolean,
      default: true
    },
    temporaryToggle: {
      type: Boolean,
      default: true
    },
    sawOAToggle: {
      type: Boolean,
      default: false
    },
    cancleToggle: {
      type: Boolean,
      default: true
    },
    submitName: {
      type: String,
      default: "提交"
    },
    temporaryName: {
      type: String,
      default: "暂存"
    },
    sawOAName: {
      type: String,
      default: "查看审批"
    },
    cancleName: {
      type: String,
      default: "取消"
    }
  },
  methods: {
    //   提交事件
    submitHander() {
      this.$emit("submitClick");
    },
    // 暂存事件
    temporaryHandler() {
      this.$emit("temporaryClick");
    },
    // 查看审批事件
    sawOAHandler() {
      this.$emit("sawOAClick");
    },
    // 取消事件
    cancleHandler() {
      this.$emit("cancleClick");
    }
  }
};
</script>

<style scoped lang="stylus">
.button-list {
  font-size: 14px;

  .btn {
    font-size: 14px;
    padding: 0 0.2rem;
    line-height: 0.32rem;
    box-sizing: border-box;
    border: 1px solid;
  }

  .submit {
    background: #2761ff;
    border-color: #2761ff;
    color: #fff;
  }

  .temporary {
    background: #fff;
    border-color: #2761ff;
    color: #2761ff;
    margin-left: 0.25rem;
  }

  .cancle {
    background: #fff;
    border-color: #efefef;
    color: #333;
    margin-left: 0.25rem;

    &.dialoguse {
      margin-left: 0.1rem;
    }
  }
}
</style>
