require("dotenv").config();
const { env } = process;
["PUBLIC_PATH", "API_SERVER", "NO_LOGIN", "COOKIE_PATH"].forEach(key =>
  console.log("%s\t: %s", key, env[key])
);
const metaJson = require("./meta.json");
const materialJson = require("../../material.json");
const outputDir = `dist${metaJson.hash}`;
const ossPath = `http://serverless-platform.deepexi.top/materials/${materialJson.materialId}/${outputDir}`;
const isProd = env.MODE == "prod";

// 不能以斜杠结尾
let apiServer = env.API_SERVER;
// 必须以斜杠结尾
let publicPath = env.PUBLIC_PATH || ossPath;
// 打包资源路径应修改为oss上的东西
publicPath = process.env.NODE_ENV === "production" ? ossPath : "";
// 打包文件夹名  dist+物料hash

const config = {
  aliIconFont: "",
  env: {
    mock: {
      "/security": "http://yapi.demo.qunar.com/mock/9638"
    },
    dev: {
      "/security": "http://your.dev.server"
    }
  }
};

let axios = {
  proxy: true
};

// 如果生产指定apiServer, 则使用绝对路径请求api
if (isProd && apiServer) {
  axios = {
    proxy: false,
    baseURL: apiServer
  };
}

module.exports = {
  srcDir: "src/",
  mode: "spa",
  env: {
    NO_LOGIN: env.NO_LOGIN,
    COOKIE_PATH: env.COOKIE_PATH || "/"
  },
  proxy: config.env[env.MODE],
  router: {
    middleware: ["meta", "auth"],
    mode: "hash"
  },
  /*
   ** Build configuration
   */
  generate: {
    dir: outputDir
  },
  build: {
    publicPath,
    extractCSS: isProd,
    babel: {
      plugins: [
        [
          "import",
          {
            libraryName: "vant",
            libraryDirectory: "es",
            style: true
          },
          "vant"
        ]
      ]
    },
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: "移动端商城模板",
    meta: [
      {
        charset: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        "http-equiv": "x-ua-compatible",
        content: "IE=edge, chrome=1"
      },
      {
        hid: "description",
        name: "description",
        content: ""
      }
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href:
          "https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/favicon32x32.png"
      },
      {
        // rel: 'stylesheet',
        // type: 'text/css',
        // href: config.aliIconFont
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: "#5D81F9"
  },
  /**
   * Share variables, mixins, functions across all style files (no @import needed)
   * @Link https://github.com/nuxt-community/style-resources-module/
   */
  styleResources: {
    less: "~assets/var.less"
  },
  css: [
    {
      src: "~assets/global.less",
      lang: "less"
    }
  ],
  plugins: [
    {
      src: "~plugins/axios"
    },
    {
      src: "~/plugins/vant"
    },
    {
      src: "~/plugins/filter"
    }
  ],
  modules: [
    // Doc: https://github.com/nuxt-community/style-resources-module
    "@nuxtjs/style-resources",
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    // Doc: https://github.com/nuxt-community/dotenv-module
    [
      "@nuxtjs/dotenv",
      {
        path: "./"
      }
    ]
  ],
  axios
};
