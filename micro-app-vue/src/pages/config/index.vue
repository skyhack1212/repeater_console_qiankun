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
                    <a-icon type="setting"/>
                    配置管理
                </a-breadcrumb-item>
            </a-breadcrumb>
            <div id="components-form-demo-advanced-search">
                <a-form layout="inline" class="ant-advanced-search-form">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="应用名称">
                                <a-input v-model="configForms.appName" placeholder="请输入应用名称"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="环境">
                                <a-input v-model="configForms.environment" placeholder="请输入环境"/>
                            </a-form-item>
                        </a-col>
                        <template v-if="advanced">
                            <a-col :md="8" :sm="24">
                                <a-form-item label="配置信息">
                                    <a-input v-model="configForms.config" placeholder="请输入配置信息"/>
                                </a-form-item>
                            </a-col>
                        </template>
                        <a-col :md="!advanced && 8 || 24" :sm="24">
                            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                              <a-button style="margin-left: 8px" @click="() => this.configForms = {}">重置</a-button>
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
                                <router-link :to="{name:'ConfigAdd'}">
                                    新增配置
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
                    <!--                    <span slot="status" slot-scope="text">-->
                    <!--                      <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />-->
                    <!--                    </span>-->
                    <span slot="config" slot-scope="text">
                      <ellipsis :length="80" tooltip>{{ text }}</ellipsis>
                    </span>
                    <span slot="gmtCreate" slot-scope="text">
                      <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
                    </span>
                    <span slot="gmtModified" slot-scope="text">
                      <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
                    </span>
                    <span slot="action" slot-scope="text">
                      <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
                    </span>

                    <span slot="action" slot-scope="text, record">
                      <template>
<!--                        <a @click="handleEdit(record)">详情</a>-->
                          <a-button type="primary" size="small" >
                              <router-link :to="{name:'ConfigDetail',params:{id:record.id}}">
                                详情
                              </router-link>
                          </a-button>
                          <a-divider type="vertical" />
                          <!-- 用自定义颜色的按钮！-->
<!--                        <a class="button-color-geekblue" @click="handleSub(record)">编辑</a>-->
                          <a-button style="background-color: #FAAD14; color: black"  size="small" >
                              <router-link :to="{name:'ConfigEdit',params:{id:record.id}}">
                                编辑
                              </router-link>
                          </a-button>
                          <a-divider type="vertical" />
<!--                          <a-button type="primary" size="small" @click="handleSub(record)" >推送</a-button>-->
                          <!-- 用自定义颜色的按钮！-->
                          <a-button style="background-color: #389e0d; color: floralwhite" size="small" @click="push(record)" >推送</a-button>
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

    import { config_search,config_push } from '@/api/repeate'
    // import { getRoleList, getServiceList } from '@/api/manage'

    import { STable, Ellipsis } from '@/components'

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
        {
            title: '环境',
            dataIndex: 'environment',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => sortedForString(a.environment, b.environment),
        },
        {
            title: '配置信息',
            dataIndex: 'config',
            scopedSlots: { customRender: 'config' }
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreate',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => sortedForDate(a.gmtCreate, b.gmtCreate),
            scopedSlots: { customRender: 'gmtCreate' }
        },
        {
            title: '修改时间',
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
        0: {
            status: 'default',
            text: '关闭'
        },
        1: {
            status: 'processing',
            text: '运行中'
        },
        2: {
            status: 'success',
            text: '已上线'
        },
        3: {
            status: 'error',
            text: '异常'
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
    //     // 取时间比赋值到configForms查询表单
    //     // this.configForms.startTime = filters[0];
    //     // this.configForms.endTime = filters[1];
    //     console.log('configForms======', this.configForms);
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
                config_search,
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
                configForms: {},
                // configForms: {
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
                result: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.configForms)
                    console.log('loadData request parameters:', requestParameters)
                    this.result = config_search(requestParameters)
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
            push (record) {
			config_push({id: record.id})
                    .then(res => {
                        console.log(res)
                        let success = res.data.success
                        if (success) {
                            this.$message.success(`${record.appName} 推送成功`)
                            // location.reload() // 刷新当前整个页面，不太友好
                        } else {
                             this.$message.error(`${record.appName} 推送失败`)
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
