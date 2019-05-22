<template>
  <div style="position:relative">
    <input
      v-model="query"
      :class="['do-control', controlCss]"
      type="text"
      :placeholder="[ selected ? '' : placeholder]"
      @click="clicked"
      @input="search"
    >
    <!-- searching -->
    <!-- <div v-show="this.searching"
            class="pointer-events-none absolute pin-y pin-r flex items-center px-2"> -->
    <!-- pointer-events-none absolute pin-y pin-r flex items-center px-2 -->
    <!-- <svg class="fill-current h-6 w-6 animated pulse infinite text-grey" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/></svg>
        </div> -->
    <div
      v-if="selected"
      :class="['do-selected', selectedCss]"
    >
      <slot
        name="selected"
        :selected="selected"
      >
        {{ selected[keyName] }}
      </slot>
    </div>
    <!-- dropdown -->
    <div
      v-show="show"
      :class="[ maxHeight ? 'overflow-y-scroll' : '', 'do-dropdown', dropdownCss ]"
      :style="{ maxHeight: maxHeight + 'px' }"
    >
      <template v-if="matches.length > 0">
        <a
          v-for="(match, index) in matches.slice(0, 10)"
          :key="index"
          href="#"
          :class="['do-matches', matchesCss]"
          @click.prevent="select(match)"
        >
          <slot
            name="match"
            :match="match"
          >
            {{ match[keyName] }}
          </slot>
        </a>
      </template>
    </div>
  </div>
</template>

<script>
export default {
	props: {
		keyName: {
			type: String,
			default: null
		},
		keyValue: {
			type: String,
			default: null
		},
		endpoint: {
			type: String,
			default: null
		},
		placeholder: {
			type: String,
			default: null
		},
		maxHeight: {
			type: String,
			default: null
		},
		controlCss: {
			type: String,
			default: null
		},
		selectedCss: {
			type: String,
			default: null
		},
		dropdownCss: {
			type: String,
			default: null
		},
		matchesCss: {
			type: String,
			default: null
		},
		isAjax: {
			type: Boolean,
			default: false
		},
		items: {
			type: Array,
			default () {
				return []
			}
		},
	},
	data () {
		return {
			show: false,
			query: '',
			searching: false,
			matches: [],
			selected: false,
		}
	},
	watch: {
		items() {
			if(this.isAjax) {
				this.matches = this.items
			}
		}
	},
	methods: {
		search (event){
			this.$emit('input', event.target.value)
			this.$emit('searching', event.target.value, this.toggleLoading)
			if(this.query === '') return this.reset()
			this.show = true
			this.selected = false
			if(! this.isAjax) {
				this.fetchItems()
			}
			
		},
		toggleLoading (toggle = null) {
			if (toggle == null) {
				return (this.searching = !this.searching)
			}
			return (this.searching = toggle)
		},
		fetchItems () {
			this.matches = this.items.filter(item => item[this.keyName].toLowerCase().indexOf(this.query.toLowerCase()) > -1)
			this.searching = false
		},
		select (match) {
			this.selected = match
			this.show = false
			this.query = ''

			this.$emit('selected', match)
			if (this.keyValue) {
				this.$emit('input', match[this.keyValue])
			}
		},
		clicked () {
			this.reset()
			this.$emit('clicked')
			if (this.keyValue) {
				this.$emit('input', '')
			}
		},
		reset (){
			this.query = ''
			this.matches = []
			this.show = false
			this.selected = false
		},
	}
}
</script>