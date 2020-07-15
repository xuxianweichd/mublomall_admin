      // :action="BucketUrl"

<template>
  <div>
    <el-upload
      :action="Bucket"
      :data="dataObj"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import { policy, BucketUrl } from "./policy";
import { getUUID } from "@/utils";
export default {
  name: "multiUpload",
  props: {
    //图片属性数组
    value: Array,
    //最大上传图片数量
    maxCount: {
      type: Number,
      default: 30
    },
    skus: Array
  },
  data() {
    return {
      Bucket: BucketUrl,
      dataObj: {
        policy: "",
        signature: "",
        key: "",
        ossaccessKeyId: "",
        dir: "",
        host: "",
        uuid: ""
      },
      dialogVisible: false,
      dialogImageUrl: null
    };
  },
  computed: {
    fileList() {
      let fileList = [];
      for (let i = 0; i < this.value.length; i++) {
        fileList.push({ url: this.value[i] });
      }
      // console.log("fileList", fileList);

      return fileList;
    }
  },
  mounted() {},
  methods: {
    emitInput(fileList) {
      let value = [];
      for (let i = 0; i < fileList.length; i++) {
        value.push(fileList[i].url);
      }
      // value.push(fileList[fileList.length - 1].url);
      // console.log("value", value);
      // console.log("skus", this.skus);
      if (value.length > 0 && this.skus) {
        for (let sku of this.skus) {
          console.log("sku", sku);

          for (
            let index = 0;
            index < value.length - sku.images.length;
            index++
          ) {
            sku.images.push({ imgUrl: "", defaultImg: 0 });
          }
        }
      }

      this.$emit("input", value);
    },
    // 删除的时候
    handleRemove(file, fileList) {
      this.emitInput(fileList);
    },
    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    // 上传的时候
    beforeUpload(file) {
      let _self = this;
      return new Promise((resolve, reject) => {
        policy()
          .then(response => {
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessid;
            _self.dataObj.key =
              response.data.dir + "/" + getUUID() + "_${filename}";
            // console.log("这是什么", "_${filename}");
            // console.log("_self.dataObj.key", _self.dataObj.key);
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data.host;
            resolve(true);
          })
          .catch(err => {
            console.log("出错了...", err);
            reject(false);
          });
      });
    },
    // 上传成功的时候
    handleUploadSuccess(res, file) {
      this.fileList.push({
        name: file.name,
        // url: this.dataObj.host + "/" + this.dataObj.dir + "/" + file.name； 替换${filename}为真正的文件名
        url:
          this.dataObj.host +
          "/" +
          this.dataObj.key.replace("${filename}", file.name)
      });
      this.emitInput(this.fileList);
    },
    handleExceed(files, fileList) {
      this.$message({
        message: "最多只能上传" + this.maxCount + "张图片",
        type: "warning",
        duration: 1000
      });
    }
  }
};
</script>
<style>
</style>


