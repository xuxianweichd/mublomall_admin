<!--  -->
<template>
  <div>
    <el-switch v-model="draggable" active-text="开启拖拽" inactive-text="关闭拖拽"></el-switch>
    <el-button v-if="draggable" @click="batchSave">批量保存</el-button>
    <el-button type="danger" @click="remove(true)">批量删除</el-button>
    <el-tree
      :data="category"
      :props="defaultProps"
      @node-click="handleNodeClick"
      @node-expand="nodeExpand"
      @node-collapse="nodeCollapse"
      :expand-on-click-node="false"
      show-checkbox
      node-key="catId"
      :default-expanded-keys="expandedKey"
      :draggable="draggable"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      @node-drag-star="handleDragStar"
      @node-drag-enter="handleDragEnter"
      @node-drop="handleDrag"
      ref="menuTree"
    >
      <!-- expand-on-click-node只有在点击到小箭头的时候展开 -->
      <!-- show-checkbox选择框自带全选 -->
      <!-- node-key每个树节点用来作为唯一标识的属性 -->
      <!-- node-collapse关闭时调用 -->
      <!-- node-expand展开时调用 -->
      <!-- default-expanded-keys默认展开的节点 -->
      <!-- draggable 使节点可以拖拽 -->
      <!-- <category
      :expand-on-click-node="false"
      show-checkbox
      :draggable="draggable"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      @node-drag-star="handleDragStar"
      @node-drag-enter="handleDragEnter"
      @node-drop="handleDrag"
      :choose="1"
      ></category>-->
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level < 3"
            type="text"
            size="mini"
            @click="() => append(data)"
          >Append</el-button>
          <el-button type="text" size="mini" @click="() => edit(data)">edit</el-button>
          <el-button
            v-if="node.childNodes.length==0"
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >Delete</el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      :title="type.title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="form" ref="flushForm">
        <el-form-item :label="type.name" :label-width="formLabelWidth" :prop="form.name">
          <el-input :disabled="false" v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="type.ico" :label-width="formLabelWidth" prop="111">
          <el-input v-model="form.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="type.productUnit" :label-width="formLabelWidth" prop="111">
          <el-input v-model="form.productUnit" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog()">取 消</el-button>
        <el-button type="primary" @click="submitData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getCategory } from "@/network/request";
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    return {
      updateNodes: [],
      draggable: false,
      maxLevel: 0,
      value: [0, 0],
      type: {
        title: "",
        name: "分类名称",
        ico: "图标",
        productUnit: "计量单位"
      },
      dialogType: true,
      dialogVisible: false,
      form: {
        name: "",
        parentCid: 0,
        catLevel: 0,
        showStatus: 1,
        sort: 0,
        productUnit: "",
        icon: "",
        catId: null
      },
      // cloneForm: {},
      formLabelWidth: "120px",
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
  methods: {
    handleNodeClick(data) {
      // console.log("asfasf");
      // console.log(data);
    },
    getCategory() {
      this.$http
        .request(this.$url.category + "list/tree", "get", false)
        .then(({ data }) => {
          // console.log("成功获取到菜单数据...", data.data);
          this.category = data.data;
        });
    },
    dialog() {
      // this.form = {
      //   name: "",
      //   parentCid: 0,
      //   catLevel: 0,
      //   showStatus: 1,
      //   sort: 0,
      //   productUnit: "",
      //   icon: "",
      //   catId: null
      // };
      this.dialogVisible = false;
    },
    edit(data) {
      console.log(data.catId);
      this.type.title = "修改分类";
      this.dialogType = true;
      console.log("isShowText", this.isShowText);

      this.dialogVisible = true;
      this.$http
        .request(this.$url.category + `info/${data.catId}`, "get", false, null)
        .then(({ data }) => {
          console.log("获取成功", data);
          data = data.category;
          this.form.catId = data.catId;
          this.form.name = data.name;
          this.form.icon = data.icon;
          this.form.productUnit = data.productUnit;
        });
    },
    append(data) {
      // this.$refs["flushForm"].resetFields();
      // remove(1);
      this.type.title = "添加分类";
      this.dialogType = false;
      this.dialogVisible = true;
      // this.form = { parentCid: data.catId, catLevel: data.catLevel + 1 };
      // this.form = { ...data };
      this.form.parentCid = data.catId;
      this.form.catLevel = data.catLevel;
      // console.log("获取到的菜单", data);
      // console.log(data.children);
      // const newChild =
      //   // catId: data.catId + 1,
      //   // name: "testtest",
      //   // children: []
      //   data.children[1];

      // if (!data.children) {
      //   this.$set(data, "children", []);
      // }
      // data.children.push(newChild);
    },
    remove(node, data) {
      let val = "";
      let name = [];
      let catId = [];
      if (node == true) {
        val = "批量";
        let checkedNodes = this.$refs.menuTree.getCheckedNodes();
        for (let index of checkedNodes) {
          catId.push(index.catId);
          name.push(index.name);
        }
      } else {
        catId = [data.catId];
        name = data.name;
      }
      this.$confirm(`此操作将${val}删除【 ${name} 】菜单, 是否继续?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // let ids = [data.catId];
        this.$http
          .request(this.$url.category + "delete", "get", false, catId)
          .then(({ data }) => {
            this.$message({
              message: `菜单${val}删除成功`,
              type: "success"
            });
            this.getCategory();
            // const parent = node.parent;
            // const children = parent.data.children || parent.data;
            // const index = children.findIndex(d => d.catId === data.catId);
            // children.splice(index, 1);
          });
      });
    },
    submitData() {
      if (this.dialogType) {
        this.eidCategory();
      } else {
        this.addCategory();
      }
    },
    eidCategory() {
      let { catId, name, icon, productUnit } = this.form;
      console.log({ catId, name, icon, productUnit });
      this.$http
        .request(this.$url.category + "update", "post", false, {
          catId,
          name,
          icon,
          productUnit
        })
        .then(({ data }) => {
          this.$message({
            message: "菜单修改成功",
            type: "success"
          });
          this.getCategory();
          this.dialog();
        })
        .catch(err => {
          this.$message({
            message: err,
            type: "success"
          });
        });
    },
    addCategory() {
      this.$http
        .request(this.$url.category + "save", "post", false, this.form)
        .then(({ data }) => {
          this.$message({
            message: "菜单新增成功",
            type: "success"
          });
          this.getCategory();
          this.dialog();
          // const newChild = {
          //   name: this.form.name,
          //   parentCid: 0,
          //   catLevel: 0,
          //   showStatus: 1,
          //   sort: 0,
          //   productUnit: "",
          //   icon: "",
          //   catId: this.form.parentCid + 1,
          //   children: []
          // };
          // // data.children[1];
          // if (!this.demo.children) {
          //   this.$set(this.demo, "children", []);
          // }
          // this.demo.children.push(newChild);
        });
    },
    handleClose(done) {
      // console.log("done", done);
      done();
      // this.$confirm("确认关闭？")
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    nodeExpand(data) {
      // console.log("nodeExpand", data);
      this.expandedKey.push(data.catId);
    },
    nodeCollapse(data) {
      this.expandedKey.splice(
        this.expandedKey.findIndex(item => item === data.catId),
        1
      );
      // console.log("nodeCollapse", data);
    },
    handleDragStar(draggingNode, ev) {
      this.countNodeLevel(draggingNode, 0);
    },
    handleDragEnter(draggingNode, dropNode, type) {
      this.value[0] = 0;
    },
    batchSave() {
      this.$http
        .request(
          this.$url.category + "update/sort",
          "post",
          false,
          this.updateNodes
        )
        .then(({ data }) => {
          this.$message({
            message: "菜单顺序等修改成功",
            type: "success"
          });
          //刷新出新的菜单
          this.getCategory();
          //设置需要默认展开的菜单
          // this.expandedKey = this.pCid;
          this.updateNodes = [];
          // this.maxLevel = 0;
          // this.pCid = 0;
        });
    },
    handleDrag(draggingNode, dropNode, dropType, ev) {
      console.log("handleDrop: ", draggingNode, dropNode, dropType);
      //1、当前节点最新的父节点id
      let pCid = 0;
      let siblings = null;
      if (dropType == "before" || dropType == "after") {
        pCid =
          dropNode.parent.data.catId == undefined
            ? 0
            : dropNode.parent.data.catId;
        siblings = dropNode.parent.childNodes;
      } else {
        pCid = dropNode.data.catId;
        siblings = dropNode.childNodes;
      }
      this.expandedKey.push(pCid);

      //2、当前拖拽节点的最新顺序，
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].data.catId == draggingNode.data.catId) {
          //如果遍历的是当前正在拖拽的节点
          let catLevel = draggingNode.level;
          if (siblings[i].level != draggingNode.level) {
            //当前节点的层级发生变化
            catLevel = siblings[i].level;
            //修改他子节点的层级
            this.updateChildNodeLevel(siblings[i]);
          }
          this.updateNodes.push({
            catId: siblings[i].data.catId,
            sort: i,
            parentCid: pCid,
            catLevel: catLevel
          });
        } else {
          this.updateNodes.push({ catId: siblings[i].data.catId, sort: i });
        }
      }

      //3、当前拖拽节点的最新层级
      console.log("updateNodes", this.updateNodes);
    },
    updateChildNodeLevel(node) {
      if (node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          var cNode = node.childNodes[i].data;
          this.updateNodes.push({
            catId: cNode.catId,
            catLevel: node.childNodes[i].level
          });
          this.updateChildNodeLevel(node.childNodes[i]);
        }
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      //1、被拖动的当前节点以及所在的父节点总层数不能大于3

      //1）、被拖动的当前节点总层数
      // console.log("allowDrop:", draggingNode, dropNode, type);
      //
      // console.log("draggingNode.data", draggingNode.data);

      //当前正在拖动的节点+父节点所在的深度不大于3即可
      // let deep = Math.abs(this.maxLevel - draggingNode.level) + 1;
      // console.log("number", this.maxLevel - draggingNode.level);

      // console.log("深度：", deep);

      // this.maxLevel;
      // if (type == "inner") {
      // console.log(
      //   `this.maxLevel：${this.maxLevel}；draggingNode.data.catLevel：${draggingNode.data.catLevel}；dropNode.level：${dropNode.level}`
      // );
      // return draggingNode.level>dropNode.level

      // if (draggingNode.level <= dropNode.level) {
      // this.countNodeLevel(draggingNode.data);
      if (type == "inner") {
        this.value[1] = 0;
        // this.value = [0, 0];
        // this.countNodeLevel(draggingNode, 0);
        this.countNodeLevel(dropNode, 1);
        // console.log("this.value", this.value);
        // console.log(this.value[0] < this.value[1]);
        if (dropNode.level == 3 && this.value[0] == 0) {
          return this.value[0] < this.value[1];
        }
      } else {
        return this.value[0] <= this.value[1];
      }

      // }
      // // return deep + dropNode.level <= 3;
      // return true;
      // }
      // else {
      //   return deep + dropNode.parent.level <= 3;
      // }
      return true;
    },
    countNodeLevel(node, index) {
      //找到所有子节点，求出最大深度
      // console.log("node.children", node);
      // if (node.children != null && node.children.length > 0) {
      //   // for (let i = 0; i < node.childNodes.length; i++) {
      //   //   console.log("this.maxLevel", this.maxLevel);
      //   //   if (node.childNodes[i].level > this.maxLevel) {
      //   //     this.maxLevel = node.childNodes[i].level;
      //   //   }
      //   //   this.countNodeLevel(node.childNodes[i]);
      //   // }
      //   for (let i in node.children) {
      //     console.log("node.childNodes[index].level", node.children[i].level);
      //     if (node.children[i].level > this.maxLevel) {
      //       this.maxLevel = node.children[i].level;
      //       // this.value = Math.abs(this.maxLevel - this.value);
      //     }
      //     this.countNodeLevel(node.children[i]);
      //   }
      // }
      // if (node.childNodes != null && node.childNodes.length > 0) {
      //   for (let i = 0; i < node.childNodes.length; i++) {
      //     if (node.childNodes[i].level > this.maxLevel) {
      //       this.maxLevel = node.childNodes[i].level;
      //       // this.value[index] = Math.abs(this.maxLevel - this.value[index]);
      //     }
      //     this.countNodeLevel(node.childNodes[i], index);
      //   }
      // }
      if (node.childNodes != null && node.childNodes.length > 0) {
        this.value[index] = this.value[index] + 1;
        this.countNodeLevel(node.childNodes, index);
      }
    },
    allowDrag(draggingNode) {
      // return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
      return true;
    }
  },

  //计算属性 类似于data概念
  // computed: {
  //   isShowText: {
  //     get: function() {
  //       return this.dialogType ? this.form.name : "";
  //     }
  //     // set: function(val) {}
  //   }
  // },
  //监控data中的数据变化
  watch: {},
  //方法集合
  // 生命周期 - 创建完成（可以访问当前this实例）
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
  activated() {}
  // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped>
/* @import url(); 引入公共css类 */
</style>
