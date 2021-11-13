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
                    <a-icon type="area-chart"/>
                    在线流量
                </a-breadcrumb-item>
            </a-breadcrumb>
            <div id="components-form-demo-advanced-search">
                <a-form layout="inline" class="ant-advanced-search-form">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="应用名称">
                                <a-input v-model="onlineForms.appName" placeholder="请输入应用名称"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="流量入口">
                                <a-input v-model="onlineForms.entranceDesc" placeholder="请输入流量入口"/>
                            </a-form-item>
                        </a-col>
                        <template v-if="advanced">
                            <a-col :md="8" :sm="24">
                                <a-form-item label="环境">
                                    <a-input v-model="onlineForms.environment" placeholder="请输入环境"/>
                                </a-form-item>
                            </a-col>
                            <!--                            <a-col :md="8" :sm="24">-->
                            <!--                                <a-form-item label="机器IP">-->
                            <!--                                    <a-input v-model="onlineForms.host" placeholder="请输入机器IP"/>-->
                            <!--                                </a-form-item>-->
                            <!--                            </a-col>-->
                            <a-col :md="8" :sm="24">
                                <a-form-item label="TraceID">
                                    <a-input v-model="onlineForms.traceId" placeholder="请输入TraceID"/>
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="回放状态">
                                    <a-select v-model="onlineForms.hasDiff" placeholder="请选择" default-value="-1">
                                        <a-select-option v-for="select in listForSelect" :key="select.id" :value="select.status">
                                            {{select.name}}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="录制时间">
                                    <a-range-picker :locale="locale" style="width: 100%">
                                        <a-icon slot="suffixIcon" type="smile" />
                                    </a-range-picker>
                                </a-form-item>
                            </a-col>
                        </template>
                        <a-col :md="!advanced && 8 || 24" :sm="24">
                            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                              <a-button style="margin-left: 8px" @click="() => this.onlineForms = {}">重置</a-button>
                              <a @click="toggleAdvanced" style="margin-left: 8px">
                                {{ advanced ? '收起' : '展开' }}
                                <a-icon :type="advanced ? 'up' : 'down'"/>
                              </a>
                            </span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="48">
                        <a-col :span="24" :style="{ textAlign: 'center' }">
                            <a-button :disabled="!hasSelected" :loading="loading" @click="startBatchReplay"
                                      style="float:left; background-color: #52C41A; color: floralwhite">
                                批量回放
                            </a-button>
                            <a-button :loading="loading" @click="startBatchReplay2"
                                      style="float:left; background-color: #52C41A; color: floralwhite">
                                批量回放当前查询流量
                            </a-button>
                        </a-col>
                    </a-row>
                </a-form>
                <s-table
                        ref="table"
                        size="small"
                        rowKey="key"
                        :columns="columns"
                        :data="loadData"
                        :alert="true"
                        :rowSelection="rowSelection"
                        showPagination="auto"
                >
<!--                    <span slot="id" slot-scope="text, record, index">-->
<!--                      {{ text }}-->
<!--                    </span>-->
<!--                    <span slot="status" slot-scope="text">-->
<!--                      <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />-->
<!--                    </span>-->
                    <span slot="entranceDesc" slot-scope="text">
                      <ellipsis :length="70" tooltip>{{ text }}</ellipsis>
                    </span>
                    <span slot="traceId" slot-scope="text">
                      <ellipsis :length="32" tooltip>{{ text }}</ellipsis>
                    </span>
                    <span slot="gmtRecord" slot-scope="text">
                      <ellipsis :length="19" tooltip>{{ text }}</ellipsis>
                    </span>

                    <span slot="action" slot-scope="text, record">
                      <template>
