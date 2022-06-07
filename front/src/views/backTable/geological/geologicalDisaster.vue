<template>
  <div class="main">
    <el-button icon="el-icon-add-location" @click="addGeological" style="margin-bottom: 20px" type="primary">新增</el-button>
    <el-table ref="filterTable" :data="tableData" style="width: 100%">
      <el-table-column align="center" prop="type" label="灾害类型" width="180" />
      <el-table-column align="center" prop="date" label="发生时间" width="180" />
      <el-table-column align="center" prop="address" label="详细地址" width="450" />
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
      <el-table-column align="center" prop="lnglat" label="经纬度" width="250" />
      <el-table-column align="center" prop="people" label="伤亡人数（人）" width="100" />
      <el-table-column align="center" prop="money" label="损失资金（元）" width="100" />
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
        :page-size="pagesize"
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
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Detail from './detail.vue'
import { getGeological, saveGeological, updateGeologicalById, deleteGeologicalById } from '@/api/geological'
import { CodeToText } from 'element-china-area-data'

export default {
  name: 'GeologicalDisaster',
  components: {
    Detail
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogType: 'info',
      currentPage: 1,
      total: 0,
      pagesize: 10,
      geologicalId: null,
    }
  },
  computed:{
    table() {
      return this.tableData.map(item => {
        return item.date.split('T')[0]
      })
    },
    formData(){
      return {
        address: this.$refs.detail.form.regions[2],
        type: this.$refs.detail.form.type,
        date: this.formatDate(this.$refs.detail.form.date),
        lnglat: this.$refs.detail.form.longitude + ',' + this.$refs.detail.form.latitude,
        severity: this.$refs.detail.form.severity,
        people: this.$refs.detail.form.people,
        money: this.$refs.detail.form.money,
      }
    }
  },
  created() {
    this.getTableData();
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
      this.pagesize = val
     this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableData();
    },
    // 表格展示数据
    getTableData(){
      const pageInfo = {
        pageNum: this.currentPage,
        pageSize: this.pagesize
      }
      getGeological(pageInfo).then(res => {
        res.data.list.forEach(item => {
          item.date = item.date.split('T')[0]
          item.address = CodeToText[item.address.slice(0,2)+'0000'] + '——' + CodeToText[item.address.slice(0,4)+'00'] + '——' + CodeToText[item.address]
        });
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    // 查看详情
    handleClick(row, type) {
      console.log(row, type)
      this.showDialog(row.geological_id, type)
    },
    // 新增
    addGeological() {
      this.showDialog(null, 'add')
      this.$refs.detail.resetForm()
    },
    // 删除
    deleteGeological(id){
      const parm = {
        geologicalId: id,
      }
      deleteGeologicalById(parm).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getTableData()
      })
    },
    deleteItem(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteGeological(row.geological_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleClose() {
    },
    // 提交数据
    submit() {
      if(this.dialogType === 'add'){
        saveGeological(this.formData).then(res => {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.getTableData()
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '提交失败!'
          })
        })
      }else if(this.dialogType === 'edit'){
        let parms = {
          geologicalId: this.geologicalId,
          ...this.formData
        }
        updateGeologicalById(parms).then(res => {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.getTableData();
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '更新失败!'
          })
        })
      }
    },
    /**
     * @description 格式化日期函数
     */
    formatDate(date) {
      var y = date.getFullYear();  
      var m = date.getMonth() + 1;  
      m = m < 10 ? '0' + m : m;  
      var d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      return y + '-' + m + '-' + d;  
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
