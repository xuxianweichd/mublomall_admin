<!--  -->
<template>
  <div>
    <div>
      <el-button @click="closeExpandedKey()">合并列表</el-button>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
    </div>
    <el-tree
      :data="category"
      :props="defaultProps"
      node-key="catId"
      ref="menuTree"
      @node-click="handleNodeClick"
      :filter-node-method="filterNode"
      :highlight-current="true"
      @node-expand="nodeExpand"
      @node-collapse="nodeCollapse"
      :default-expanded-keys="expandedKey"
    >
      <!-- node-key每个树节点用来作为唯一标识的属性 -->
      <!-- node-collapse关闭时调用 -->
      <!-- node-expand展开时调用 -->
      <!-- default-expanded-keys默认展开的节点 -->
      <!-- highlight-current选中是否高亮 -->
    </el-tree>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      filterText: "",
      category: [],
      expandedKey: [],
      defaultProps: {
        // 要展开的键名（分类）
        children: "children",
        // 要显示的键名
        label: "name"
      }
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  //方法集合
  methods: {
    //树节点过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getCategory() {
      this.$http
        .request(this.$url.category + "list/tree", "get", false)
        .then(({ data }) => {
          console.log("成功获取到菜单数据...", data.data);
          this.category = data.data;
        });
    },
    //展开节点添加节点id
    nodeExpand(data) {
      // console.log("nodeExpand", data);
      this.expandedKey.push(data.catId);
    },
    //关闭节点删除节点id
    nodeCollapse(data) {
      this.expandedKey.splice(
        this.expandedKey.findIndex(item => item === data.catId),
        1
      );
      // console.log("nodeCollapse", data);
    },
    handleNodeClick(data, node, component) {
      this.$emit("tree-node-click", data, node, component);
    },
    //关闭节点树
    closeExpandedKey() {
      this.expandedKey = [];
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getCategory();
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