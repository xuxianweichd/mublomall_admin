import http from "@/utils/httpRequest.js";

export const BucketUrl = "http://mublomall.oss-cn-hangzhou.aliyuncs.com";
export function policy() {
  return new Promise((resolve, reject) => {
    http({
      url: http.adornUrl("/thirdparty/oss/policy"),
      method: "get",
      params: http.adornParams({})
    }).then(({ data }) => {
      resolve(data);
    });
  });
}
