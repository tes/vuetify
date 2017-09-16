<script>
  import Input from '../../mixins/input'

  export default {
    name: 'v-radio-group',

    mixins: [Input],

    model: {
      prop: 'inputValue',
      event: 'change'
    },

    provide () {
      return {
        isMandatory: () => this.mandatory,
        name: () => this.name
      }
    },

    props: {
      column: {
        type: Boolean,
        default: true
      },
      inputValue: null,
      mandatory: {
        type: Boolean,
        default: true
      },
      name: String,
      row: Boolean
    },

    data () {
      return {
        internalTabIndex: -1
      }
    },

    watch: {
      inputValue (val) {
        this.getRadios().forEach((radio) => {
          radio.isActive = val === radio.value
        })
      }
    },

    computed: {
      classes () {
        return {
          'radio-group': true,
          'radio-group--column': this.column && !this.row,
          'radio-group--row': this.row
        }
      }
    },

    methods: {
      getRadios () {
        return this.$children
          .filter((child) => child.$el.classList.contains('radio'))
      },
      toggleRadio (value) {
        if (this.disabled) {
          return
        }

        this.shouldValidate = true
        this.$emit('change', value)
        this.$nextTick(() => this.validate())

        this.getRadios()
          .filter(r => r.value !== value)
          .forEach(r => r.isActive = false)
      },
      radioBlur (e) {
        if (!e.relatedTarget || !e.relatedTarget.classList.contains('radio')) {
          this.shouldValidate = true
          this.$emit('blur', this.inputValue)
        }
      }
    },

    mounted () {
      this.getRadios().forEach((radio) => {
        radio.isActive = this.inputValue === radio.value
        radio.$el.tabIndex = radio.$el.tabIndex > 0 ? radio.$el.tabIndex : 0
        radio.$on('change', this.toggleRadio)
        radio.$on('blur', this.radioBlur)
        radio.$on('focus', this.radioFocus)
      })
    },

    beforeDestroy () {
      this.getRadios().forEach((radio) => {
        radio.$off('change', this.toggleRadio)
        radio.$off('blur', this.radioBlur)
        radio.$off('focus', this.radioFocus)
      })
    },

    render (h) {
      const data = {
        attrs: {
          role: 'radiogroup'
        }
      }
      return this.genInputGroup(this.$slots.default, data)
    }
  }
</script>

<style lang="stylus" src="../../stylus/components/_input-groups.styl"></style>
<style lang="stylus" src="../../stylus/components/_selection-controls.styl"></style>

<style lang="stylus" src="../../stylus/components/_radio-group.styl"></style>