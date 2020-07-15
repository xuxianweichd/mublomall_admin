const product = "/product/";
const member = "/member/";
const productUrl = {
  categorybrandrelation: product + "categorybrandrelation/",
  category: product + "category/",
  brand: product + "brand/",
  attr: product + "attr/",
  attrgroup: product + "attrgroup/",
  attattrgroupr: product + "attattrgroupr/"
};
const memberUrl = {
  memberlevel: member + "memberlevel/"
};
const url = { ...memberUrl, ...productUrl };
export default url;
