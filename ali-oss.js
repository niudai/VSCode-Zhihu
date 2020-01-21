const OSS = require("ali-oss");
const md5 = require("md5");
const fs = require("fs");
var path = require("path");
const httpClient = require("request-promise");

let zhihu_agent = {
  userAgent: "aliyun-sdk-js/6.1.1 Chrome 81.0.4023.0 on Windows 10 64-bit",
  options: {
    accessKeyId: "STS.NUn1kMAT3Vd1rX5oeVr6j89y2", //
    accessKeySecret: "5XcAJT1xnifo6Vw9Wp3TsbCzBk79g9bY1DUqyAMRPGwy", // access_key
    bucket: "zhihu-pics",
    cancelFlag: false,
    cname: true,
    endpoint: {
      auth: null,
      hash: null,
      host: "zhihu-pics-upload.zhimg.com",
      hostname: "zhihu-pics-upload.zhimg.com",
      href: "https://zhihu-pics-upload.zhimg.com/",
      path: "/",
      pathname: "/",
      port: null,
      protocol: "https:",
      query: null,
      search: null,
      slashes: true
    },
    inited: true,
    internal: false,
    isRequestPay: false,
    region: "oss-cn-hangzhou",
    secure: true,
    stsToken:
      "CAISuQJ1q6Ft5B2yfSjIr5bbetH5rIsS4abacH6Ei2UDfrlG1/zS0Dz2IHpJeXNsA+gZtP01n2hT6/4YlqVrSpRCHnvZdc9355gPeOVzkR6E6aKP9rUhpMCPDQr6UmzkvqL7Z+H+U6mDGJOEYEzFkSle2KbzcS7YMXWuLZyOj+wRDLEQRRLqVSdaI91UKwB+yqodLmCDEfe2LibjmHbLdhQK3DBxkmRi86+y79SB4x7F9j3Ax/QSup76L+rWDbllN4wtVMyujq4kNPjT0C9Q9l1S9axty+5mgW6X4YnFWQQLs0vebruPrYNVQVUnNvRgKcltt+PhkPB0gOvXmrnsxgxFVeMvCH6CGdr8mpObQrrzbY5iKO6hIQDf0tGPK9ztsgg/JG8DMARDd58+MH5sBFkrTDXLOjdFBr9RksbIGoABD0qIVcA4CMJeGoHysYZtNBCvOxuQEDA6mSjTNs3+qlbjHM7MRvGhAo5zHg2YvRQckiOaT/MHFab7f/28bBsdmEg6+pnK3padBYIuYPvvx93/Z+n1Z5XQsEMwZbTbdkn1ksmymVYDbgih2i27AjE+9SDvUGBHTVandDAfADXc9AQ=",
    useFetch: true
  }
};

imageHashAPI = "https://api.zhihu.com/images";

var options = {
  method: "POST",
  uri: imageHashAPI,
  body: {
    image_hash: md5("./captcha"),
    source: "answer"
  },
  headers: {
    cookie: fs.readFileSync(path.join(__dirname, "cookie.txt"), "utf8")
  },
  json: true
};

var fileObject;

var client;

httpClient(options).then(body => {
  fileObject = body.upload_file;
  zhihu_agent.options.accessKeyId = body.upload_token.access_id;
  zhihu_agent.options.accessKeySecret = body.upload_token.access_key;
  zhihu_agent.options.stsToken = body.upload_token.access_token;
  client = new OSS(zhihu_agent.options);
  console.log(body);
  put();
});

async function put() {
  try {
    // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
    let r1 = await client.put(fileObject.object_key, './capcha.jpg');
    console.log(r1);
    let r2 = await client.get(fileObject.object_key);
    console.log(r2);
  } catch (e) {
    console.error(e);
  }
}

// httpClient(imageHashAPI, { method: 'post', headers, body: image_hash, json: true },
// (error, resp) => {
// 	console.log(resp);
// 	console.log(error);
// })

let objectKey = "v2-2a045885b8457b78265f6e1a54738094";

let file = "./capcha.jpg"; // file to be uploaded

// let client = new OSS({
// 	accessKeyId: 'LTAI4Fs1uLCeKuacYVwZMxhm',
// 	accessKeySecret: '5veT15zws9FJjUgup5dvgFKhYFappu',
// 	bucket: 'niudai',
// 	region: 'oss-cn-beijing',
// })
