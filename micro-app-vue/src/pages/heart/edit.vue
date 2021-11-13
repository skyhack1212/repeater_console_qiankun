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
                    <router-link to="/heart">
                        <a-icon type="heart"/>
                        在线模块
                    </router-link>
                </a-breadcrumb-item>
                <a-breadcrumb-item>
                    编辑模块
                </a-breadcrumb-item>
            </a-breadcrumb>


            <div id="components-form-demo-advanced-search">
                <a-form v-model="moduleForms" layout="inline" class="ant-advanced-search-form" @submit="handleSubmit">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="应用名称" required>
                                <a-input v-model="moduleForms.appName"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
<!--                    <a-row :gutter="48">-->
<!--                        <a-col :md="8" :sm="24">-->
<!--                            <a-form-item label="环境" required>-->
<!--                                <a-input v-model="moduleForms.environment"/>-->
<!--                            </a-form-item>-->
<!--                        </a-col>-->
<!--                    </a-row>-->
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-model-item label="机器" required>
                                <a-input v-model="moduleForms.ip"/>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-model-item label="端口" required>
                                <a-input v-model="moduleForms.port"/>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-model-item label="版本" required>
                                <a-input v-model="moduleForms.version"/>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-model-item label="OA账号" required>
                                <a-input v-model="moduleForms.userName"/>
                            </a-form-model-item>
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
                            <router-link :to="{name:'Heart'}">
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

    import { module_detail, module_update, scfRepeaterCliHandle } from '@/api/repeate'
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
                module_detail,
                module_update,
                scfRepeaterCliHandle,
                moment,
                locale,
                // create model
                moduleTab: 'first',
                helpTab: 'second',
                visible: false,
                confirmLoading: false,
                mdl: null,
                loading: false,
                isSuccess: false,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询详情
                moduleForms: {},
                result: {},
                updateModuleForm: {
                    id: 0,
                    appName: "",
                    // environment: "",
                    ip: "",
                    userName: "",
                    port: "",
                    version: "",
                },
                scfRepeaterCliForm: {},
            }
        },
        created () {
            // getRoleList({ t: new Date() })
            let moduleId = Number(this.$route.params.id);
            console.log(moduleId)
            module_detail({id: moduleId})
                .then(res => {
                    this.moduleForms = res.data.data
                })
        },
        computed: {},
        methods: {
            callback(key) {
                console.log(key);
            },
            addModule () {
                console.log('addModuleForm:', this.moduleForms)
                this.isSuccess = true
            },
            handleSubmit(e) {
                e.preventDefault();
                console.log('moduleForms:', this.moduleForms)
                this.updateModuleForm.id = this.moduleForms.id
                this.updateModuleForm.appName = this.moduleForms.appName
                // this.updateModuleForm.environment = this.moduleForms.environment
                this.updateModuleForm.ip = this.moduleForms.ip
                this.updateModuleForm.userName = this.moduleForms.userName
                this.updateModuleForm.port = this.moduleForms.port
                this.updateModuleForm.version = this.moduleForms.version
                debugger
                module_update(this.updateModuleForm)
                    .then(res => {
                        let result = res.data
                        console.log(result)
                        if (res.code === "200"){
                            if (result.data.ip === "ip+port重复了！"){
                                this.$message.error(`已存在【${this.updateModuleForm.appName} + ${this.updateModuleForm.ip} + ${this.updateModuleForm.port}】! `)
                            } else {
                                this.isSuccess = true
                                debugger
                                this.scfRepeaterCliForm.userName = result.data.userName
                                this.scfRepeaterCliForm.ip = result.data.ip
                                // 此处taskName写死
                                this.scfRepeaterCliForm.taskName = 'scfReapterCliDownload'
                                // 此处token写死
                                this.scfRepeaterCliForm.token = 'scfRepeater'
                                // step1：下载插件（param=""即是下载）
                                this.scfRepeaterCliForm.param = ""
                                scfRepeaterCliHandle(this.scfRepeaterCliForm).then(
                                    res2 => {
                                        let result2 = res2.data
                                        console.log(result2)
                                        if (res2.code === "200"){
                                            let ispr2 = result2.data.installScfPluginResult
                                            if (ispr2.indexOf("您没有该IP的执行权限") === 1 || ispr2.indexOf("下载scfRepeaterCli成功") !== 0){
                                                this.$message.error(`${this.updateModuleForm.appName} ${this.updateModuleForm.ip} 下载插件结果失败：${ispr2}`)
                                            } else {
                                                this.$message.success(`${this.updateModuleForm.appName} ${this.updateModuleForm.ip} 下载插件结果成功：${ispr2}`)
                                                // step2：安装插件（param="install"即是安装）
												this.scfRepeaterCliForm.taskName = 'scfRepeaterCliHandle'
                                                this.scfRepeaterCliForm.param = "install"
                                                scfRepeaterCliHandle(this.scfRepeaterCliForm).then(
                                                    res3 => {
                                                        let result3 = res3.data
                                                        console.log(result3)
                                                        if (res3.code === "200") {
                                                            let ispr3 = result3.data.installScfPluginResult
                                                            if (ispr3.indexOf("您没有该IP的执行权限") === 1 || ispr3.indexOf("安装scfRepeaterCli成功") !== 0){
                                                                this.$message.error(`${this.updateModuleForm.appName} ${this.updateModuleForm.ip} 安装插件结果失败：${ispr3}`)
                                                            } else {
                                                                this.$message.success(`${this.updateModuleForm.appName} ${this.updateModuleForm.ip} 安装插件结果成功：${ispr3}`)
                                                                this.back()
                                                            }
                                                        }else {
                                                            this.$message.error(`${this.updateModuleForm.appName} ${this.updateModuleForm.ip} 安装插件结果失败：${result3.data}`)
                                                        }
                                                    }
                                                )
                                            }
                                        } else {
                                            this.$message.error(`${this.updateModuleForm.appName} ${this.updateModuleForm.ip} 下载插件结果失败：${result2.data}`)
                                        }
                                    }
                                )
                                this.$message.success(`${this.updateModuleForm.appName} 编辑成功`)
                            }
                        } else {
                            this.$message.error(`${this.updateModuleForm.appName} 编辑失败`)
                        }
                        // console.log(this.updateModuleForm)
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
