import http from "@/utils/http";
export function getCategory() {
  return http({
    url: http.adornUrl("/product/category/list/tree"),
    method: "get"
    // params: {
    //   iid
    // }
    // params: this.$http.adornParams({
    //   'page': this.pageIndex,
    //   'limit': this.pageSize,
    //   'roleName': this.dataForm.roleName
    // })
    // });
    // .then(({ data }) => {
    // if (data && data.code === 0) {
    //   this.dataList = data.page.list
    //   this.totalPage = data.page.totalCount
    // } else {
    //   this.dataList = []
    //   this.totalPage = 0
    // }
    // this.dataListLoading = false
    // console.log("成功获取到菜单数据", data.data);
    // this.category = data.data;
  });
}
