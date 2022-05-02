<template>
  <div class="main">
    <el-button icon="el-icon-add-location" @click="addGeological" style="margin-bottom: 20px" type="primary">新增</el-button>
    <el-table ref="filterTable" :data="tableData" style="width: 100%">
      <el-table-column align="center" prop="type" label="灾害类型" width="180" />
      <el-table-column align="center" prop="date" label="发生时间" width="180" />
      <el-table-column align="center" prop="provence" label="省份" width="140" />
      <el-table-column align="center" prop="city" label="地市" width="160" />
      <el-table-column align="center" prop="county" label="区县" width="140" />
      <el-table-column align="center" prop="latlng" label="经纬度" width="200" />
      <el-table-column
        align="center"
        prop="severity"
        label="严重程度"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.severity === '轻微' ? 'primary' : scope.row.severity === '较严重'?'warning':'danger'"
            disable-transitions
          >{{ scope.row.severity }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button icon="el-icon-info" @click="handleClick(scope.row, 'info')" type="text" size="small">查看</el-button>
          <el-button icon="el-icon-edit-outline" @click="handleClick(scope.row, 'edit')" type="text" size="small">编辑</el-button>
          <el-button icon="el-icon-delete" @click="deleteItem(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
    <el-dialog
      title="灾害详情"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <Detail ref="detail" :geological-id="geologicalId" :dialogType="dialogType"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Detail from './detail.vue'
export default {
  name: 'GeologicalDisaster',
  components: {
    Detail
  },
  data() {
    return {
      tableData: [
        {
          id: 1,
          date: '2021-05-03',
          type: '山体滑坡',
          provence: '山东省',
          city: '聊城市',
          county: '阳谷县',
          latlng: '114.422364,40.671274',
          severity: '严重'
        },
        {
          date: '2021-01-15',
          type: '崩塌灾害',
          provence: '四川省',
          city: '南充市',
          county: '顺庆区',
          latlng: '116.258446,37.686622',
          severity: '较严重'
        },
        {
          date: '2021-10-02',
          type: '泥石流灾',
          provence: '浙江省',
          city: '衢州市',
          county: '柯城区',
          latlng: '114.171713,22.44573',
          severity: '严重'
        },
        {
          date: '2021-3-06',
          type: '地面塌陷',
          provence: '甘肃省',
          city: '平凉市',
          county: '崆峒区',
          latlng: '111.66543,40.799421',
          severity: '严重'
        },
        {
          date: '2021-04-01',
          type: '地裂缝灾',
          provence: '西藏自',
          city: '治区昌都市',
          county: '江达县',
          latlng: '123.506034,47.917838',
          severity: '严重'
        },
        {
          date: '2021-06-03',
          type: '地面沉降',
          provence: '新疆维吾尔自治区',
          city: '博尔塔拉蒙古自治州',
          county: '精河县',
          latlng: '114.675262,27.811301',
          severity: '轻微'
        }
      ],
      dialogVisible: false,
      dialogType: 'info',
      currentPage: 1,
      total: 0,
      geologicalId: null
    }
  },
  created() {
    this.total = this.tableData.length
  },
  methods: {
    showDialog(id, type) {
      this.dialogVisible = true
      this.geologicalId = id
      this.dialogType = type
    },
    resettypeFilter() {
      this.$refs.filterTable.clearFilter('type')
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter()
    },
    filterTag(value, row) {
      return row.tag === value
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    // 查看详情
    handleClick(row, type) {
      console.log(row, type)
      this.showDialog(row.id, type)
    },
    // 新增
    addGeological() {
      this.showDialog(null, 'add')
      this.$refs.detail.resetForm()
    },
    deleteItem(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleClose() {
    }
  }
}
</script>

<style scoped>
.main {
  padding: 40px;
}
.pagination{
    margin-top: 20px;
}
</style>
