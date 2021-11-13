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
                    <router-link to="/online">
                        <a-icon type="area-chart"/>
                        在线流量
                    </router-link>
                </a-breadcrumb-item>
                <a-breadcrumb-item>
                    查看流量详情
                </a-breadcrumb-item>
            </a-breadcrumb>


            <div id="components-form-demo-advanced-search">
                <a-card
                        style="width:100%"
                        title="流量录制回放详情"
                        :tab-list="tabList"
                        :active-tab-key="key"
                        @tabChange="key => onTabChange(key, 'key')"
                >
                    <span slot="customRender" slot-scope="item"> <a-icon type="copy" />{{ item.key }} </span>
                    <a-button slot="extra" style="background-color: #52C41A; color: floralwhite" size="small" @click="replay(record)" >回放</a-button>
                    <div v-if="key==='record'">
                        <div style="background:#ECECEC; padding:10px">
                            <a-card title="基础信息" :bordered="false">
                                <a-form layout="inline" class="ant-advanced-search-form">
                                    <a-row :gutter="48">
                                        <a-col :md="8" :sm="24">
                                            <a-form-item label="应用名称">
                                                <a-input v-model="recordForms.appName" />
                                            </a-form-item>
                                        </a-col>
                                        <a-col :md="15" :sm="24">
                                            <a-form-item label="流量入口">
                                                <a-input v-model="recordForms.entranceDesc" />
                                            </a-form-item>
                                        </a-col>
                                    </a-row>
                                    <a-row :gutter="48">
                                        <a-col :md="8" :sm="24">
                                            <a-form-item label="录制机器">
                                                <a-input v-model="recordForms.host" />
                                            </a-form-item>
                                        </a-col>
                                        <a-col :md="8" :sm="24">
                                            <a-form-item label="TraceId">
                                                <a-input v-model="recordForms.traceId" />
                                            </a-form-item>
                                        </a-col>
                                    </a-row>
                                    <a-row :gutter="48">
                                        <a-col :md="8" :sm="24">
                                            <a-form-item label="录制时间">
                                                <a-input v-model="recordForms.gmtRecord" />
                                            </a-form-item>
                                        </a-col>
                                        <a-col :md="8" :sm="24">
                                            <a-form-item label="录制环境">
                                                <a-input v-model="recordForms.environment" />
                                            </a-form-item>
                                        </a-col>
                                    </a-row>
                                </a-form>
                            </a-card>
                        </div>
                        <div style="background:#ECECEC; padding:10px">
                            <a-card title="调用信息" :bordered="false">
                                <a-card
                                        style="width:100%"
                                        :tab-list="detailTabList"
                                        :active-tab-key="detailKey"
                                        @tabChange="key => onTabChange2(key, 'detailKey')"
                                >
                                    <span slot="customRender" slot-scope="item"> <a-icon type="copy" />{{ item.key }} </span>
                                    <div class="editor-container">
                                        <json-editor v-if="detailKey==='request'" ref="jsonEditor" v-model="recordRequestJson" />
                                        <json-editor v-if="detailKey==='response'" ref="jsonEditor" v-model="recordResponseJson" />
                                        <json-editor v-if="detailKey==='sonRequest'" ref="jsonEditor" v-model="recordSonRequestJson" />
                                    </div>
                                </a-card>
                            </a-card>
                        </div>
                    </div>
                    <div v-if="key==='replay'">
                        <div style="background:#ECECEC; padding:10px">
                            <a-card title="调用快照" :bordered="false">
                                <a-card
                                        style="width:100%"
                                        :tab-list="recordDetailTabList"
                                        :active-tab-key="recordDetailKey"
                                        @tabChange="key => onTabChange2(key, 'recordDetailKey')"
                                >
                                    <span slot="customRender" slot-scope="item"> <a-icon type="copy" />{{ item.key }} </span>
                                    <div class="editor-container">
                                        <a-form v-if="recordDetailKey==='recordBaseInfo'" layout="inline" class="ant-advanced-search-form">
                                            <a-row :gutter="48">
                                                <a-col :md="8" :sm="24">
                                                    <a-form-item label="应用名称">
                                                        <a-input v-model="recordForms.appName" />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col :md="15" :sm="24">
                                                    <a-form-item label="流量入口">
                                                        <a-input v-model="recordForms.entranceDesc" />
                                                    </a-form-item>
                                                </a-col>
                                            </a-row>
                                            <a-row :gutter="48">
                                                <a-col :md="8" :sm="24">
                                                    <a-form-item label="录制机器">
                                                        <a-input v-model="recordForms.host" />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col :md="8" :sm="24">
                                                    <a-form-item label="TraceId">
                                                        <a-input v-model="recordForms.traceId" />
                                                    </a-form-item>
                                                </a-col>
                                            </a-row>
                                            <a-row :gutter="48">
                                                <a-col :md="8" :sm="24">
                                                    <a-form-item label="录制时间">
                                                        <a-input v-model="recordForms.gmtRecord" />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col :md="8" :sm="24">
                                                    <a-form-item label="录制环境">
                                                        <a-input v-model="recordForms.environment" />
                                                    </a-form-item>
                                                </a-col>
                                            </a-row>
                                        </a-form>
                                        <json-editor v-if="recordDetailKey==='request'" ref="jsonEditor" v-model="recordRequestJson" />
                                        <json-editor v-if="recordDetailKey==='response'" ref="jsonEditor" v-model="recordResponseJson" />
                                        <json-editor v-if="recordDetailKey==='sonRequest'" ref="jsonEditor" v-model="recordSonRequestJson" />
                                    </div>
                                </a-card>
                            </a-card>
                        </div>
                        <div style="background:#ECECEC; padding:10px">
                            <a-card title="回放结果" :bordered="false">
                                <a-card
                                        style="width:100%"
                                        :tab-list="replayDetailTabList"
                                        :active-tab-key="replayDetailKey"
                                        @tabChange="key => onTabChange3(key, 'replayDetailKey')"
                                >
                                    <span slot="customRender" slot-scope="item"> <a-icon type="copy" />{{ item.key }} </span>
                                    <div class="editor-container">
                                        <a-table :md="11" :sm="24" v-if="replayDetailKey==='replayBaseInfoList'" :columns="replayColumns" :data-source="replayBaseInfoList"  >
                                            <span slot="replayResult" slot-scope="replayResult">
                                              <a-tag :color="replayResult === 'success' ? 'green' : 'red'">
                                                {{ replayResult === 'success' ? "成功" : "失败"}}
                                              </a-tag>
                                            </span>
                                        </a-table>
