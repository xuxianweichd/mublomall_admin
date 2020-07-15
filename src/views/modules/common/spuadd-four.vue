<!--  -->
<template>
  <div>
    <el-table :data="spu.skus" style="width: 100%">
      <el-table-column label="属性组合">
        <el-table-column
          :label="item.attrName"
          v-for="(item,index) in tableAttrColumn"
          :key="item.attrId"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.attr[index].attrValue }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="商品名称" prop="skuName">
        <template slot-scope="scope">
          <el-input v-model="scope.row.skuName"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="skuTitle">
        <template slot-scope="scope">
          <el-input v-model="scope.row.skuTitle"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="副标题" prop="skuSubtitle">
        <template slot-scope="scope">
          <el-input v-model="scope.row.skuSubtitle"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="价格" prop="price">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price"></el-input>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24">
              <label style="display:block;float:left">
                选择图集 或
                <!-- <label type="“button”"> -->
                <!-- <span style="font-size: 2vw;color:red">+</span> -->
                <!-- <input type="file" :showFile="false" :listType="'text'" /> -->
                <!-- <multi-upload
                    style="display: none"
                    :showFile="false"
                    :listType="'text'"
                    v-model="uploadImages"
                ></multi-upload>-->
                <!-- </label> -->
              </label>
            </el-col>
            <el-col :span="24">
              <el-divider></el-divider>
            </el-col>
            <el-col :span="24">
              <el-card
                style="width:170px;float:left;margin-left:15px;margin-top:15px;"
                :body-style="{ padding: '0px' }"
                v-for="(img,index) in spu.images"
                :key="index"
              >
                <img :src="img" style="width:160px;height:120px" />
                <div style="padding: 14px;">
                  <el-row>
                    <el-col :span="12">
                      <el-checkbox
                        v-model="scope.row.images[index].imgUrl"
                        :true-label="img"
                        false-label
                      ></el-checkbox>
                    </el-col>
                    <el-col :span="12">
                      <el-tag v-if="scope.row.images[index].defaultImg == 1">
                        <input
                          type="radio"
                          checked
                          :name="scope.row.skuName"
                          @change="checkDefaultImg(scope.row,index,img)"
                        />设为默认
                      </el-tag>
                      <el-tag v-else>
                        <input
                          type="radio"
                          :name="scope.row.skuName"
                          @change="checkDefaultImg(scope.row,index,img)"
                        />设为默认
                      </el-tag>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <!-- 折扣，满减，会员价 -->
          <el-form :model="scope.row">
            <el-row>
              <el-col :span="24">
                <el-form-item label="设置折扣">
                  <label>满</label>
                  <el-input-number
                    style="width:160px"
                    :min="0"
                    controls-position="right"
                    v-model="scope.row.fullCount"
                  ></el-input-number>
                  <label>件</label>

                  <label style="margin-left:15px;">打</label>
                  <el-input-number
                    style="width:160px"
                    v-model="scope.row.discount"
                    :precision="2"
                    :max="1"
                    :min="0"
                    :step="0.01"
                    controls-position="right"
                  ></el-input-number>
                  <label>折</label>
                  <el-checkbox
                    v-model="scope.row.countStatus"
                    :true-label="1"
                    :false-label="0"
                  >可叠加优惠</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="设置满减">
                  <label>满</label>
                  <el-input-number
                    style="width:160px"
                    v-model="scope.row.fullPrice"
                    :step="100"
                    :min="0"
                    controls-position="right"
                  ></el-input-number>
                  <label>元</label>
                  <label style="margin-left:15px;">减</label>
                  <el-input-number
                    style="width:160px"
                    v-model="scope.row.reducePrice"
                    :step="10"
                    :min="0"
                    controls-position="right"
                  ></el-input-number>
                  <label>元</label>
                  <el-checkbox
                    v-model="scope.row.priceStatus"
                    :true-label="1"
                    :false-label="0"
                  >可叠加优惠</el-checkbox>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="设置会员价" v-if="scope.row.memberPrice.length>0">
                  <br />
                  <!--   @change="handlePriceChange(scope,mpidx,$event)" -->
                  <el-form-item v-for="(mp,mpidx) in scope.row.memberPrice" :key="mp.id">
                    {{mp.name}}
                    <el-input-number
                      style="width:160px"
                      v-model="scope.row.memberPrice[mpidx].price"
                      :precision="2"
                      :min="0"
                      controls-position="right"
                    ></el-input-number>
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="step_up(2)">上一步</el-button>
    <el-button type="success" @click="submitSkus">下一步：保存商品信息</el-button>
  </div>
</template>

<script>
// import MultiUpload from "@/components/upload/multiUpload";
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    spu: {
      // 要提交的数据
      spuName: "",
      spuDescription: "",
      catalogId: 0,
      brandId: "",
      weight: "",
      publishStatus: 0,
      decript: [], //商品详情
      bounds: {
        //积分
        buyBounds: 0,
        growBounds: 0
      },
      images: [], //商品图集，最后sku也可以新增
      baseAttrs: [], //基本属性
      skus: [] //所有sku信息
    },
    tableAttrColumn: {
      type: Array,
      defalut() {
        return [];
      }
    }
  },
  data() {
    //这里存放数据
    return { uploadImages: [] };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    uploadImages(val) {
      console.log("uploadImages", val);

      //扩展每个skus里面的imgs选项
      let imgArr = Array.from(new Set(this.spu.images.concat(val)));

      //{imgUrl:"",defaultImg:0} 由于concat每次迭代上次，有很多重复。所以我们必须得到上次+这次的总长

      this.spu.skus.forEach((item, index) => {
        let len = imgArr.length - this.spu.skus[index].images.length; //还差这么多
        if (len > 0) {
          let imgs = new Array(len);
          imgs = imgs.fill({ imgUrl: "", defaultImg: 0 });
          this.spu.skus[index].images = item.images.concat(imgs);
        }
      });

      this.spu.images = imgArr; //去重
      // console.log("this.spu.skus", this.spu.skus);
    },
    spu: {
      handler(newspu) {
        // console.log("spu", this.spu);
        if (this.spu) {
        }
      },
      deep: true
    }
  },
  //方法集合
  methods: {
    checkDefaultImg(row, index, img) {
      console.log("默认图片", row, index);
      //这个图片被选中了，
      row.images[index].imgUrl = img; //默认选中
      row.images[index].defaultImg = 1; //修改标志位;
      //修改其他人的标志位
      row.images.forEach((item, idx) => {
        if (idx != index) {
          row.images[idx].defaultImg = 0;
        }
      });
    },
    submitSkus() {
      // this.$emit("submitSkus", this.spu, this.tableAttrColumn);
      this.$emit("submitSkus");
    },
    step_up(step) {
      this.$emit("step_up", step);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {
    console.log("this.spu更新之前", this.spu);
  }, //生命周期 - 更新之前
  updated() {
    console.log("this.spu更新之后", this.spu);
  }, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {
    console.log("进入了组件------------");
  }, //如果页面有keep-alive缓存功能，这个函数会触发
  deactivated() {
    console.log("离开了组件------------");
  }
};
</script>
<style scoped>
/* @import url(); 引入公共css类 */
</style>