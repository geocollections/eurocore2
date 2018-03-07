<template>
  <div>
    <input ref="input" v-bind:value="value" @input="updateName($event.target.value)"/>
    <ul>
      {{autocompleteResults}}
      <!--<li v-for="option in autocompleteResults">-->
        <!--{{option}}-->
      <!--</li>-->
    </ul>
  </div>
</template>

<script>
    export default {
      props: {
        value: {
          default: '',
          Type: String
        },
        autocompleteResults: {
          default() {
            return []
          },
          Type: Array
        }
      },
      name: "autocomplete-field",
      methods: {
        updateName: function (value) {
          this.$emit('input', value);
        }
      }
    }
</script>

<style scoped>

</style>
