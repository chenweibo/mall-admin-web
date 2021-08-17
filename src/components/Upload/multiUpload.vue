<template>
  <div>
    <el-upload
      :action="useOss?ossUploadUrl:minioUploadUrl"
      :data="useOss?dataObj:null"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      multiple
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus" />
      <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
        > <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            class="el-upload-list__item-edit"
            @click="handleEdit(file)"
          >
            <i class="el-icon-setting" />
          </span>
          <span

            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <!-- Profile Photo File Input -->
    <input
      ref="photo"
      class="hidden"
      type="file"
      @change="updatePhotoPreview"
    >
    <!-- <el-tag type="warning" size="mini">提示：商品详情页内相册图组</el-tag>
   -->

  </div>
</template>
<script>
import { policy } from '@/api/oss'
import _ from 'lodash'
import { upload } from '@/api/minio'
export default {
  name: 'MultiUpload',
  props: {
    // 图片属性数组
    value: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 最大上传图片数量
    maxCount: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: ''
      },
      q: [],
      editKey: undefined,
      dialogVisible: false,
      dialogImageUrl: null,
      useOss: false, // 使用oss->true;使用MinIO->false
      ossUploadUrl: 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com',
      minioUploadUrl: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8079/minio/upload' : process.env.VUE_APP_BASE_API + 'minio/upload'
    }
  },
  computed: {

    fileList() {
      const fileList = []
      for (let i = 0; i < this.value.length; i++) {
        fileList.push({ url: this.value[i] })
      }
      return fileList
    }
  },
  watch: {

  },
  created() {

  },
  mounted() { },
  methods: {
    updatePhotoPreview(e) {
      const forms = new FormData()
      forms.append('file', this.$refs.photo.files[0])
      // 添加请求头
      upload(forms)
        .then(response => {
          // this.url = response.data.url
          // console.log(this.editKey)

          this.fileList[this.editKey].url = response.data.url
          this.emitInput(this.fileList)
          // this.fileList.splice(index, 1, { key: type, value: now })

          // this.srcList = [response.data.url]
          // console.log(response.data)
        })
    },
    emitInput(fileList) {
      const value = []
      fileList.forEach(element => {
        value.push(element.url)
      })

      this.$emit('input', value)
    },
    handleEdit(file) {
      // console.log(file)
      const b = _.findIndex(this.fileList, function(o) { return o.url === file.url })
      this.$refs.photo.click()
      this.editKey = b
      // console.log(index)
    },
    handleRemove(file) {
      // console.log(file.url)
      // const a = _.findIndex(this.value, function(o) { return o === file.url })
      const b = _.findIndex(this.fileList, function(o) { return o.url === file.url })
      // this.value.splice(a, 1)
      this.fileList.splice(b, 1)
      this.emitInput(this.fileList)
      // if (file.response) {
      //   const url = file.response.data.url
      //   _.remove(this.fileList, function(item) {
      //     return item.url === url
      //   })
      //   this.value =
      //   this.emitInput(this.fileList)
      //   // console.log(arr)
      // }
      // const index = _.findIndex(this.fileList, file)
      // if (index !== -1) {
      //   // console.log(index)
      //   this.fileList.splice(index, 1)
      //   console.log(this.fileList)
      //   this.emitInput(this.fileList)
      // }

      // this.emitInput(file)
    },
    handlePreview(file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    beforeUpload(file) {
      const _self = this
      if (!this.useOss) {
        // 不使用oss不需要获取策略
        return true
      }
      return new Promise((resolve, reject) => {
        policy().then(response => {
          _self.dataObj.policy = response.data.policy
          _self.dataObj.signature = response.data.signature
          _self.dataObj.ossaccessKeyId = response.data.accessKeyId
          _self.dataObj.key = response.data.dir + '/${filename}'
          _self.dataObj.dir = response.data.dir
          _self.dataObj.host = response.data.host
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    handleUploadSuccess(res, file) {
      // console.log(res, file)
      const url = res.data.url
      // console.log(res)

      this.fileList.push({ name: file.name, url: url, status: 'success' })
      file.url = url
      this.value.push(url)
      // this.emitInput(this.fileList)
    },
    handleExceed(files, fileList) {
      this.$message({
        message: '最多只能上传' + this.maxCount + '张图片',
        type: 'warning',
        duration: 1000
      })
    }
  }
}
</script>
<style lang="scss" >
.hidden{
  display: none
}
</style>

