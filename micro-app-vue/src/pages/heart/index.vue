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
                    <a-icon type="heart"/>
                    在线模块
                </a-breadcrumb-item>
            </a-breadcrumb>
            <div id="components-form-demo-advanced-search">
                <a-form layout="inline" class="ant-advanced-search-form">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="应用名称">
                                <a-input v-model="moduleForms.appName" placeholder="请输入应用名称"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="机器IP">
                                <a-input v-model="moduleForms.ip" placeholder="请输入机器IP"/>
                            </a-form-item>
                        </a-col>
<!--                        <template v-if="advanced">-->
<!--                            <a-col :md="8" :sm="24">-->
<!--                                <a-form-item label="环境">-->
<!--                                    <a-input v-model="moduleForms.environment" placeholder="请输入环境"/>-->
<!--                                </a-form-item>-->
<!--                            </a-col>-->
<!--                        </template>-->
                        <a-col :md="!advanced && 8 || 24" :sm="24">
                            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                              <a-button style="margin-left: 8px" @click="() => this.moduleForms = {}">重置</a-button>
                              <a @click="toggleAdvanced" style="margin-left: 8px">
                                {{ advanced ? '收起' : '展开' }}
                                <a-icon :type="advanced ? 'up' : 'down'"/>
                              </a>
                            </span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="48">
                        <a-col :span="24" :style="{ textAlign: 'center' }">
                            <a-button type="primary" style="float:left">
                                <router-link :to="{name:'HeartAdd'}">
                                    安装模块
                                </router-link>
                            </a-button>
                        </a-col>
                    </a-row>
                </a-form>
                <br>
                <s-table
                        ref="table"
                        size="small"
                        rowKey="key"
                        :columns="columns"
                        :data="loadData"
                        showPagination="auto"
                >
                    <span slot="id" slot-scope="text, record, index">
                      {{ text }}
                    </span>

                    <span slot="status" slot-scope="text">
<!--                        <a-button :type="text | typeFilter" size="small" >{{text | statusFilter}}</a-button>-->
                        <!-- 用自定义颜色的按钮！-->
<!--                        <a-button :class="text | classFilter" :style="text | styleFilter" size="small" >{{text | statusFilter}}</a-button>-->
                        <a-button :style="text | styleFilter" size="small" >{{text | statusFilter}}</a-button>
                    </span>
					<span slot="cliStatus" slot-scope="text, record">
                        <a-button :style="text | cliStatusStyleFilter" v-if="record.cliStatus != 0" size="small">{{text | cliStatusFilter}}</a-button>
						<a-button style="background-color: #FAAD14; color: black" v-if="record.cliStatus === 0" size="small" @click="install(record)" >{{text | cliStatusFilter}}</a-button>
                    </span>
                    <span slot="gmtModified" slot-scope="text">
                      <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
                    </span>

                    <span slot="action" slot-scope="text, record">
                      <template>
                          <a-button style="background-color: #FAAD14; color: black"  size="small" >
                              <router-link :to="{name:'HeartEdit',params:{id:record.id}}">
                                编辑
                              </router-link>
                          </a-button>
                          <a-divider type="vertical" />
<!--                        <a @click="frozen(record)">冻结</a>-->
                          <!-- 用自定义颜色的按钮！-->
<!--                          <a-button class="button-color-sunset" v-if="record.status === 'ACTIVE'" size="small" @click="frozen(record)" >冻结</a-button>-->
                          <a-button style="background-color: #FAAD14; color: black" v-if="record.cliStatus === 3" size="small" @click="stopCli(record)" >暂停</a-button>
                          <a-button style="background-color: #389e0d; color: floralwhite" v-else size="small" @click="startCli(record)" >启动</a-button>
                          <a-button style="background-color: #FAAD14; color: black" v-if="record.status === 'ACTIVE'" size="small" @click="frozen(record)" >冻结</a-button>
                          <a-button style="background-color: #389e0d; color: floralwhite" v-else size="small" @click="active(record)" >激活</a-button>
                        <a-divider type="vertical" />
<!--                        <a @click="reload(record)">刷新</a>-->
                          <a-button type="primary" size="small" @click="reload(record)" >刷新</a-button>
                      </template>
                    </span>
                </s-table>
            </div>
        </a-card>
    </div>
</template>

