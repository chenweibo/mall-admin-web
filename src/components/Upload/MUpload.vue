<template>
  <div class="fa">
    <el-image
      style="width: 140px; height: 140px;border-radius: 4px;border: 1px dashed #c0ccda;margin-right:10px"
      :src="img"
      :preview-src-list="srcList"
      fit="fill"
    />
    <!-- Profile Photo File Input -->
    <input
      ref="photo"
      class="hidden"
      type="file"
      @change="updatePhotoPreview"
    >
    <el-button class="btn" type="primary" @click.prevent="selectNewPhoto">点击上传<i class="el-icon-upload el-icon--right" /></el-button>

    <!-- Current Profile Photo -->
  </div>
</template>
<script>
import { upload } from '@/api/minio'
export default {
  name: 'MUpload',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      img: this.url,
      srcList: [this.url],
      minioUploadUrl: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8080/minio/upload' : process.env.VUE_APP_BASE_API + '/minio/upload'
    }
  },
  watch: {
    url: {
      handler(newValue, oldValue) {
        this.img = newValue
        this.srcList = [newValue]
      },
      deep: true // 深度监听父组件传过来对象变化
    }
  },
  methods: {
    selectNewPhoto() {
      this.$refs.photo.click()
    },
    updatePhotoPreview(e) {
      const forms = new FormData()
      forms.append('file', this.$refs.photo.files[0])
      // 添加请求头
      upload(forms)
        .then(response => {
          // this.url = response.data.url
          this.$emit('update:url', response.data.url)
          this.img = response.data.url
          this.srcList = [response.data.url]
          // console.log(response.data)
        })
    }

  }

}
</script>
<style lang="scss" scoped>
.hidden{
  display: none
}
.fa{
    display: flex;
        align-items:center
}
.btn{
    display: block;

}

</style>