<!--                                        <json-editor v-if="replayDetailKey==='replayBaseInfoList'" ref="jsonEditor" v-model="replayBaseInfoList" />-->
<!--                                        <json-editor v-if="replayDetailKey==='diffNode'" ref="jsonEditor" v-model="replayRequestJson" />-->
                                        <a-table v-if="replayDetailKey==='diffNode'" :columns="replayDiffColumns" :data-source="replayDiffInfoList">
                                        </a-table>
                                        <a-form v-if="replayDetailKey==='diffResponse'" layout="inline" class="ant-advanced-search-form">
                                            <a-row :gutter="48">
                                                <a-col :md="12" :sm="24">
                                                    <a-tabs type="card">
                                                        <a-tab-pane key="1" tab="预期结果">
                                                            <div class="editor-container">
                                                                <json-editor ref="jsonEditor" v-model="recordResponseJson" />
                                                            </div>
                                                        </a-tab-pane>
                                                    </a-tabs>
                                                </a-col>
                                                <a-divider type="vertical" />
                                                <a-col :md="11" :sm="24">
                                                    <!--                            <a-tabs v-model="helpTab" type="card" @change="callback">-->
                                                    <a-tabs type="card">
                                                        <a-tab-pane key="2" tab="实际结果">
                                                            <div class="editor-container">
                                                                <json-editor ref="jsonEditor" v-model="replayResponseJson" />
                                                            </div>
                                                        </a-tab-pane>
                                                    </a-tabs>
                                                </a-col>
                                            </a-row>
                                        </a-form>
                                        <json-editor v-if="replayDetailKey==='mockFlow'" ref="jsonEditor" v-model="replaySonRequestJson" />
                                    </div>
                                </a-card>
                            </a-card>
                        </div>
                    </div>

                </a-card>

            </div>
        </a-card>

    </div>
