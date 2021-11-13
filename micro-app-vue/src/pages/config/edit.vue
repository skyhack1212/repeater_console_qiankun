<template>
    <div>
        <a-card :bordered="false">
            <a-breadcrumb>
                <a-breadcrumb-item href="">
                    <a-icon type="home"/>
                </a-breadcrumb-item>
                <a-breadcrumb-item href="">
                    <router-link to="/online">
                        <a-icon type="code-sandbox"/>
                        流量回放
                    </router-link>
                </a-breadcrumb-item>
                <a-breadcrumb-item>
                    <router-link to="/config">
                        <a-icon type="setting"/>
                        配置管理
                    </router-link>
                </a-breadcrumb-item>
                <a-breadcrumb-item>
                    编辑配置
                </a-breadcrumb-item>
            </a-breadcrumb>


            <div id="components-form-demo-advanced-search">
                <a-form v-model="configForms" layout="inline" class="ant-advanced-search-form" @submit="handleSubmit">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="应用名称">
                                <a-input v-model="configForms.appName"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="环境">
                                <a-input v-model="configForms.environment"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="48">
                        <a-col :md="14" :sm="24">
<!--                            <a-tabs v-model="configTab" type="card" @change="callback">-->
                            <a-tabs type="card" @change="callback">
                                <a-tab-pane key="1" tab="配置信息">
                                    <div class="editor-container">
                                        <json-editor ref="jsonEditor" v-model="configJson" />
                                    </div>
                                </a-tab-pane>
                            </a-tabs>
                        </a-col>
                        <a-divider type="vertical" />
                        <a-col :md="9" :sm="24">
<!--                            <a-tabs v-model="helpTab" type="card" @change="callback">-->
                            <a-tabs type="card" @change="callback">
                                <a-tab-pane key="2" tab="配置帮助">
                                    <div class="editor-container">
                                        <json-editor ref="jsonEditor" v-model="configJsonHelp" />
                                    </div>
                                </a-tab-pane>
                            </a-tabs>
                        </a-col>
                    </a-row>
                    <br>
                    <br>
                    <a-form-item
                            :wrapperCol="{ span: 24 }"
                            style="text-align: center"
                    >
<!--                        <a-button @click="back">返回</a-button>-->
                        <a-button>
                            <router-link :to="{name:'Config'}">
                            返回
                            </router-link>
                        </a-button>
                        <a-button type="danger" style="margin-left: 8px" html-type="submit">
                           保存
                        </a-button>
                    </a-form-item>
                </a-form>

            </div>
        </a-card>

    </div>
</template>

<script>
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

    import { config_detail, config_update } from '@/api/repeate'
    // import { getRoleList, getServiceList } from '@/api/manage'

    import { STable, Ellipsis } from '@/components'

    import JsonEditor from '@/components/JsonEditor'

    export default {
        name: 'TableList',
        components: {
            STable,
            Ellipsis,
            JsonEditor
        },
        data () {
            return {
                config_detail,
                config_update,
                moment,
                locale,
                // create model
                configTab: 'first',
                helpTab: 'second',
                visible: false,
                confirmLoading: false,
                mdl: null,
                loading: false,
                isSuccess: false,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询详情
                configForms: {},
                result: {},
                configJson: {},
                updateConfigForm: {
                    id: 0,
                    appName: "",
                    environment: "",
                    config: "",
                },
                configJsonHelp: {
 "degrade": false,
  "exceptionThreshold": 1000,
  "httpEntrancePatterns": [],
  "javaEntranceBehaviors": [],   //录制java方法的入口调用信息
  "javaSubInvokeBehaviors": [],  //录制方法的子调用信息
  "jsonDiffIgnoreList": [
    "$.result"  //填入对比时忽略的jsonpath，支持通配符
  ],
  "pluginIdentities": [
    "SCF"
  ],
  "repeatIdentities": [
    "SCF"
  ],
  "sampleRate": 10000,   //录制抽样比，单位为万分制
  "scfEntranceBehaviors": [
    {
      "classPattern": "com.bj58.*",   //实现类包路径，支持通配符
      "includeSubClasses": false,
      "methodPatterns": [    //录制的方法列表，支持通配符
        "*"
      ]
    }
  ],
  "scfRootPath": "/opt/scf2",   //scf应用安装路径，不配默认为/opt/scf2
  "useTtl": true
                }
            }
        },
        created () {
            // getRoleList({ t: new Date() })
            let configId = Number(this.$route.params.id);
            console.log(configId)
            config_detail({id: configId})
                .then(res => {
                    this.configForms = res.data.data
                    // 将配置信息转换成json对象
                    this.configJson = JSON.parse(this.configForms.config)
                    // console.log(this.configForms)
                })
        },
        computed: {},
        methods: {
            callback(key) {
                console.log(key);
            },
            addConfig () {
                console.log('addConfigForm:', this.configForms)
                this.isSuccess = true
            },
            handleSubmit(e) {
                e.preventDefault();
                console.log('configForms:', this.configForms)
                this.updateConfigForm.id = this.configForms.id
                this.updateConfigForm.appName = this.configForms.appName
                this.updateConfigForm.environment = this.configForms.environment
                // 这里需要注意：需要把json中的\n即回车，替换为空，不然存数据库后的json数据会含有\n
                this.updateConfigForm.config = this.configJson.replace(/\n/g,"")
                // console.log('updateConfigForm:', this.updateConfigForm)
                config_update(this.updateConfigForm)
                    .then(res => {
                        let result = res.data
                        console.log(result)
                        if (res.code === "200"){
                            this.isSuccess = true
                            this.$message.success(`${this.configForms.appName} 编辑成功`)
                        } else {
                            this.$message.error(`${this.configForms.appName} 编辑失败`)
                        }
                        // console.log(this.updateConfigForm)
                    })

            },
            back () {
                this.$router.back(-1);
            }
        }
    }
</script>

<style>
    /* 扩展ant design pro按钮组件颜色 */
    @import '../css/global.less';

    .ant-advanced-search-form {
        padding: 20px;
        background: #fbfbfb;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
    }

    .ant-advanced-search-form .ant-form-item {
        display: flex;
    }

    .ant-advanced-search-form .ant-form-item-control-wrapper {
        flex: 1;
    }

    #components-form-demo-advanced-search .ant-form {
        max-width: none;
    }

    #components-form-demo-advanced-search .search-result-list {
        margin-top: 6px;
        border: 1px dashed #e9e9e9;
        border-radius: 4px;
        background-color: #fafafa;
        min-height: 180px;
        text-align: center;
        padding-top: 20px;
    }
</style>