<script>
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
    import { module_add } from  "../../api/repeate"
    import { module_search, module_frozen, module_active, module_reload } from '@/api/repeate'
    // import { getRoleList, getServiceList } from '@/api/manage'

    import { STable, Ellipsis } from '@/components'
    import {scfRepeaterCliHandle} from "../../api/repeate";

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: '应用名',
            dataIndex: 'appName',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => sortedForString(a.appName, b.appName)
        },
        // {
        //     title: '环境',
        //     dataIndex: 'environment',
        //     sortDirections: ['descend', 'ascend'],
        //     sorter: (a, b) => sortedForString(a.environment, b.environment),
        // },
        {
            title: '机器IP',
            dataIndex: 'ip',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => sortedForString(a.ip, b.ip),
        },
        {
            title: '端口号',
            dataIndex: 'port',
            sorter: (a, b) => a.port - b.port,
        },
        {
            title: 'OA账号',
            dataIndex: 'userName',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => sortedForString(a.userName, b.userName),
        },
        {
            title: '版本号',
            dataIndex: 'version',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => sortedForString(a.version, b.version),
        },
        {
            title: '插件状态',
            dataIndex: 'cliStatus',
            scopedSlots: { customRender: 'cliStatus' },
            // defaultSortOrder: 'descend',
            // sorter: (a, b) => a.hasDiff - b.hasDiff,
        },
        {
            title: '激活状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
            // defaultSortOrder: 'descend',
            // sorter: (a, b) => a.hasDiff - b.hasDiff,
        },
        {
            title: '心跳时间',
            dataIndex: 'gmtModified',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => sortedForDate(a.gmtModified, b.gmtModified),
            scopedSlots: { customRender: 'gmtModified' }
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
        },
    ];

    const statusMap = {
        'ACTIVE': {
            status: 'ACTIVE',
            text: '已激活'
        },
        'FROZEN': {
            status: 'FROZEN',
            text: '已冻结'
        }
    }
    const cliStatusMap = {
        0: {
            status: 0,
            text: '未安装'
        },
        1: {
            status: 1,
            text: '已安装'
        },
        2: {
            status: 2,
            text: '已暂停'
        },
        3: {
            status: 3,
            text: '已启动'
        }
    }
    const typeMap = {
        'ACTIVE': {
            status: 'ACTIVE',
            text: 'primary'
        },
        'FROZEN': {
            status: 'FROZEN',
            text: 'danger'
        }
    }
    const cliStatusTypeMap = {
        1: {
            status: 1,
            text: 'primary'
        },
        0: {
            status: 0,
            text: 'danger'
        },
        3: {
            status: 3,
            text: 'primary'
        },
        2: {
            status: 2,
            text: 'danger'
        }
    }
    const styleMap = {
        'ACTIVE': {
            status: 'ACTIVE',
            text: 'background-color: #52C41A; color: floralwhite'
        },
        'FROZEN': {
            status: 'FROZEN',
            text: 'background-color: #FAAD14; color: black'
        }
    }
    const cliStatusStyleMap = {
        0: {
            status: 0,
            text: 'background-color: #FAAD14; color: black'
        },
        1: {
            status: 1,
            text: 'background-color: #52C41A; color: floralwhite'
        },
        2: {
            status: 0,
            text: 'background-color: #FAAD14; color: black'
        },
        3: {
            status: 1,
            text: 'background-color: #52C41A; color: floralwhite'
        }
    }
    const classMap = {
        'ACTIVE': {
            status: 'ACTIVE',
            text: 'button-color-green'
        },
        'FROZEN': {
            status: 'FROZEN',
            text: 'button-color-sunset'
        }
    }
    const cliStatusClassMap = {
        1: {
            status: 1,
            text: 'button-color-green'
        },
        0: {
            status: 0,
            text: 'button-color-sunset'
        },
        3: {
            status: 3,
            text: 'button-color-green'
        },
        2: {
            status: 2,
            text: 'button-color-sunset'
        }
    }

    function sortedForString(strA, strB) {
        const stringA = strA.toUpperCase(); // ignore upper and lowercase
        const stringB = strB.toUpperCase(); // ignore upper and lowercase
        if (stringA < stringB) {
            return -1;
        }
        if (stringA > stringB) {
            return 1;
        }
        // names must be equal
        return 0;
    }

    function sortedForDate(dateStrA, dateStrB) {
        const dateA = new Date(dateStrA);
        const dateB = new Date(dateStrB);
        const unixTimeA = Date.parse(dateA)
        const unixTimeB = Date.parse(dateB)
        if (unixTimeA < unixTimeB) {
            return -1;
        }
        if (unixTimeA > unixTimeB) {
            return 1;
        }
        // names must be equal
        return 0;
    }

    // function onChangeTable(pagination, filters, sorter) {
    //     console.log('params==pagination====', pagination);
    //     console.log('params==filters====', filters);
    //     console.log('params==sorter====', sorter);
    //     // 取时间比赋值到moduleForms查询表单
    //     // this.moduleForms.startTime = filters[0];
    //     // this.moduleForms.endTime = filters[1];
    //     console.log('moduleForms======', this.moduleForms);
    // }

    export default {
        name: 'TableList',
        components: {
            STable,
            Ellipsis,
        },
        data () {
            this.columns = columns
            return {
                module_search,
                module_frozen,
                module_active,
                module_reload,
				module_add,
                moment,
                locale,
                // create model
                visible: false,
                confirmLoading: false,
                mdl: null,
                loading: false,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                moduleForms: {},
                // moduleForms: {
                //     "appName":"",
                //     "entranceDesc":"",
                //     "traceId":"",
                //     "environment":"",
                //     "host":"",
                //     "hasDiff":-1,
                //     "startTime":"",
                //     "endTime":"",
                //     "pageNo": 1,
                //     "pageSize": 10
                // },
                scfRepeaterCliForm: {},
                result: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.moduleForms)
                    console.log('loadData request parameters:', requestParameters)
                    this.result = module_search(requestParameters)
                        .then(res => {
                            this.result = res.data
                            return res.data
                        })
                    return this.result
                },
                selectedRowKeys: [],
                selectedRows: []
            }
        },
        filters: {
            statusFilter (type) {
                return statusMap[type].text
            },
            cliStatusFilter (type) {
                return cliStatusMap[type].text
            },
            styleFilter (type) {
                return styleMap[type].text
            },
            cliStatusStyleFilter (type) {
                return cliStatusStyleMap[type].text
            },
            classFilter (type) {
                return classMap[type].text
            },
            cliStatusClassFilter (type) {
                return cliStatusClassMap[type].text
            },
            typeFilter (type) {
                return typeMap[type].text
            },
            statusTypeFilter (type) {
                return statusMap[type].status
            }
        },
        created () {
            // getRoleList({ t: new Date() })
        },
        computed: {
            hasSelected() {
                return this.selectedRowKeys.length > 0;
            },
            // rowSelection () {
            //     return {
            //         // selectedRowKeys: this.selectedRowKeys,
            //         onChange: this.onSelectChange
            //     }
            // },
        },
        methods: {
            start() {
                this.loading = true;
                // ajax request after empty completing
                this.loading = false;
                // this.selectedRowKeys = [];
                // setTimeout(() => {
                //     this.loading = false;
                //     this.selectedRowKeys = [];
                //     this.selectedRows = [];
                // }, 1000);
            },
            frozen (record) {
                // console.log(record.id)
                if (record.status === 'ACTIVE') {
                    module_frozen({id: record.id})
                        .then(res => {
                            console.log(res)
                            let status = res.data.status
                            if (status === 'FROZEN') {
                                this.$message.success(`${record.ip} 冻结成功`)
                                // location.reload() // 刷新当前整个页面，不太友好
                                record.status = status
                            } else {
                                this.$message.error(`${record.ip} 冻结失败`)
                            }
                        })
                }
            },
            active (record) {
                // console.log(record.id)
                if (record.status === 'FROZEN') {
                    module_active({id: record.id})
                        .then(res => {
                            console.log(res)
                            let status = res.data.status
                            if (status === 'ACTIVE') {
                                this.$message.success(`${record.ip} 激活成功`)
                                // location.reload() // 刷新当前整个页面，不太友好
                                record.status = status
                            } else {
                                this.$message.error(`${record.ip} 激活失败`)
                            }
                        })
                }
            },
            startCli (record) {
                // console.log(record.id)
                if (record.cliStatus === 1 || record.cliStatus === 2 || record.cliStatus === 3 ) {
                    this.scfRepeaterCliForm.userName = record.userName
                    this.scfRepeaterCliForm.ip = record.ip
                    // 此处taskName写死
                    this.scfRepeaterCliForm.taskName = 'scfRepeaterCliHandle'
                    // 此处token写死
                    this.scfRepeaterCliForm.token = 'scfRepeater'
                    // step3：启动插件（param="start;"+record.appName+";"+record.port即是启动）
                    this.scfRepeaterCliForm.param = "start;"+record.appName+";"+record.port
                    scfRepeaterCliHandle(this.scfRepeaterCliForm)
                        .then(res => {
                           // console.log(res)
						   let resp = res
                            if (resp.data.data.cliStatus === 3) {
                                this.$message.success(`${record.ip} 启动成功`)
                                 // location.reload() // 刷新当前整个页面，不太友好
                                this.record.cliStatus = resp.data.data.cliStatus
                            } else {
                                this.$message.error(`${record.ip} 启动失败`)
                            }
                        })
                } else {
                    this.$message.error(`${record.ip} 启动失败：请先在当前ip安装插件！`)
                }

            },
            stopCli (record) {
                // console.log(record.id)
                if (record.cliStatus === 3) {
                    this.scfRepeaterCliForm.userName = record.userName
                    this.scfRepeaterCliForm.ip = record.ip
                    // 此处taskName写死
                    this.scfRepeaterCliForm.taskName = 'scfRepeaterCliHandle'
                    // 此处token写死
                    this.scfRepeaterCliForm.token = 'scfRepeater'
                    // step3：暂停插件（param="stop;"+record.appName+";"+record.port即是暂停）
                    this.scfRepeaterCliForm.param = "stop;"+record.appName+";"+record.port
                    scfRepeaterCliHandle(this.scfRepeaterCliForm)
                        .then(res => {
                           // console.log(res)
                            if (res.data.data.cliStatus === 2) {
                                this.$message.success(`${record.ip} 暂停成功`)
                                 // location.reload() // 刷新当前整个页面，不太友好
                                record.cliStatus = this.res.data.data.cliStatus
                            } else {
                                this.$message.error(`${record.ip} 暂停失败`)
                            }
                        })
                } else {
                    this.$message.error(`${record.ip} 暂停失败：当前ip插件不是已启动状态！`)
                }
            },
            reload (record) {
                // console.log(record.id)
                module_reload({id: record.id})
                    .then(res => {
                        console.log(res)
                        let success = res.data.success
                        if (success) {
                            this.$message.success(`${record.ip} 刷新成功`)
                            // location.reload() // 刷新当前整个页面，不太友好
                        } else {
                            this.$message.error(`${record.ip} 刷新失败`)
                        }
                    })
            },
            toggleAdvanced () {
                this.advanced = !this.advanced
            },
            resetSearchForm () {
                this.queryParam = {
                    date: moment(new Date())
                }
            },
		install (record) 
		{
            // console.log('scfRepeaterCliForm:', this.scfRepeaterCliForm)
			this.scfRepeaterCliForm.userName = record.userName
			this.scfRepeaterCliForm.ip = record.ip
			this.scfRepeaterCliForm.port = record.port
			this.scfRepeaterCliForm.appName = record.appName
            module_add(this.scfRepeaterCliForm)
                .then(res => {
                    let result = res.data
                    //console.log(result)
                    this.isSuccess = true
                    this.scfRepeaterCliForm.userName = this.scfRepeaterCliForm.userName
                    this.scfRepeaterCliForm.ip = this.scfRepeaterCliForm.ip
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
                                    this.$message.error(`${this.scfRepeaterCliForm.appName} ${this.scfRepeaterCliForm.ip} 下载插件结果失败：${ispr2}`)
                                } else {
                                    this.$message.success(`${this.scfRepeaterCliForm.appName} ${this.scfRepeaterCliForm.ip} 下载插件结果成功：${ispr2}`)
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
                                                    this.$message.error(`${this.scfRepeaterCliForm.appName} ${this.scfRepeaterCliForm.ip} 安装插件结果失败：${ispr3}`)
                                                } else {
                                                    this.$message.success(`${this.scfRepeaterCliForm.appName} ${this.scfRepeaterCliForm.ip} 安装插件结果成功：${ispr3}`)
													location.reload() // 刷新当前整个页面，不太友好
                                                    this.back()
                                                }
                                            }else {
                                                this.$message.error(`${this.scfRepeaterCliForm.appName} ${this.scfRepeaterCliForm.ip} 安装插件结果失败：${result3.data}`)
                                            }
                                        }
                                    )
                                }
                            } else {
                                this.$message.error(`${this.scfRepeaterCliForm.appName} ${this.scfRepeaterCliForm.ip} 下载插件结果失败：${result2.data}`)
                            }
                        }
                    )
                            })
		
		},
            installModule () {
                console.log('installModule:', this.moduleForms)
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