</template>

<script>
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

    import { online_detail,online_replay } from '@/api/repeate'
    // import { getRoleList, getServiceList } from '@/api/manage'

    import { STable, Ellipsis } from '@/components'

    import JsonEditor from '@/components/JsonEditor'

    const replayColumns = [
        {
            title: '执行结果',
            dataIndex: 'replayResult',
            key: 'replayResult',
            scopedSlots: { customRender: 'replayResult' },
        },
        {
            title: '执行耗时',
            dataIndex: 'replayCost',
            key: 'replayCost',
        },
        {
            title: '执行机器',
            key: 'replayIp',
            dataIndex: 'replayIp'
        },
        {
            title: 'RepeatId',
            key: 'repeatId',
            dataIndex: 'repeatId'
        },
        {
            title: 'TraceId',
            key: 'traceId',
            dataIndex: 'traceId'
        },
        {
            title: '执行时间',
            key: 'replayTime',
            dataIndex: 'replayTime'
        }
    ];

    const replayDiffColumns = [
        {
            title: '节点',
            dataIndex: 'node',
            key: 'node',
            scopedSlots: { customRender: 'node' },
        },
        {
            title: '原因',
            key: 'reason',
            dataIndex: 'reason',
			scopedSlots: { customRender: 'reason' },
        }
    ];

    function isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return true;
                }else{
                    return false;
                }

            } catch(e) {
                console.log('error：'+str+'!!!'+e);
                return false;
            }
        }
        console.log('It is not a string!')
    }

    export default {
        name: 'TableList',
        components: {
            STable,
            Ellipsis,
            JsonEditor
        },
        data () {
            return {
                replayColumns,
                replayDiffColumns,
                online_detail,
                moment,
                locale,
                tabList: [
                    {
                        key: 'record',
                        tab: '调用详情',
                        scopedSlots: { tab: 'customRender' },
                    },
                    {
                        key: 'replay',
                        tab: '回放详情',
                    },
                ],
                contentList: {
                    record: 'content1',
                    replay: 'content2',
                },
                detailTabList: [
                    {
                        key: 'request',
                        tab: '请求参数',
                        scopedSlots: { tab: 'customRender' },
                    },
                    {
                        key: 'response',
                        tab: '返回结果',
                    },
                    {
                        key: 'sonRequest',
                        tab: '子调用信息',
                    },
                ],
                recordDetailTabList: [
                    {
                        key: 'recordBaseInfo',
                        tab: '基础信息',
                        scopedSlots: { tab: 'customRender' },
                    },
                    {
                        key: 'request',
                        tab: '请求参数',
                        scopedSlots: { tab: 'customRender' },
                    },
                    {
                        key: 'response',
                        tab: '返回结果',
                    },
                    {
                        key: 'sonRequest',
                        tab: '子调用信息',
                    },
                ],
                replayDetailTabList: [
                    {
                        key: 'replayBaseInfoList',
                        tab: '基础信息',
                        scopedSlots: { tab: 'customRender' },
                    },
                    {
                        key: 'diffNode',
                        tab: '差异节点',
                        scopedSlots: { tab: 'customRender' },
                    },
                    {
                        key: 'diffResponse',
                        tab: '结果diff',
                    },
                    {
                        key: 'mockFlow',
                        tab: 'MOCK过程',
                    },
                ],
                key: 'record',
                detailKey: 'request',
                recordDetailKey: 'recordBaseInfo',
                replayDetailKey: 'replayBaseInfoList',
                // create model
                onlineTab: 'first',
                helpTab: 'second',
                visible: false,
                confirmLoading: false,
                mdl: null,
                loading: false,
                // 高级搜索 展开/关闭
                advanced: false,
                onlineId: 0,
                // 查询录制详情
                recordForms: {},
                // 查询回放详情
                replayForms: {},
                result: {},
                recordRequestJson: {},
                recordResponseJson: {},
                recordSonRequestJson: {},
                replayRequestJson: {},
                replayResponseJson: {},
                replaySonRequestJson: {},
                replayBaseInfoList: [],
                replayBaseInfo: {},
				replayParamForm: {},
                // replayBaseInfoList: [
                //     {
                //         "replayResult": "success",
                //         "replayCost": "35ms",
                //         "replayIp": "172.29.45.80",
                //         "repeatId": "010252212197162047387600410005ed",
                //         "traceId": "172029045080162047221713110019ed",
                //         "replayTime": "2021-05-08 19:37:56.0",
                //     },
                //     {
                //         "replayResult": "fail",
                //         "replayCost": "35ms",
                //         "replayIp": "172.29.45.80",
                //         "repeatId": "010252212197162047387600410005ed",
                //         "traceId": "172029045080162047221713110019ed",
                //         "replayTime": "2021-05-08 19:37:56.0",
                //     }
                // ],
                replayDiffInfoList: [],
                replayDiffInfo: {},
                // replayDiffInfoList: [
                //     {
                //         "node": "$",
                //         "expect": "入参5FService {CurrentServiceColor:null,CurrentRequestColor:} F the end:入参4",
                //         "actual": "入参5FService {CurrentServiceColor:null,CurrentRequestColor:} F the end:入参4",
                //         "reason": "class different"
                //     }
                // ]
            }
        },
        created () {
            // getRoleList({ t: new Date() })
            // this.onlineId = Number(this.$route.params.id);
            this.onlineId = this.$route.params.id;
            console.log(this.onlineId)
            // 后端实现的是列表和查详情用同一个接口
            online_detail({id: this.onlineId})
                .then(res => {
                    for (var i=0; i < res.data.length; i++) {
                        if (res.data[i].index === "record"){
                            this.recordForms = res.data[i].sourceAsMap
                            console.log(this.recordForms)
                            // 将配置信息转换成json对象
                            this.recordRequestJson = isJSON(this.recordForms.request)? JSON.parse(this.recordForms.request) : this.recordForms.request
                            this.recordResponseJson = isJSON(this.recordForms.response)? JSON.parse(this.recordForms.response) : this.recordForms.response
                            // todo 子调用信息取哪个字段？
                            // this.recordSonRequestJson = isJSON(this.recordForms.request)? JSON.parse(this.recordForms.request) : this.recordForms.request
                            this.recordSonRequestJson = JSON.parse("{}")
                        } else {
                            this.replayForms = res.data[i].sourceAsMap
                            console.log(this.replayForms)
                            // 将配置信息转换成json对象
                            // 1、组装基础信息（虽然是个list但是只有1个值）
                            this.replayBaseInfo.replayResult = this.replayForms.diffResult === "无差异"? "success" : "fail"
                            this.replayBaseInfo.replayCost = this.replayForms.cost + "ms"
                            this.replayBaseInfo.replayIp = this.replayForms.ip
                            this.replayBaseInfo.repeatId = this.replayForms.repeatId
                            this.replayBaseInfo.traceId = res.data[i].id
                            this.replayBaseInfo.replayTime  = this.replayForms.gmtModified
                            this.replayBaseInfoList.push(this.replayBaseInfo)
                            this.replayBaseInfoList = isJSON(this.replayBaseInfoList)? JSON.parse(this.replayBaseInfoList) : this.replayBaseInfoList
                            // 2、组装差异信息（虽然是个list但是只有1个值）
                            this.replayDiffInfo.node = this.replayForms.diffNode === ""? "无节点" : this.replayForms.diffNode
                            this.replayDiffInfo.expect = this.replayForms.recordResponse
                            this.replayDiffInfo.actual = this.replayForms.response
                            this.replayDiffInfo.reason = this.replayForms.diffResult === "无差异"? this.replayForms.diffResult : this.replayForms.diffReason
                            this.replayDiffInfoList.push(this.replayDiffInfo)
                            this.replayDiffInfoList = isJSON(this.replayDiffInfoList)? JSON.parse(this.replayDiffInfoList) : this.replayDiffInfoList
                            // 3、其他信息
                            this.replayRequestJson = isJSON(this.replayForms.request)? JSON.parse(this.replayForms.request) : this.replayForms.request
                            this.replayResponseJson = isJSON(this.replayForms.response)? JSON.parse(this.replayForms.response) : this.replayForms.response
                            // 此时接口返回的回放详情中是有recordResponse的
                            this.recordResponseJson = isJSON(this.replayForms.recordResponse)? JSON.parse(this.replayForms.recordResponse) : this.replayForms.recordResponse
                            // todo 子调用信息取哪个字段？
                            // this.replaySonRequestJson = isJSON(this.replayForms.request)? JSON.parse(this.replayForms.request) : this.replayForms.request
                            this.replaySonRequestJson = JSON.parse("{}")
                        }
                    }
                })
        },
        computed: {},
        methods: {
            onTabChange(key, type) {
                console.log(key, type);
                this[type] = key;
            },
            onTabChange2(key, type) {
                console.log(key, type);
                this[type] = key;
                // 每次切换tab都需要重新将配置信息转换成json对象
                this.recordRequestJson = isJSON(this.recordForms.request)? JSON.parse(this.recordForms.request) : this.recordForms.request
                this.recordResponseJson = isJSON(this.recordForms.response)? JSON.parse(this.recordForms.response) : this.recordForms.response
                // todo 子调用信息取哪个字段？
                // this.recordSonRequestJson = isJSON(this.recordForms.request)? JSON.parse(this.recordForms.request) : this.recordForms.request
                this.recordSonRequestJson = JSON.parse("{}")
            },
            onTabChange3(key, type) {
                console.log(key, type);
                this[type] = key;
                // 每次切换tab都需要重新将配置信息转换成json对象
                this.replayBaseInfoList = isJSON(this.replayBaseInfoList)? JSON.parse(this.replayBaseInfoList) : this.replayBaseInfoList
                this.recordRequestJson = isJSON(this.recordForms.request)? JSON.parse(this.recordForms.request) : this.recordForms.request
                this.recordResponseJson = isJSON(this.replayForms.recordResponse)? JSON.parse(this.replayForms.recordResponse) : this.replayForms.recordResponse
                // todo 子调用信息取哪个字段？
                // this.recordSonRequestJson = isJSON(this.recordForms.request)? JSON.parse(this.recordForms.request) : this.recordForms.request
                this.recordSonRequestJson = JSON.parse("{}")
                    // 将配置信息转换成json对象
                this.replayRequestJson = isJSON(this.replayForms.request)? JSON.parse(this.replayForms.request) : this.replayForms.request
                this.replayResponseJson = isJSON(this.replayForms.response)? JSON.parse(this.replayForms.response) : this.replayForms.response
                // todo 子调用信息取哪个字段？
                // this.replaySonRequestJson = isJSON(this.replayForms.request)? JSON.parse(this.replayForms.request) : this.replayForms.request
                this.replaySonRequestJson = JSON.parse("{}")
            },
			
			replay(record) {
			    this.replayParamForm.appName = this.recordForms.appName
                this.replayParamForm.traceId = this.recordForms.traceId
                this.replayParamForm.ip = this.recordForms.host
                this.replayParamForm.port = 'single'
                online_replay(this.replayParamForm).then(res => {
                    let rr = res.data.data
                    console.log(rr)
                    if (rr.success) {
                        this.$message.success(`【traceId=${this.replayParamForm.traceId}】 ${rr.message}`)
                    } else {
                        this.$message.error(`【traceId=${this.replayParamForm.traceId}】 ${rr.message}`)
                    }
                }).catch(err => {
                    this.$message.error(`请求后端接口报错了！请联系管理员！`)
                })
                this.visible = false;
                this.selectedHost = "请选择";
                this.selectedRadio = "0";
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
