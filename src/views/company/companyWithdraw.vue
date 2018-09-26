<template>
  <div class="company-withdraw">
    <el-row :gutter="20">
      <el-col :span="2">
        <el-button @click="clickAgree">同意已勾选</el-button>
      </el-col>
      <el-col :span="3">
        <el-button>导入</el-button>
        <el-button>导出</el-button>
      </el-col>
      <el-col :span="3">
        <el-select v-model="companyName" placeholder="请选择">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="companyStatus" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-date-picker
          v-model="rechargeTime"
          type="daterange"
          align="right"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
        >
        </el-date-picker>
        <el-button @click="importFun">表格导出</el-button>
      </el-col>

      <el-col :span="6">
        <el-input placeholder="输入单号、目标地址" v-model="searchText" class="input-with-select">
          <el-button slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
    <div style="margin-top:20px;">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          type="selection"
        >
        </el-table-column>
        <el-table-column
          prop="time"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="order"
          label="单号">
        </el-table-column>
        <el-table-column
          prop="company"
          label="商家">
        </el-table-column>
        <el-table-column
          prop="founds"
          label="提币金额">
        </el-table-column>
        <el-table-column
          prop="from"
          width="400"
          label="目标地址">
        </el-table-column>
        <el-table-column
          prop="hash"
          width="600"
          label="交易哈希">
          <template slot-scope="scope">
            <a target="_blank" :href="`https://etherscan.io/search?q=${scope.row.hash}`">{{scope.row.hash}}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                待审核<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>同意</el-dropdown-item>
                <el-dropdown-item>拒绝</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:30px; text-align:center;">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="50">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'companyWithdraw',
    data() {
      return {
        rechargeTime: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        searchText: '',
        timeChange: [
          {
            name: '全部状态',
            id: 0
          },
          {
            name: '待审核',
            id: 1
          },
          {
            name: '待提币',
            id: 2
          },
          {
            name: '拒绝',
            id: 3
          },
          {
            name: '正在提币',
            id: 4
          },
          {
            name: '提币成功',
            id: 5
          },
          {
            name: '提币失败',
            id: 6
          }
        ],
        dateType: 0,
        tableData: [
          {
            time: '2017/01/11',
            order: 'W123123123',
            company: '京东商城',
            founds: '2000ETH',
            to: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            from: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            hash: '0x96ab8901985b15f27a26e0f0b6fe1bba6aeb285268c604c6f8d556a400788bcf'
          },
          {
            time: '2017/01/11',
            order: 'W123123123',
            company: '京东商城',
            founds: '2000ETH',
            to: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            from: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            hash: '0x96ab8901985b15f27a26e0f0b6fe1bba6aeb285268c604c6f8d556a400788bcf'
          },
          {
            time: '2017/01/11',
            order: 'W123123123',
            company: '京东商城',
            founds: '2000ETH',
            to: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            from: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            hash: '0x96ab8901985b15f27a26e0f0b6fe1bba6aeb285268c604c6f8d556a400788bcf'
          },
          {
            time: '2017/01/11',
            order: 'W123123123',
            company: '京东商城',
            founds: '2000ETH',
            to: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            from: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            hash: '0x96ab8901985b15f27a26e0f0b6fe1bba6aeb285268c604c6f8d556a400788bcf'
          },
          {
            time: '2017/01/11',
            order: 'W123123123',
            company: '京东商城',
            founds: '2000ETH',
            to: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            from: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            hash: '0x96ab8901985b15f27a26e0f0b6fe1bba6aeb285268c604c6f8d556a400788bcf'
          }
        ],
        companyName: '1',
        companyStatus: '1',
        companyList: [
          {
            name: '全部商家',
            id: '1'
          },
          {
            name: '淘宝商家',
            id: '2'
          },
          {
            name: '京东商家',
            id: '3'
          }
        ],
        statusList: [
          {
            name: '全部状态',
            id: '1'
          },
          {
            name: '已分配',
            id: '2'
          },
          {
            name: '未分配',
            id: '3'
          }
        ]
      }
    },
    methods: {
      importFun() {
        console.log(this.rechargeTime)
      },
      handleCurrentChange(t) {
        console.log(t)
      },
      changeType(t) {
      },
      clickAgree() {
        this.$confirm('是否同意所有审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(() => {
        })
      }
    }
  }
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
  .company-withdraw{
    padding:20px;
  }
</style>
