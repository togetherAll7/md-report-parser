

<template lang="pug">
.row 
  .col
    ul.menu
      li
        button(@click='showExample') show example
      li
        button(@click='insertFinding') insert finding
      li
        button(@click='clear') clear
  .col
.row
  .col
    .box
      textarea.md-editor(@input="updateMd" :value="md" rows="20" cols="10")
  .col
    .box
      .md-preview(v-html="output")

</template>
<script>
import MdParser from '../../src/MdParser'
// import { diff } from './lib/Diff'
import 'highlight.js/styles/stackoverflow-light.css'
const parser = MdParser()
export default {
  data () {
    return {
      md: '# Test\n - one \n',
      example: '',
      findingTemplate: '',
      meta: {}
    }
  },
  async beforeMount () {
    this.example = await (await fetch('/templates/report-model.md')).text()
    this.findingTemplate = await (await fetch('/templates/finding.md')).text()
  },
  computed: {
    output () {
      return parser.render(this.md)
    },
    parsed () {
      const { meta, md } = this
      return parser.parse(md, { meta })
    }
  },
  methods: {
    updateMd (event) {
      const { value } = event.target
      let { md, editions } = this
      // editions.push(diff(md, value))
      this.md = value
    },
    createEdition () {
      const created = Date.now()
      this.editions.push({ created })
    },
    clearEditions () {
      this.editions = []
    },
    insertFinding () {
      this.md += this.findingTemplate
    },
    showExample () {
      this.md = this.example
    },
    clear () {
      this.md = ''
    }
  }
}
</script>

<style lang="stylus">
@import './assets/style/layout.styl'
@import './assets/style/reports.styl'

.md-editor,.md-preview
  min-width calc(100% - 4em)  
  margin 2em
  border none
  min-height calc(100% - 4em)

.col
  max-width 50%

.finding, .data-block
  border blue dashed 1px
  margin 1em

ul.menu
  list-style none
  display flex
  flex-flow row
  li 
    margin 0 .5em
</style>
