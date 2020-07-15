<!--  -->
<template>
  <el-dialog title="关联分类" :visible.sync="cateRelationDialogVisible" width="30%">
    <!-- trigger="hover" 放上去就显示 -->
    <!-- placement控制出现位置 -->
    <el-popover placement="right-end" v-model="popCatelogSelectVisible">
      <category-cascader :catelogPath="catelogPath"></category-cascader>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="popCatelogSelectVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="addCatelogSelect">确定</el-button>
      </div>
      <!-- slot="reference"控制el-popover的显示 -->
      <el-button slot="reference">新增关联</el-button>
    </el-popover>
    <el-table :data="cateRelationTableData" style="width: 100%">
      <el-table-column prop="id" label="#"></el-table-column>
      <el-table-column prop="brandName" label="品牌名"></el-table-column>
      <el-table-column prop="catelogName" label="分类名"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="deleteCateRelationHandle(scope.row.id,scope.row.brandId)"
          >移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cateRelationDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="cateRelationDialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import CategoryCascader from "../common/category-cascader";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { CategoryCascader },
  data() {
    //这里存放数据
    return {
      popCatelogSelectVisible: false,
      cateRelationDialogVisible: false,
      cateRelationTableData: [],
      catelogPath: [],
      brandId: 0,
      subscribe: null
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    init(id) {
      this.cateRelationDialogVisible = true;
      this.brandId = id;
      this.getCateRelation();
    },
    addCatelogSelect() {
      console.log(this.catelogPath);

      //{"brandId":1,"catelogId":2}
      this.popCatelogSelectVisible = false;
      this.$http({
        url: this.$http.adornUrl(this.$url.categorybrandrelation + "save"),
        method: "post",
        data: this.$http.adornData(
          {
            brandId: this.brandId,
            catelogId: this.catelogPath[this.catelogPath.length - 1]
          },
          false
        )
      }).then(({ data }) => {
        if (data.code) {
          this.$alert(data.msg, "警告", {
            confirmButtonText: "确定"
            // callback: action => {
            //   this.$message({
            //     type: "info",
            //     message: `action: ${action}`
            //   });
            // }
          });
        } else {
          this.getCateRelation();
          this.catelogPath = [];
        }
      });
    },
    deleteCateRelationHandle(id, brandId) {
      this.$http({
        url: this.$http.adornUrl(this.$url.categorybrandrelation + "delete"),
        method: "post",
        data: this.$http.adornData([id], false)
      }).then(({ data }) => {
        this.getCateRelation();
      });
    },
    getCateRelation() {
      this.$http({
        url: this.$http.adornUrl(
          this.$url.categorybrandrelation + "catelog/list"
        ),
        method: "get",
        params: this.$http.adornParams({
          brandId: this.brandId
        })
      }).then(({ data }) => {
        this.cateRelationTableData = data.data;
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.subscribe = PubSub.subscribe("catPath", (meg, val) => {
      this.catelogPath = val;
    });
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {
    PubSub.unsubscribe(this.subscribe); //销毁订阅
  }, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped>
/* @import url(); 引入公共css类 */
</style>