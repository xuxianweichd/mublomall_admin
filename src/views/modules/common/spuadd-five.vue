<!--  -->
<template>
  <el-tabs tab-position="left" style="width:98%">
    <el-tab-pane
      :label="group.attrGroupName"
      v-for="(group,gidx) in dataResp.attrGroups"
      :key="group.attrGroupId"
    >
      <!-- 遍历属性,每个tab-pane对应一个表单，每个属性是一个表单项  spu.baseAttrs[0] = [{attrId:xx,val:}]-->
      <el-form ref="form">
        <el-form-item :label="attr.attrName" v-for="(attr,aidx) in group.attrs" :key="attr.attrId">
          <el-input v-model="dataResp.baseAttrs[gidx][aidx].attrId" type="hidden" v-show="false"></el-input>
          <el-select
            v-model="dataResp.baseAttrs[gidx][aidx].attrValues"
            :multiple="attr.valueType == 1"
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入值"
          >
            <el-option
              v-for="(val,vidx) in attr.valueSelect.split(';')"
              :key="vidx"
              :label="val"
              :value="val"
            ></el-option>
          </el-select>
          <el-checkbox
            v-model="dataResp.baseAttrs[gidx][aidx].showDesc"
            :true-label="1"
            :false-label="0"
          >快速展示</el-checkbox>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    dataResp: {}
  },
  data() {
    //这里存放数据
    return {};
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {},
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