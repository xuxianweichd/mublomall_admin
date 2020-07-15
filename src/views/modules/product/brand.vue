<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
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
      <el-table-column prop="brandId" header-align="center" align="center" label="品牌id"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="品牌名"></el-table-column>
      <el-table-column prop="logo" header-align="center" align="center" label="品牌logo地址">
        <template slot-scope="scope">
          <el-image style="width:100px;height:80px" :src="scope.row.logo" fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="descript" header-align="center" align="center" label="介绍"></el-table-column>
      <el-table-column
        prop="showStatus"
        header-align="center"
        align="center"
        label="显示状态[1-显示；0-不显示]"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.showStatus"
            :active-value="0"
            active-text="不显示"
            active-color="red"
            :inactive-value="1"
            inactive-text="显示"
            inactive-color="green"
            @change="updateStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="firstLetter" header-align="center" align="center" label="检索首字母"></el-table-column>
      <el-table-column prop="sort" header-align="center" align="center" label="排序"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="relationHandle(scope.row.brandId)">关联分类</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.brandId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.brandId)">删除</el-button>
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
    <relation-update v-if="relationVisible" ref="relationUpdate"></relation-update>
    <!-- @refreshData="getDataList" -->
  </div>
</template>

<script>
import AddOrUpdate from "./brand-add-or-update";
import RelationUpdate from "./brand-group-relation";
export default {
  data() {
    return {
      url: "/product/brand/",
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
  components: {
    AddOrUpdate,
    RelationUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
    relationHandle(groupId) {
      this.relationVisible = true;
      this.$nextTick(() => {
        this.$refs.relationUpdate.init(groupId);
      });
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(this.url + "list/tree"),
        method: "get",
        params: this.$http.adornParams({
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
      console.log("sizeChangeHandle");

      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      console.log("currentChangeHandle");

      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      console.log("selectionChangeHandle");

      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      console.log("addOrUpdateHandle");

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
          url: this.$http.adornUrl(this.url + "delete"),
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
