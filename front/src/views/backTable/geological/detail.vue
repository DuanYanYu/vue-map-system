<template>
  <div>
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="灾害类型">
        <el-select v-model="form.type" :disabled="dialogType==='info'" placeholder="请选择灾害类型">
          <el-option v-for="item in geologicalTypes" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="灾害地点">
        <el-cascader
          width="400px"
          :disabled="dialogType==='info'"
          v-model="form.regions"
          size="large"
          placeholder="请选择灾害地点"
          :options="options"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="发生时间">
        <el-col :span="11">
          <el-date-picker v-model="form.date" :disabled="dialogType==='info'" type="date" placeholder="选择日期" style="width: 100%;"/>
        </el-col>
      </el-form-item>
      <el-row>
        <el-col class="line" :span="10">
          <el-form-item label="经度：">
            <el-input v-model="form.longitude" :disabled="dialogType==='info'" type="number" placeholder="请输入经度"/>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="10">
          <el-form-item label="纬度">
            <el-input v-model="form.latitude" :disabled="dialogType==='info'" type="number" placeholder="请输入纬度"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="严重程度">
        <el-select v-model="form.severity" :disabled="dialogType==='info'" placeholder="请选择灾害类型">
          <el-option v-for="item in severitys" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="伤亡人数（人）">
        <el-input v-model.number="form.people" :disabled="dialogType==='info'" type="number" placeholder="请输入伤亡人数"/>
      </el-form-item>
      <el-form-item label="损失资金（元）">
        <el-input v-model.number="form.money" :disabled="dialogType==='info'" type="number" placeholder="请输入损失的资金"/>
      </el-form-item>
      <el-form-item label="位置预览" />
      <mc-gis v-if="form.longitude && form.latitude" :m-width="700" :m-height="400" :tdt-base-map="tdtProp">
        <mc-point :point="point" :icon="icon" />
      </mc-gis>
    </el-form>
  </div>
</template>

<script>
// eslint-disable-next-line
import { regionData, CodeToText } from 'element-china-area-data'
import { getGeologicalById } from '@/api/geological'

export default {
  name: 'Detail',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    geologicalId: {
      type: Number,
      default: null
    },
    // eslint-disable-next-line vue/require-default-prop
    dialogType: {
      type: String
    }
  },
  data() {
    return {
      options: regionData,
      icon: require('@/assets/imgs/point.png'),
      tdtProp: {
        tk: 'f6e0f7525c9d5618f59bb0b9cde93751',
        mapType: 'img_c'
      },
      form: {
        regions: [],
        date: '',
        longitude: null,
        latitude: null,
        type: [],
        severity: "",
        people: null,
        money: null
      },
      geologicalTypes: [ // 灾害类型
        {
          label: '山体滑坡',
          value: '山体滑坡'
        },
        {
          label: '崩塌灾害',
          value: '崩塌灾害'
        },
        {
          label: '泥石流灾',
          value: '泥石流灾'
        },
        {
          label: '地面塌陷',
          value: '地面塌陷'
        },
        {
          label: '地裂缝灾',
          value: '地裂缝灾'
        },
        {
          label: '地面沉降',
          value: '地面沉降'
        }
      ],
      severitys: [ // 严重程度
        {
          label: '严重',
          value: '严重'
        },
        {
          label: '较严重',
          value: '较严重'
        },
        {
          label: '轻微',
          value: '轻微'
        }
      ]
    }
  },
  watch: {
    geologicalId: {
      handler(val) {
        if (val === null) {
          this.resetForm()
        } else {
          this.getDetail(val)
        }
      },
      immediate: true
    }
  },
  computed: {
    point() {
      return [
        Number(this.form.longitude), Number(this.form.latitude)
      ]
    }
  },
  created() {
  },
  methods: {
    resetForm() {
      this.form.regions = []
      this.form.date = ''
      this.form.longitude = null
      this.form.latitude = null
      this.form.type = []
      this.form.people = null
      this.form.money = null
    },
    handleChange() {
      var loc = ''
      for (let i = 0; i < this.form.regions.length; i++) {
        loc += CodeToText[this.form.regions[i]]
      }
      // alert(loc)
    },
    getDetail(id){
      const parm = {
        geologicalId: id
      }
      getGeologicalById(parm).then(res => {
        this.form.regions = [];
        this.form.regions.push(res.data.address.slice(0, 2)+'0000')
        this.form.regions.push(res.data.address.slice(0, 4)+'00')
        this.form.regions.push(res.data.address)
        this.form.date = res.data.date
        this.form.longitude = res.data.lnglat.split(',')[0]
        this.form.latitude = res.data.lnglat.split(',')[1]
        this.form.type = res.data.type
        this.form.severity = res.data.severity
        this.form.people = res.data.people
        this.form.money = res.data.money
      })
    },
    // 保存
    onSubmit() {

    }
  }
}
</script>

<style>

</style>
