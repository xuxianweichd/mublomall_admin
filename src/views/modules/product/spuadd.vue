<!--  -->
<template>
  <div>
    <el-steps :active="step" finish-status="success">
      <el-step v-for="(titles, index) in titles" :key="index" :title="titles"></el-step>
    </el-steps>
    <el-col :span="24" v-show="step==0">
      <el-card class="box-card" style="width:80%;margin:20px auto">
        <spu-add-one
          ref="spuBaseForm"
          :spu="spu"
          @showBaseAttrs="showBaseAttrs"
          @getMemberLevels="getMemberLevels"
        ></spu-add-one>
        <!-- <div style="padding-left:100px"> -->
        <!-- <div style="margin: auto 100px">
          <el-button type="success" @click="collectSpuBaseInfo">下一步：设置基本参数</el-button>
        </div>-->
      </el-card>
    </el-col>
    <el-col :span="24" v-show="step==1">
      <el-card class="box-card" style="width:80%;margin:20px auto">
        <spu-add-two
          :dataGroupAllBaseAll="dataGroupAllBaseAll"
          @generateSaleAttrs="generateSaleAttrs"
          @step_up="step_up"
        ></spu-add-two>
        <!-- <el-button type="primary" @click="step = 0" style="position:relative;
        top:-35.5px">上一步</el-button>-->
        <!-- <div style="margin:auto">
          <el-button type="primary" @click="step = 0">上一步</el-button>
          <el-button type="success" @click="generateSaleAttrs">下一步：设置销售属性</el-button>
        </div>-->
      </el-card>
    </el-col>
    <el-col :span="24" v-show="step==2">
      <el-card class="box-card" style="width:80%;margin:20px auto">
        <spu-add-three
          :dataSaleAll="dataSaleAll"
          :inputVisible="inputVisible"
          :inputValue="inputValue"
          @generateSkus="generateSkus"
          @step_up="step_up"
        ></spu-add-three>
        <!-- <el-card class="box-card">
        </el-card>-->
      </el-card>
    </el-col>
    <el-col :span="24" v-show="step==3">
      <el-card class="box-card" style="width:80%;margin:20px auto">
        <spu-add-four
          :spu="spu"
          :tableAttrColumn="tableAttrColumn"
          @submitSkus="submitSkus"
          @step_up="step_up"
        ></spu-add-four>
        <!-- <el-card class="box-card">
        </el-card>-->
      </el-card>
    </el-col>
    <el-col :span="24" v-show="step==4">
      <el-card class="box-card" style="width:80%;margin:20px auto">
        <h1>保存成功</h1>
        <el-button type="primary" @click="addAgian">继续添加</el-button>
      </el-card>
    </el-col>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import SpuAddOne from "../common/spuadd-one";
