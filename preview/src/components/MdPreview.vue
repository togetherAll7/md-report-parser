

<template lang="pug">
.row
  .col
    .box
      textarea.md-editor(v-model="md" rows="20")
  .col
    .box
      .md-preview(v-html="output")
      pre {{ parsed }}
   
</template>

<script>
import { MdParser } from './lib/MdParser'
const parser = MdParser()
export default {
  data () {
    return {
      md: '# Test\n - one \n'
    }
  },
  computed: {
    output () {
      return parser.render(this.md)
    },
    parsed () {
      return parser.parse(this.md)
    }
  },
  methods: {

  }
}
</script>

<style lang="stylus">
@import './assets/style/layout.styl'



.md-editor,.md-preview
  min-width calc(100% - 2em)
  margin 1em
  border none


</style>
