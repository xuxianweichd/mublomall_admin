<!--  -->
<template>
  <el-select ref="groupSelect" filterable v-model="GroupId" placeholder="试试搜索：基本">
    <el-option
      v-for="item in attrGroups"
      :key="item.attrGroupId"
      :label="item.attrGroupName"
      :value="item.attrGroupId"
    ></el-option>
  </el-select>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    //修改回显用
    attrGroupId: {
      default() {
        return "";
      }
    },
    catId: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    //这里存放数据
    return {
      attrGroups: [],
      GroupId: "",
      setting: {
        value: "attrGroupId",
        label: "attrGroupName"
      }
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    catId(v) {
      console.log("进入brand", this.catId);
      if (this.catId != 0) {
        console.log("执行brand", this.catId);
        this.$http
          .request(`/product/attrgroup/list`, "get", false, {
            catId: this.catId,
            page: 1,
            limit: 10000000
          })
          .then(({ data }) => {
            console.log(this.attrGroups);
            console.log(data.page);
            if (data && data.code === 0) {
              this.attrGroups = data.page.list;
              console.log(this.attrGroups);
            } else {
              this.$message.error(data.msg);
            }
            console.log(this.attrGroups);
          });
      }
    },
    attrGroupId(v) {
      this.GroupId = this.attrGroupId;
    }
    // attrGroupId(v) {
    //   console.log("进入brand", this.attrGroupId);
    //   if (this.attrGroupId != 0) {
    //     console.log("执行brand", this.attrGroupId);
    //     this.$http
    //       .request(`/product/attrgroup/list`, "get", false, {
    //         catId: this.catId
    //       })
    //       .then(({ data }) => {
    //         console.log(this.attrGroups);
    //         console.log(data.page);
    //         this.attrGroups = data.page.list;
    //         console.log(this.attrGroups);
    //       });
    //   }
    // }
  },
  //方法集合
  methods: {
    // getDetail() {
    //   // console.log("进入brand", this.catId);
    //   if (catId != 0) {
    //     console.log("执行brand", this.catId);
    //     this.$http
    //       .request(`/product/attrgroup/list`, "get", false, this.catId)
    //       .then(({ data }) => {
    //         this.attrGroups = data.page.list;
    //       });
    //   }
    // }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // this.getDetail();
  },
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