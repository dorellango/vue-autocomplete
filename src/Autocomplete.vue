<template>
    <div class="relative">
        <input v-model="query"
            class="do-control"
            :class="[ selected ? 'font-bold': '', controlCss]"
            type="text"
            :placeholder="[ selected ? '' : placeholder]"
            @click="clicked"
            @input="search">

        <!-- searching -->
        <!-- <div v-show="this.searching"
            class="pointer-events-none absolute pin-y pin-r flex items-center px-2"> -->
            <!-- pointer-events-none absolute pin-y pin-r flex items-center px-2 -->
            <!-- <svg class="fill-current h-6 w-6 animated pulse infinite text-grey" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/></svg>
        </div> -->

        <div v-if="selected"
            :class="['do-selected', selectedCss]"> <!-- pointer-events-none absolute pin-y pin-l flex items-center ml-2 my-1  px-2 bg-teal text-teal-lightest text-sm rounded -->
            <slot name="selected" :selected="selected">
                {{ selected[keyName] }}
            </slot>
        </div>

        <!-- dropdown -->
        <!-- shadow-md mt-1 absolute pin-x z-50 bg-white -->
        <div v-show="show"
            :class="[ maxHeight ? 'overflow-y-scroll' : '', 'do-dropdown', dropdownCss ]"
            :style="{ maxHeight: maxHeight + 'px' }"
            >
            <template v-if="matches.length > 0"> <!-- text-sm px-2 py-2 block border-b border-grey-light hover:bg-blue-light hover:text-blue-lightest text-grey-dark cursor -->
                <a href="#"
                    v-for="(match, index) in matches.slice(0, 10)"
                    :class="['do-matches', matchesCss]"
                    @click.prevent="select(match)"
                    :key="index">
                    <slot name="match" :match="match">
                        {{ match[keyName] }}
                    </slot>
                </a>
            </template>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";

export default {
    data () {
        return {
            show: false,
            query: '',
            searching: false,
            matches: [],
            selected: false,
        }
    },
    props: [
        'keyName',
        'keyValue',
        'endpoint',
        'placeholder',
        'overwrite',
        'maxHeight',
        'controlCss',
        'selectedCss',
        'dropdownCss',
        'matchesCss',
        'items'
    ],
    // mounted() {
    //     if(this.overwrite) {
    //         this.select(this.overwrite);
    //     }
    // },
    methods: {
        search(event){
            this.$emit('input', event.target.value);
            this.$emit('searching', event.target.value);
            if(this.query === '') return this.reset();
            this.show = true;
            this.searching = true;
            this.selected = false;

            this[`fetch${this.items ? 'Items' : 'Endpoint'}`]();

            // this.{};
        },
        fetchEndpoint: _.throttle(function() {
            axios.get(this.endpoint + this.query)
            .then(response => {
                this.matches = response.data
                this.searching = false
            })
        }, 1500),
        fetchItems() {
            this.matches = this.items.filter(item => item[this.keyName].toLowerCase().indexOf(this.query.toLowerCase()) > -1)
            this.searching = false
        },
        select(match) {
            this.selected = match
            this.show = false
            this.query = ''

            this.$emit('selected', match);
            if (this.keyValue) {
                this.$emit('input', match[this.keyValue]);
            }
        },
        clicked() {
            this.reset();
            this.$emit('clicked');
            if (this.keyValue) {
                this.$emit('input', '');
            }
        },
        reset(){
            this.query = ''
            this.matches = [];
            this.show = false;
            this.selected = false;
        },
    }
}
</script>
