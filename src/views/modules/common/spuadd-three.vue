<!--  -->
<template>
  <div>
    <div slot="header" class="clearfix">
      <span>选择销售属性</span>
      <el-form ref="saleform">
        <el-form-item
          :label="attr.attrName"
          v-for="(attr,aidx) in dataSaleAll.saleAttrs"
          :key="attr.attrId"
        >
          <el-input v-model="dataSaleAll.tempSaleAttrs[aidx].attrId" type="hidden" v-show="false"></el-input>
          <el-checkbox-group v-model="dataSaleAll.tempSaleAttrs[aidx].attrValues">
            <el-checkbox
              v-if="dataSaleAll.saleAttrs[aidx].valueSelect != ''"
              :label="val"
              v-for="val in dataSaleAll.saleAttrs[aidx].valueSelect.split(';')"
              :key="val"
            ></el-checkbox>
            <div style="margin-left:20px;display:inline">
              <el-button
                v-show="!inputVisibleCopy[aidx].view"
                class="button-new-tag"
                size="mini"
                @click="showInput(aidx)"
              >+自定义</el-button>
              <el-input
                v-show="inputVisibleCopy[aidx].view"
                v-model="inputValueCopy[aidx].val"
                :ref="'saveTagInput'+aidx"
                size="mini"
                style="width:150px"
                @keyup.enter.native="handleInputConfirm(aidx)"
                @blur="handleInputConfirm(aidx)"
              ></el-input>
            </div>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" @click="step_up(1)">上一步</el-button>
    <el-button type="success" @click="generateSkus">下一步：设置SKU信息</el-button>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    dataSaleAll: {
      //后台返回的当前分类所有销售属性
      saleAttrs: [],
      tempSaleAttrs: []
    },
    inputVisible: {
      type: Array,
      default() {
        return [];
      }
    },
    inputValue: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    //这里存放数据
    return {
      inputVisibleCopy: [],
      inputValueCopy: []
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    inputVisible(v) {
      console.log("inputVisible", v);
      this.inputVisibleCopy = this.inputVisible;
    },
    inputValue(v) {
      console.log("inputValue", v);
      this.inputValueCopy = this.inputValue;
    }
  },
  //方法集合
  methods: {
    showInput(idx) {
      console.log("``````", idx);
      inputVisibleCopy[aidx].view;
      console.log(this.inputVisibleCopy[idx].view);

      this.inputVisibleCopy[idx].view = true;
      // this.$refs['saveTagInput'+idx].$refs.input.focus();
    },
    handleInputConfirm(idx) {
      let inputValue = this.inputValueCopy[idx].val;
      if (inputValue) {
        // this.dynamicTags.push(inputValue);
        if (this.dataSaleAll.saleAttrs[idx].valueSelect == "") {
          this.dataSaleAll.saleAttrs[idx].valueSelect = inputValue;
        } else {
          this.dataSaleAll.saleAttrs[idx].valueSelect += ";" + inputValue;
        }
      }
      this.inputVisibleCopy[idx].view = false;
      this.inputValueCopy[idx].val = "";
    },
    generateSkus() {
      // this.$emit("generateSkus", this.dataSaleAll);
      this.$emit("generateSkus");
    },
    step_up(step) {
      this.$emit("step_up", step);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped>
/* @import url(); 引入公共css类 */
</style>