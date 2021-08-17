<template>
  <div>
    <input
      ref="photo"
      class="hidden"
      type="file"
      multiple
      @change="updatePhotoPreview"
    ></div>
</template>
<script>
export default {
  name: 'MyMultiUpload',
  methods: {
    updatePhotoPreview() {

    }
  }
}
</script>
