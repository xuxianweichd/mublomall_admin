<!--  -->
<template>
  <el-row type="flex" class="row-bg">
    <el-col :span="6">
      <div class="grid-content bg-purple">
        <category @tree-node-click="treeNodeClick"></category>
      </div>
    </el-col>
    <el-col :span="24">
      <div class="grid-content bg-purple-light">
        <div class="mod-config">
          <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
              <el-input v-model="dataForm.key" placeholder="参数名(不填即查所有）" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="getDataList()">查询</el-button>
              <el-button
                v-if="isAuth('product:brand:save')"
                type="primary"
                @click="addOrUpdateHandle()"
              >新增</el-button>
              <el-button
                v-if="isAuth('product:brand:delete')"
                type="danger"
                @click="deleteHandle()"
                :disabled="dataListSelections.length <= 0"
              >批量删除</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;"
          >
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="attrGroupId" header-align="center" align="center" label="分组id"></el-table-column>
            <el-table-column prop="attrGroupName" header-align="center" align="center" label="组名"></el-table-column>
            <el-table-column prop="sort" header-align="center" align="center" label="排序"></el-table-column>
            <el-table-column prop="descript" header-align="center" align="center" label="描述"></el-table-column>
            <el-table-column prop="icon" header-align="center" align="center" label="组图标"></el-table-column>
            <el-table-column prop="catelogId" header-align="center" align="center" label="所属分类id"></el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="relationHandle(scope.row.attrGroupId,scope.row.catelogId)"
                >关联</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="addOrUpdateHandle(scope.row.attrGroupId)"
                >修改</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row.attrGroupId)">删除</el-button>
              </template>
            </el-table-column>
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
          <!-- 弹窗, 新增 / 修改 -->
          <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
          <relation v-if="relationVisible" ref="relationUpdate">></relation>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content bg-purple"></div>
    </el-col>
  </el-row>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import Category from "../common/category";
import AddOrUpdate from "./attrgroup-add-or-update";
import Relation from "./attrgroup-relation";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    AddOrUpdate,
    Category,
    Relation
  },
  data() {
    return {
      catId: 0,
      attrurl: "/product/attrgroup/",
      cateurl: "/product/category/",
      dataForm: {
        key: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      relationVisible: false
    };
  },
  activated() {
    // this.getDataList();
  },
  methods: {
    relationHandle(attrGroupId, catelogId) {
      this.relationVisible = true;
      this.$nextTick(() => {
        this.$refs.relationUpdate.init(attrGroupId, catelogId);
      });
    },
    treeNodeClick(data, node, component) {
      if (node.childNodes.length == 0) {
        this.catId = data.catId;
        this.getDataList();
      }
    },
    // 获取数据列表
    getDataList() {
      console.log("进入");

      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(this.attrurl + `list`),
        method: "get",
        params: this.$http.adornParams({
          catId: this.catId,
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
    // 获取数据列表
    // getDataList() {
    //   this.dataListLoading = true;
    //   this.$http
    //   .get(url,params,false)
    //   .then(({ data }) => { });
    // },
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
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.brandId;
          });
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl(this.attrurl + "delete"),
          method: "post",
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    updateStatus(data) {
      // console.log(status);
      // let { brandId, showStatus, logo } = status;
      // // if (status.showStatus) {
      // //   status.showStatus = 1;
      // // } else {
      // //   status.showStatus = 1;
      // // }
      // this.$http
      //   // .request(this.url + "update", "post", false, status)
      //   .request(this.url + "update", "post", false, {
      //     brandId,
      //     // showStatus: showStatus ? 1 : 0
      //     logo: "xxx"
      //   })
      //   .then(({ data }) => {
      //     this.$message({
      //       message: "品牌显示修改成功",
      //       type: "success"
      //     });
      //     this.getDataList();
      //   });
      console.log("最新信息", data);
      let { brandId, showStatus } = data;
      //发送请求修改状态
      this.$http({
        url: this.$http.adornUrl("/product/brand/update"),
        method: "post",
        data: this.$http.adornData(
          { brandId, showStatus: showStatus ? 1 : 0 },
          false
        )
      }).then(({ data }) => {
        this.$message({
          type: "success",
          message: "状态更新成功"
        });
      });
    }
  }
};
</script>
<style scoped>
/* @import url(); 引入公共css类 */
</style>