import SpuAddTwo from "../common/spuadd-two";
import SpuAddThree from "../common/spuadd-three";
import SpuAddFour from "../common/spuadd-four";
import SpuAddFive from "../common/spuadd-five";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { SpuAddOne, SpuAddTwo, SpuAddThree, SpuAddFour, SpuAddFive },
  data() {
    //这里存放数据
    return {
      titles: ["基本信息", "规格参数", "销售属性", "SKU信息", "保存完成"],
      spu: {
        //要提交的数据
        spuName: "",
        spuDescription: "",
        catalogId: 0,
        brandId: "",
        weight: "",
        publishStatus: 0,
        decript: [], //商品详情
        images: [], //商品图集，最后sku也可以新增
        bounds: {
          //积分
          buyBounds: 0,
          growBounds: 0
        },
        baseAttrs: [], //基本属性
        skus: [] //所有sku信息
      },
      // dataResp: {
      //   //后台返回的所有数据
      //   attrGroups: [],
      //   baseAttrs: [],
      //   saleAttrs: [],
      //   tempSaleAttrs: [],
      //   tableAttrColumn: [],
      //   memberLevels: [],
      //   steped: [false, false, false, false, false]
      // },
      dataGroupAllBaseAll: {
        //后台返回的当前分类所有属性组和基础属性
        attrGroups: [],
        baseAttrs: []
      },
      dataSaleAll: {
        //后台返回的当前分类所有销售属性
        saleAttrs: [],
        tempSaleAttrs: []
      },
      tableAttrColumn: [],
      memberLevels: [],
      steped: [false, false, false, false, false],
      step: 0,
      catelogPath: [],
      catId: 0,
      // inputVisible: [],
      // inputValue: [],
      inputVisible: [],
      inputValue: []
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    catelogPath(path) {
      console.log("path", path);
      // console.log("catelogPath", this.catelogPath);

      this.catId = this.catelogPath[this.catelogPath.length - 1];
    }
  },
  //方法集合
  methods: {
    showBaseAttrs() {
      this.step = 1;
      if (!this.steped[0]) {
        this.$http({
          url: this.$http.adornUrl(
            this.$url.attrgroup + `${this.spu.catalogId}/withattr`
          ),
          method: "get",
          params: this.$http.adornParams({})
        }).then(({ data }) => {
          //先对表单的baseAttrs进行初始化
          data.data.forEach(item => {
            let attrArray = [];
            item.attrs.forEach(attr => {
              attrArray.push({
                attrId: attr.attrId,
                attrValues: "",
                attrName: attr.attrName,
                showDesc: attr.showDesc
              });
            });
            this.dataGroupAllBaseAll.baseAttrs.push(attrArray);
          });
          this.steped[0] = 0;
          this.dataGroupAllBaseAll.attrGroups = data.data;
          console.log("结束第一步", this.dataGroupAllBaseAll);
        });
      }
    },
    generateSaleAttrs() {
      // console.log("dataGroupAllBaseAll", dataGroupAllBaseAll);
      // console.log("this.dataGroupAllBaseAll", this.dataGroupAllBaseAll);

      // this.dataGroupAllBaseAll = dataGroupAllBaseAll;
      //把页面绑定的所有attr处理到spu里面,这一步都要做
      this.spu.baseAttrs = [];
      this.dataGroupAllBaseAll.baseAttrs.forEach(item => {
        item.forEach(attr => {
          let { attrId, attrValues, attrName, showDesc } = attr;
          //跳过没有录入值的属性
          if (attrValues != "") {
            if (attrValues instanceof Array) {
              //多个值用;隔开
              attrValues = attrValues.join(";");
            }
            this.spu.baseAttrs.push({ attrId, attrValues, attrName, showDesc });
          }
        });
      });
      console.log("baseAttrs", this.spu.baseAttrs);
      this.step = 2;
      this.getShowSaleAttr();
    },
    getShowSaleAttr() {
      // console.log("getShowSaleAttrUp");

      //获取当前分类可以使用的销售属性
      if (!this.steped[1]) {
        this.$http({
          url: this.$http.adornUrl(
            this.$url.attr + `sale/list/${this.spu.catalogId}`
          ),
          method: "get",
          params: this.$http.adornParams({
            page: 1,
            limit: 500
          })
        }).then(({ data }) => {
          console.log(data.page.list);
          console.log(data.page);
          this.dataSaleAll.saleAttrs = data.page.list;
          data.page.list.forEach(item => {
            this.dataSaleAll.tempSaleAttrs.push({
              attrId: item.attrId,
              attrValues: [],
              attrName: item.attrName
            });

            this.inputVisible.push({ view: false });
            this.inputValue.push({ val: "" });
            // console.log("this.inputVisible", this.inputVisible);
            // console.log("this.inputValue", this.inputValue);
          });
          this.steped[1] = true;
        });
        // console.log(this.dataSaleAll.tempSaleAttrs);
      }
      console.log("this.dataSaleAll", this.dataSaleAll);

      // console.log("getShowSaleAttrDown");
    },

    generateSkus() {
      console.log("generateSkus");

      // console.log("dataSaleAll", dataSaleAll);
      // console.log("this.dataSaleAll", this.dataSaleAll);
      // this.dataSaleAll = dataSaleAll;
      this.step = 3;

      //根据笛卡尔积运算进行生成sku
      let selectValues = [];
      this.tableAttrColumn = [];
      this.dataSaleAll.tempSaleAttrs.forEach(item => {
        if (item.attrValues.length > 0) {
          selectValues.push(item.attrValues);
          this.tableAttrColumn.push(item);
        }
      });

      let descartes = this.descartes(selectValues);
      //["黑色","6GB","移动"],["黑色","6GB","联通"],["黑色","8GB","移动"],["黑色","8GB","联通"],
      //["白色","6GB","移动"],["白色","6GB","联通"],["白色","8GB","移动"],["白色","8GB","联通"],
      //["蓝色","6GB","移动"],["蓝色","6GB","联通"],["蓝色","8GB","移动"],["蓝色","8GB","联通"]]
      console.log("生成的组合", JSON.stringify(descartes));
      //有多少descartes就有多少sku
      let skus = [];

      descartes.forEach((descar, descaridx) => {
        let attrArray = []; //sku属性组
        descar.forEach((de, index) => {
          //构造saleAttr信息
          let saleAttrItem = {
            attrId: this.tableAttrColumn[index].attrId,
            attrName: this.tableAttrColumn[index].attrName,
            attrValue: de
          };
          attrArray.push(saleAttrItem);
        });
        //先初始化几个images，后面的上传还要加
        let imgs = [];
        this.spu.images.forEach((img, idx) => {
          imgs.push({ imgUrl: "", defaultImg: 0 });
        });

        //会员价，也必须在循环里面生成，否则会导致数据绑定问题
        let memberPrices = [];
        if (this.memberLevels.length > 0) {
          for (let i = 0; i < this.memberLevels.length; i++) {
            if (this.memberLevels[i].priviledgeMemberPrice == 1) {
              memberPrices.push({
                id: this.memberLevels[i].id,
                name: this.memberLevels[i].name,
                price: 0
              });
            }
          }
        }
        //;descaridx，判断如果之前有就用之前的值;

        let res = this.hasAndReturnSku(this.spu.skus, descar);

        if (res === null) {
          skus.push({
            attr: attrArray,
            skuName: this.spu.spuName + " " + descar.join(" "),
            price: 0,
            skuTitle: this.spu.spuName + " " + descar.join(" "),
            skuSubtitle: "",
            images: imgs,
            descar: descar,
            fullCount: 0,
            discount: 0,
            countStatus: 0,
            fullPrice: 0.0,
            reducePrice: 0.0,
            priceStatus: 0,
            memberPrice: new Array().concat(memberPrices)
          });
        } else {
          skus.push(res);
          // for (let sku of skus) {
          //   for (
          //     let index = 0;
          //     index < this.spu.images.length - sku.images.length;
          //     index++
          //   ) {
          //     sku.images.push({ imgUrl: "", defaultImg: 0 });
          //   }
          // }
        }
        this.imgLastLength = imgs.length;
      });
      this.spu.skus = skus;
      console.log("结果!!!", this.spu, this.tableAttrColumn);
    },
    //笛卡尔积运算
    descartes(list) {
      //parent上一级索引;count指针计数
      var point = {};
      var result = [];
      var pIndex = null;
      var tempCount = 0;
      var temp = [];

      //根据参数列生成指针对象
      for (var index in list) {
        if (typeof list[index] == "object") {
          point[index] = { parent: pIndex, count: 0 };
          pIndex = index;
        }
      }

      //单维度数据结构直接返回
      if (pIndex == null) {
        return list;
      }

      //动态生成笛卡尔积
      while (true) {
        for (var index in list) {
          tempCount = point[index]["count"];
          temp.push(list[index][tempCount]);
        }

        //压入结果数组
        result.push(temp);
        temp = [];

        //检查指针最大值问题
        while (true) {
          if (point[index]["count"] + 1 >= list[index].length) {
            point[index]["count"] = 0;
            pIndex = point[index]["parent"];
            if (pIndex == null) {
              return result;
            }

            //赋值parent进行再次检查
            index = pIndex;
          } else {
            point[index]["count"]++;
            break;
          }
        }
      }
    },
    //判断如果包含之前的sku的descar组合，就返回这个sku的详细信息；
    hasAndReturnSku(skus, descar) {
      let res = null;
      // //todo 这里length有错误
      // console.log("skus", skus);
      // console.log("descar", descar);

      if (skus.length > 0) {
        for (let i = 0; i < skus.length; i++) {
          if (skus[i].descar.join(" ") == descar.join(" ")) {
            res = skus[i];
          }
        }
      }
      return res;
    },
    submitSkus() {
      // console.log(this.spu);
      // console.log(spu);

      // if (spu == this.spu) {
      //   console.log("------------spu==this.spu---------");
      // }
      // console.log("submitSkusUp", JSON.stringify(spu));
      // this.spu.push(...spu);
      // this.spu = { ...this.spu, ...spu };
      // this.spu.baseAttrs=spu.baseAttrs;
      // this.spu.skus=spu.skus;
      console.log("submitSkusDown", JSON.stringify(this.spu));
      // this.tableAttrColumn = tableAttrColumn;
      // console.log("spu", spu);
      // console.log("tableAttrColumn", tableAttrColumn);
      // console.log("~~~~~", JSON.stringify(spu));
      // console.log("~~~~~", JSON.stringify(this.spu));
      this.$confirm("将要提交商品数据，需要一小段时间，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/product/spuinfo/save"),
            method: "post",
            data: this.$http.adornData(this.spu, false)
          }).then(({ data }) => {
            if (data.code == 0) {
              this.$message({
                type: "success",
                message: "新增商品成功!"
              });
              this.step = 4;
            } else {
              this.$message({
                type: "error",
                message: "保存失败，原因【" + data.msg + "】"
              });
            }
          });
        })
        .catch(e => {
          console.log(e);
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    step_up(val) {
      console.log("step_up", val);

      this.step = val;
    },
    getMemberLevels() {
      this.$http({
        url: this.$http.adornUrl("/member/memberlevel/list"),
        method: "get",
        params: this.$http.adornParams({
          page: 1,
          limit: 500
        })
      })
        .then(({ data }) => {
          this.memberLevels = data.page.list;
        })
        .catch(e => {
          console.log(e);
        });
    },
    handlePriceChange(scope, mpidx, e) {
      this.spu.skus[scope.$index].memberPrice[mpidx].price = e;
    },
    addAgian() {
      this.step = 0;
      this.resetSpuData();
    },
    resetSpuData() {
      this.spu = {
        spuName: "",
        spuDescription: "",
        catalogId: 0,
        brandId: "",
        weight: "",
        publishStatus: 0,
        decript: [],
        images: [],
        bounds: {
          buyBounds: 0,
          growBounds: 0
        },
        baseAttrs: [],
        skus: []
      };
    }
  },
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