<!--  -->
<template>
  <div>
    <el-form
      ref="spuBaseForm"
      :model="spu"
      label-width="100px"
      size="medium"
      :rules="spuBaseInfoRules"
    >
      <!-- rules配置表单验证 -->
      <el-form-item label="商品名称" prop="spuName">
        <el-input v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="spuDescription">
        <el-input v-model="spu.spuDescription"></el-input>
      </el-form-item>
      <el-form-item label="选择分类" prop="catalogId">
        <category-cascader></category-cascader>
      </el-form-item>
      <el-form-item label="选择品牌" prop="brandId">
        <brand-select></brand-select>
      </el-form-item>
      <el-form-item label="商品重量(Kg)" prop="weight">
        <el-input-number
          size="medium"
          v-model.number="spu.weight"
          :precision="3"
          :step="0.1"
          :max="1000000"
          :min="0"
        ></el-input-number>
        <!-- step每次加减的值  precision精度 max最大值 min最小值 controls-position加减位置 placeholder描述 size标签大小-->
      </el-form-item>
      <el-form-item label="设置积分" prop="bounds">
        <label>金币</label>
        <el-input-number
          size="medium"
          v-model.number="spu.bounds.buyBounds"
          :min="0"
          placeholder="金币"
          controls-position="right"
        ></el-input-number>
        <label style="margin-left:15px">成长值</label>
        <el-input-number
          size="medium"
          v-model.number="spu.bounds.growBounds"
          :max="100"
          :min="0"
          placeholder="成长值"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="商品介绍" prop="decript">
        <!-- <single-upload v-model="spu.decript"></single-upload> -->
        <multi-upload v-model="spu.decript"></multi-upload>
      </el-form-item>
      <el-form-item label="商品图集" prop="images">
        <multi-upload v-model="spu.images" :skus="spu.skus"></multi-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="collectspuBaseInfo">下一步：设置基本参数</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import CategoryCascader from "../common/category-cascader";
import BrandSelect from "../common/brand-select";
import MultiUpload from "@/components/upload/multiUpload";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { CategoryCascader, BrandSelect, MultiUpload },
  props: {
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
    }
  },
  data() {
    //这里存放数据
    return {
      // spu: {
      //   //要提交的数据
      //   spuName: "",
      //   spuDescription: "",
      //   catalogId: 0,
      //   brandId: "",
      //   weight: "",
      //   publishStatus: 0,
      //   decript: [], //商品详情
      //   images: [], //商品图集，最后sku也可以新增
      //   bounds: {
      //     //积分
      //     buyBounds: 0,
      //     growBounds: 0
      //   },
      //   baseAttrs: [], //基本属性
      //   skus: [] //所有sku信息
      // },

      brandIdSub: null,
      catPathSub: null,
      spuBaseInfoRules: {
        spuName: [
          { required: true, message: "请输入商品名字", trigger: "blur" }
        ],
        spuDescription: [
          { required: true, message: "请编写一个简单描述", trigger: "blur" }
        ],
        catalogId: [
          { required: true, message: "请选择一个分类", trigger: "blur" }
        ],
        brandId: [
          { required: true, message: "请选择一个品牌", trigger: "blur" }
        ],
        decript: [
          { required: true, message: "请上传商品详情图集", trigger: "blur" }
        ],
        images: [
          { required: true, message: "请上传商品图片集", trigger: "blur" }
        ],
        weight: [
          {
            type: "number",
            required: true,
            message: "请填写正确的重量值",
            trigger: "blur"
          }
        ]
      }
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    // spu: {
    //   handler(v) {
    //     console.log("深度监听", this.spu);
    //     this.spu = this.spu;
    //   },
    //   deep: true
    // }
  },
  //方法集合
  methods: {
    //* 表单验证通过发起下一步请求(获取当前分类下所有分组以及分组下的所有规格参数)
    collectspuBaseInfo() {
      //spuBaseForm
      this.$refs.spuBaseForm.validate(valid => {
        // console.log("valid", valid);
        if (valid) {
          // this.$emit("showBaseAttrs", this.spu);
          this.$emit("showBaseAttrs");

          // this.$emit("update:spu", v);
        } else {
          return false;
        }
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.brandIdSub = PubSub.subscribe("brandId", (msg, val) => {
      this.spu.brandId = val;
    });
    this.catPathSub = PubSub.subscribe("catPath", (msg, val) => {
      this.spu.catalogId = val[val.length - 1];
    });
    this.$emit("getMemberLevels");
    // this.getMemberLevels();
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {
    // console.log("this.spu更新之前", this.spu);
  }, //生命周期 - 更新之前
  updated() {
    // console.log("this.spu更新之后", this.spu);
  }, //生命周期 - 更新之后
  beforeDestroy() {
    PubSub.unsubsribe(this.brandIdSub);
    PubSub.unsubsribe(this.catPathSub);
  }, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped>
/* @import url(); 引入公共css类 */
</style>