<!--                        <a @click="handleEdit(record)">详情</a>-->
                          <a-button type="primary" size="small" >
                              <router-link :to="{name:'OnlineDetail',params:{id:record.id}}">
                                详情
                              </router-link>
                          </a-button>
                          <a-divider type="vertical" />
                          <!-- 用自定义颜色的按钮！-->
                          <a-button style="background-color: #52C41A; color: floralwhite" size="small" @click="showModal(record)" >回放</a-button>
                          <a-modal v-model="visible" title="开始回放" ok-text="执行" cancel-text="取消" @cancel="handleCancel" @ok="handleOk(modalForm)">
                            <a-form layout="inline">
                                <a-row :gutter="48">
                                    <a-col>
                                        <a-form-item label="应用名称">
                                            <a-input v-model="modalForm.appName" placeholder="请输入appName" style="width: 300px" disabled />
                                        </a-form-item>
                                        <a-form-item label="TraceID">
                                            <a-input v-model="modalForm.traceId" placeholder="请输入TraceID" style="width: 300px" disabled />
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row :gutter="48">
                                    <a-col>
                                        <a-form-item label="机器">
                                            <a-select v-model="selectedHost" placeholder="请选择" default-value="127.0.0.1" style="width: 300px" @change="handleChangeSelect">
                                                <a-select-option v-for="select in hostListForSelect" :key="select.ip" :value="select.ip + ':' + select.port">
                                                    {{select.ip + ":" + select.port + "[" + select.status + "版本" + select.version + "]" }}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row :gutter="48">
                                    <a-col>
                                        <a-form-item label="MOCK">
                                          <a-radio-group v-model="selectedRadio" default-value="0" @change="handleChangeRadio">
                                            <a-radio value="1">开</a-radio>
                                            <a-radio value="0">关</a-radio>
                                          </a-radio-group>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </a-form>
                          </a-modal>
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

    import { online_search, module_search_by_appNameAndIp, online_replay } from '@/api/repeate'
    // import { getRoleList, getServiceList } from '@/api/manage'

    import { STable, Ellipsis } from '@/components'

    const hostListForSelectDefault = [
        {
            "ip": "127.0.0.1",
            "port": "9527",
            "version": "1.0.0",
            "status": "ACTIVE",
        }
    ]
    const listForSelect = [
        {
            "id": 1,
            "name": "全部",
            "status": -1,
        },
        {
            "id": 2,
            "name": "未回放",
            "status": 0,
        },
        {
            "id": 3,
            "name": "无差异",
            "status": 1,
        },
        {
            "id": 4,
            "name": "有差异",
            "status": 2,
        }
    ]

    const columns = [
        // {
        //     title: '#',
        //     dataIndex: 'id',
        //     sorter: (a, b) => a.id - b.id,
        // },
        {
            title: '应用名',
            dataIndex: 'appName',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => sortedForString(a.appName, b.appName)
        },
        {
            title: '流量入口',
            dataIndex: 'entranceDesc',
            scopedSlots: { customRender: 'entranceDesc' }
        },
        {
            title: 'TraceId',
            dataIndex: 'traceId',
            scopedSlots: { customRender: 'traceId' }
        },
       // {
       //     title: '环境',
       //     dataIndex: 'environment',
       //     sortDirections: ['descend', 'ascend'],
       //     sorter: (a, b) => sortedForString(a.environment, b.environment),
       // },
        {
            title: '机器IP',
            dataIndex: 'host',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => sortedForString(a.host, b.host),
        },
        {
            title: '录制时间',
            dataIndex: 'gmtRecord',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => sortedForDate(a.gmtRecord, b.gmtRecord),
            scopedSlots: { customRender: 'gmtRecord' }
        },
        {
            title: '回放状态',
            dataIndex: 'hasDiff',
            // defaultSortOrder: 'descend',
            // sorter: (a, b) => a.hasDiff - b.hasDiff,
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
    //     // 取时间比赋值到onlineForms查询表单
    //     // this.onlineForms.startTime = filters[0];
    //     // this.onlineForms.endTime = filters[1];
    //     console.log('onlineForms======', this.onlineForms);
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
                online_search,
                module_search_by_appNameAndIp,
                online_replay,
                moment,
                locale,
                listForSelect,
                hostListForSelectDefault,
                hostListForSelect: [],
                // create model
                modalForm: {},
                selectedHost: "请选择",
                selectedRadio: "0",
                visible: false,
                confirmLoading: false,
                mdl: null,
                loading: false,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                onlineForms: {
                    "esType": 0
                },
                // onlineForms: {
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
                    const requestParameters = Object.assign({}, parameter, this.onlineForms)
                    console.log('loadData request parameters:', requestParameters)
                    this.result = online_search(requestParameters)
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
            rowSelection () {
                return {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: this.onSelectChange
                }
            },
        },
        methods: {
            startBatchReplay() {
                this.loading = true;
                // ajax request after empty completing
                setTimeout(() => {
                    this.loading = false;
                    this.selectedRowKeys = [];
                    this.selectedRows = [];
                }, 1000);
            },
            startBatchReplay2() {
                this.loading = true;
                console.log(this.onlineForms)
                // ajax request after empty completing
                setTimeout(() => {
                    this.loading = false;
                    this.selectedRowKeys = [];
                    this.selectedRows = [];
                }, 1000);
            },
            initTotalList (columns) {
                const totalList = []
                columns && columns instanceof Array && columns.forEach(column => {
                    if (column.needTotal) {
                        totalList.push({
                            ...column,
                            total: 0
                        })
                    }
                })
                return totalList
            },
            replay (record) {
                if (record.status !== 0) {
                    this.$message.info(`${record.ip} 回放成功`)
                } else {
                    this.$message.error(`${record.ip} 回放失败`)
                }
            },
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
            },
            toggleAdvanced () {
                this.advanced = !this.advanced
            },
            resetSearchForm () {
                this.queryParam = {
                    date: moment(new Date())
                }
            },
            showModal(record) {
                this.visible = true;
                this.modalForm.appName = record.appName
                this.modalForm.ip = record.host
                this.modalForm.traceId = record.traceId
                module_search_by_appNameAndIp( this.modalForm)
                // module_search_by_appName({ "appName": "unknown" })
                    .then(res => {
                        // console.log(res.data)
                        if (res.data.totalCount > 0) {
                            this.hostListForSelect = res.data.data
                        } else {
                            this.hostListForSelect = hostListForSelectDefault
                        }
                    })
                console.log(this.hostListForSelect);
            },
            handleChangeSelect(value) {
                console.log(`selected ${value}`);
                this.modalForm.ip = value.split(":")[0];
                this.modalForm.port = value.split(":")[1];
            },
            handleChangeRadio(value) {
                console.log(`selected ${value}`);
                debugger
                this.modalForm.mock = value === "1";
            },
            handleCancel() {
                this.selectedHost = "请选择";
                this.selectedRadio = "0";
            },
            handleOk() {
                console.log(this.modalForm);
                online_replay(this.modalForm).then(res => {
                    let rr = res.data.data
                    console.log(rr)
                    if (rr.success) {
                        this.$message.success(`【traceId=${this.modalForm.traceId}】 ${rr.message}`)
                    } else {
                        this.$message.error(`【traceId=${this.modalForm.traceId}】 ${rr.message}`)
                    }
                }).catch(err => {
                    this.$message.error(`请求后端接口报错了！请联系管理员！`)
                })
                this.visible = false;
                this.selectedHost = "请选择";
                this.selectedRadio = "0";
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
