<!--  -->
<template>
  <el-dialog title="关联规格" :visible.sync="relationVisible" width="30%">
    <el-dialog width="40%" title="选择属性" :visible.sync="innerVisible" append-to-body>
      <div>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getNoReationList()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          @selection-change="innerSelectionChangeHandle"
          style="width: 100%;"
        >
          <el-table-column type="selection" header-align="center" align="center"></el-table-column>
          <el-table-column prop="attrId" header-align="center" align="center" label="属性id"></el-table-column>
          <el-table-column prop="attrName" header-align="center" align="center" label="属性名"></el-table-column>
          <el-table-column prop="icon" header-align="center" align="center" label="属性图标"></el-table-column>
          <el-table-column prop="valueSelect" header-align="center" align="center" label="可选值列表"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRealtion">确认新增</el-button>
      </div>
    </el-dialog>
    <el-button type="primary" @click="addRelation">新增关联</el-button>
    <el-button type="danger" @click="batchDeleteRelation">批量删除</el-button>
    <el-table
      ref="multipleTable"
      :data="relationAttrs"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="attrId" label="id" width="120"></el-table-column>
      <el-table-column prop="attrName" label="属性名" width="120"></el-table-column>
      <el-table-column prop="valueSelect" label="可选值" show-overflow-tooltip></el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection()">取消选择</el-button>
    </div>
  </el-dialog>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      relationVisible: false,
      attrGroupId: 0,
      catId: 0,
      innerVisible: false,
      dataListLoading: false,
      dataList: [],
      relationAttrs: [],
      dataListSelections: [],
      innerdataListSelections: [],
      dataForm: {
        key: ""
      },
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    selectionChangeHandle(val) {
      console.log("当前选中的对象", val);

      this.dataListSelections = val;
    },
    innerSelectionChangeHandle(val) {
      console.log(val);

      this.innerdataListSelections = val;
    },
    addRelation() {
      this.getNoReationList();
      this.innerVisible = true;
    },
    init(attrGroupId, catelogId) {
      // console.log("id", id);
      this.attrGroupId = attrGroupId || 0;
      this.catId = catelogId || 0;
      this.relationVisible = true;
      this.getReationList();
    },
    getReationList() {
      this.$http({
        url: this.$http.adornUrl(
          "/product/attrgroup/" + this.attrGroupId + "/attr/relation"
        ),
        method: "get",
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        // console.log(data.page);

        this.relationAttrs = data.page.list;
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    batchDeleteRelation() {
      let postData = [];
      this.dataListSelections.map(item => {
        postData.push({ attrId: item.attrId, attrGroupId: this.attrGroupId });
      });
      this.$http
        .request("/product/attrgroup/relation/delete", "post", false, postData)
        .then(({ data }) => {
          this.$message({
            message: "批量删除成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getReationList();
            }
          });
        });
    },
    getNoReationList() {
      console.log("进入");

      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(
          // "/product/attrgroup/" + this.attrGroupId + "/noattr/relation"
          "/product/attrgroup/" + this.catId + "/noattr/relation"
        ),
        method: "get",
        params: this.$http.adornParams({
          // attrGroupId: this.attrGroupId,
          // catId: this.catelogId,
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    submitAddRealtion() {
      if (this.innerdataListSelections.length > 0) {
        const postData = this.innerdataListSelections.map(item => {
          return { attrId: item.attrId, attrGroupId: this.attrGroupId };
        });
        this.$http
          .request("/product/attrgroup/attr/relation", "post", false, postData)
          .then(({ data }) => {
            if (data.code == 0) {
              this.$message({ type: "success", message: "新增关联成功" });
            }
            this.getNoReationList();
            this.init(this.attrGroupId, this.catId);
          });
      }
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    console.log("创建完成");
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