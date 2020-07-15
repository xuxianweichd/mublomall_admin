<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :visible.sync="visible"
    :before-close="handleClose"
  >
    <!-- :close-on-click-modal="false" -->
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="采购人id" prop="assigneeId" v-if="dataForm.id">
        <el-input v-model="dataForm.assigneeId" placeholder="采购人id"></el-input>
      </el-form-item>
      <el-form-item label="采购人名" prop="assigneeName" v-if="dataForm.id">
        <el-input v-model="dataForm.assigneeName" placeholder="采购人名"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone" v-if="dataForm.id">
        <el-input v-model="dataForm.phone" placeholder="联系方式"></el-input>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input v-model="dataForm.priority" placeholder="优先级"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status" v-if="dataForm.id">
        <el-input v-model="dataForm.status" placeholder="状态"></el-input>
      </el-form-item>
      <el-form-item label="仓库id" prop="wareId" v-if="dataForm.id">
        <el-input v-model="dataForm.wareId" placeholder="仓库id"></el-input>
      </el-form-item>
      <el-form-item label="总金额" prop="amount" v-if="dataForm.id">
        <el-input v-model="dataForm.amount" placeholder="总金额"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        assigneeId: "",
        assigneeName: "",
        phone: "",
        priority: "",
        status: 0,
        wareId: "",
        amount: "",
        createTime: "",
        updateTime: ""
      },
      dataRule: {
        assigneeId: [
          { required: true, message: "采购人id不能为空", trigger: "blur" }
        ],
        assigneeName: [
          { required: true, message: "采购人名不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "联系方式不能为空", trigger: "blur" }
        ],
        priority: [
          { required: true, message: "优先级不能为空", trigger: "blur" }
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        wareId: [
          { required: true, message: "仓库id不能为空", trigger: "blur" }
        ],
        amount: [{ required: true, message: "总金额不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      // this.$refs.dataForm.resetFields();
      console.log(this.dataForm);

      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/ware/purchase/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.assigneeId = data.purchase.assigneeId;
              this.dataForm.assigneeName = data.purchase.assigneeName;
              this.dataForm.phone = data.purchase.phone;
              this.dataForm.priority = data.purchase.priority;
              this.dataForm.status = data.purchase.status;
              this.dataForm.wareId = data.purchase.wareId;
              this.dataForm.amount = data.purchase.amount;
              this.dataForm.createTime = data.purchase.createTime;
              this.dataForm.updateTime = data.purchase.updateTime;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/ware/purchase/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              assigneeId: this.dataForm.assigneeId,
              assigneeName: this.dataForm.assigneeName,
              phone: this.dataForm.phone,
              priority: this.dataForm.priority,
              status: this.dataForm.status,
              wareId: this.dataForm.wareId,
              amount: this.dataForm.amount,
              createTime: this.dataForm.createTime,
              updateTime: this.dataForm.updateTime
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
            this.handleClose();
          });
        }
      });
    },
    handleClose(done) {
      // console.log(Object.prototype.toString.call(done));
      // console.log(
      //   Object.prototype.toString.call(done) == "[object MouseEvent]"
      // );
      Object.assign(this.dataForm, this.$options.data().dataForm);
      if (Object.prototype.toString.call(done) == "[object Function]") {
        done();
      } else {
        this.visible = false;
      }
    }
  }
};
</script>
