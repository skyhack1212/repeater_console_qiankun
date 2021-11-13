<template>
    <div>
        <div style="margin: 16px;">
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
                                    <a-select v-model="onlineForms.hasDiff" placeholder="请选择" default-value="-1" @change="onChange">
                                        <a-select-option v-for="select in listForSelect" :key="select.id" :value="select.status">
                                            {{select.name}}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="录制时间">
                                    <a-range-picker :locale="locale" style="width: 100%" @change="onChange">
                                        <a-icon slot="suffixIcon" type="smile" />
                                    </a-range-picker>
                                </a-form-item>
                            </a-col>
                        </template>
                        <a-col :md="!advanced && 8 || 24" :sm="24">
                            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
<!--                              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>-->
                              <a-button type="primary" @click="handleSearch">查询</a-button>
                              <a-button style="margin-left: 8px" @click="() => onlineForms = {}">重置</a-button>
                              <a @click="toggleAdvanced" style="margin-left: 8px">
                                {{ advanced ? '收起' : '展开' }}
                                <a-icon :type="advanced ? 'up' : 'down'"/>
                              </a>
                            </span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="48">
                        <a-col :span="24" :style="{ textAlign: 'center' }">
                            <a-button type="danger" :disabled="!hasSelected" :loading="loading" @click="start"
                                      style="float:left">
                                批量回放
                            </a-button>
                        </a-col>
                    </a-row>
                </a-form>
                <s-table
                        ref="table"
                        size="default"
                        rowKey="key"
                        :columns="columns"
                        :data="loadData"
                        :alert="true"
                        :rowSelection="rowSelection"
                        showPagination="auto"
                >
                    <span slot="serial" slot-scope="text, record, index">
                      {{ index + 1 }}
                    </span>
                                <span slot="status" slot-scope="text">
                      <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
                    </span>
                                <span slot="description" slot-scope="text">
                      <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
                    </span>

                    <span slot="action" slot-scope="text, record">
                      <template>
                        <a @click="handleEdit(record)">配置</a>
                        <a-divider type="vertical" />
                        <a @click="handleSub(record)">订阅报警</a>
                      </template>
                    </span>
                </s-table>
                <div class="search-result-list">
                    <!--        <div>-->
                    <a-table
                            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                            :columns="columns"
                            :data-source="data"
                            @change="onChange"
                    >
                        <template v-slot:action>
                            <!--                            <a href="javascript:;">详情</a>-->
                            <a-button type="link" size="small">
                                详情
                            </a-button>
                            <a-button type="danger" size="small">
                                回放
                            </a-button>
                        </template>
                    </a-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        online_search
    } from '@/api/repeate'

    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

    import STable from '@/components/Table'

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
        {
            title: '应用名',
            dataIndex: 'appName',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => sortedForString(a.appName, b.appName),
        },
        {
            title: '流量入口',
            dataIndex: 'entranceDesc',
        },
        {
            title: 'TraceId',
            dataIndex: 'traceId',
        },
        {
            title: '环境',
            dataIndex: 'environment',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => sortedForString(a.environment, b.environment),
        },
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
        },
        {
            title: '回放状态',
            dataIndex: 'hasDiff',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.hasDiff - b.hasDiff,
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'action' },
        },
    ];

    const data = [
        {
            id: 1,
            appName: 'appName',
            entranceDesc: 'entranceDesc_demo ',
            traceId: "traceId",
            environment: 'nresource',
            host: '127.0.0.1',
            hasDiff: 1,
            gmtRecord: '2021-02-24 11:12:11'
        },
        {
            id: 2,
            appName: 'bppName',
            entranceDesc: 'entranceDesc_demo ',
            traceId: "traceId",
            environment: 'resource',
            host: '127.0.0.1',
            hasDiff: 2,
            gmtRecord: '2021-02-24 11:12:11'
        },
        {
            id: 1,
            appName: 'cppName',
            entranceDesc: 'entranceDesc_demo ',
            traceId: "traceId",
            environment: 'nresource',
            host: '127.0.0.1',
            hasDiff: 1,
            gmtRecord: '2021-02-24 11:12:11'
        },
        {
            id: 2,
            appName: 'appName',
            entranceDesc: 'entranceDesc_demo ',
            traceId: "traceId",
            environment: 'nresource',
            host: '227.0.0.1',
            hasDiff: 3,
            gmtRecord: '2021-02-23 11:12:11'
        },
        {
            id: 1,
            appName: 'appName',
            entranceDesc: 'entranceDesc_demo ',
            traceId: "traceId",
            environment: 'nresource',
            host: '127.0.0.1',
            hasDiff: 1,
            gmtRecord: '2021-02-22 11:12:11'
        },
        {
            id: 2,
            appName: 'appName',
            entranceDesc: 'entranceDesc_demo ',
            traceId: "traceId",
            environment: 'nresource',
            host: '127.0.0.1',
            hasDiff: 1,
            gmtRecord: '2021-02-21 11:12:11'
        },
        {
            id: 1,
            appName: 'appName',
            entranceDesc: 'entranceDesc_demo ',
            traceId: "traceId",
            environment: 'nresource',
            host: '127.0.0.1',
            hasDiff: 1,
            gmtRecord: '2021-02-24 11:12:11'
        },
        {
            id: 2,
            appName: 'appName',
            entranceDesc: 'entranceDesc_demo ',
            traceId: "traceId",
            environment: 'nresource',
            host: '127.0.0.1',
            hasDiff: 1,
            gmtRecord: '2021-02-24 11:12:11'
        },
        {
            id: 1,
            appName: 'appName',
            entranceDesc: 'entranceDesc_demo ',
            traceId: "traceId",
            environment: 'nresource',
            host: '127.0.0.1',
            hasDiff: 1,
            gmtRecord: '2021-02-24 11:12:11'
        },
        {
            id: 2,
            appName: 'appName',
            entranceDesc: 'entranceDesc_demo ',
            traceId: "traceId",
            environment: 'nresource',
            host: '127.0.0.1',
            hasDiff: 1,
            gmtRecord: '2021-02-24 11:12:11'
        },
        {
            id: 1,
            appName: 'appName',
            entranceDesc: 'entranceDesc_demo ',
            traceId: "traceId",
            environment: 'nresource',
            host: '127.0.0.1',
            hasDiff: 1,
            gmtRecord: '2021-02-24 11:12:11'
        },
        {
            id: 2,
            appName: 'appName',
            entranceDesc: 'entranceDesc_demo ',
            traceId: "traceId",
            environment: 'nresource',
            host: '127.0.0.1',
            hasDiff: 1,
            gmtRecord: '2021-02-24 11:12:11'
        }
    ];
    // for (let i = 0; i < 46; i++) {
    //   data.push({
    //     key: i,
    //     name: `Edward King ${i}`,
    //     age: 32,
    //     address: `London, Park Lane no. ${i}`,
    //   });
    // }

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

    function onChange(pagination, filters, sorter) {
        console.log('params==pagination====', pagination);
        console.log('params==filters====', filters);
        console.log('params==sorter====', sorter);
        // 取时间比赋值到onlineForms查询表单
        this.onlineForms.startTime = filters[0];
        this.onlineForms.endTime = filters[1];
        console.log('onlineForms======', this.onlineForms);
    }

    export default {
        components: { STable },
        data() {
            return {
                online_search,
                moment,
                locale,
                listForSelect,
                // 高级搜索 展开/关闭
                advanced: false,
                data,
                columns,
                selectedRowKeys: [], // Check here to configure the default column
                loading: false,
                expand: false,
                onlineForms: {
                    "appName":"",
                    "entranceDesc":"",
                    "traceId":"",
                    "environment":"",
                    "host":"",
                    "hasDiff":-1,
                    "startTime":"",
                    "endTime":"",
                    "pageIndex": 1,
                    "pageSize": 10
                },
            };
        },
        computed: {
            hasSelected() {
                return this.selectedRowKeys.length > 0;
            },
            count() {
                return this.expand ? 11 : 7;
            },
        },
        // updated() {
        //     console.log('updated');
        // },
        methods: {
            onChange,
            start() {
                this.loading = true;
                // ajax request after empty completing
                setTimeout(() => {
                    this.loading = false;
                    this.selectedRowKeys = [];
                }, 1000);
            },
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
            },
            async handleSearch(e) {
                e.preventDefault();
                console.log('this.onlineForms ===== ', this.onlineForms)
                // this.onlineForms.pageIndex = pagination.pageIndex;
                // this.onlineForms.pageSize = pagination.pageSize;
                const result = await online_search(this.onlineForms);
                console.log(result);
                if (result.data.code === '200') {
                    // this.pages = result.data.data
                    this.data = result.data.data.list
                    console.log(this.data)
                } else {
                    this.$message.error('抱歉，后端接口/online/search报错，请稍后重试！')
                }
            },

            handleReset() {
                this.form.resetFields();
            },

            toggle() {
                this.expand = !this.expand;
            },
            handleChange(value) {
                console.log(`selected ${value}`);
            },
            toggleAdvanced () {
                this.advanced = !this.advanced
            },
            getCurrentStyle(current) {
                const style = {};
                if (current.date() === 1) {
                    style.border = '1px solid #1890ff';
                    style.borderRadius = '50%';
                }
                return style;
            },
        },
    };
</script>

<style>
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
