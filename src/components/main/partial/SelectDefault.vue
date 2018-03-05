<template>
    <div class="m-1">
      <b>{{label}}</b>
      <select class="select-input-styles border-0" ref="input" v-bind:value="value" @input="updateLookUpType($event.target.value)" >
        <option value="icontains">contains</option>
        <option value="iexact">equals</option>
        <option value="istartswith">starts with</option>
        <option value="iendswith">ends with</option>
      </select>
    </div>
</template>

<script>
  // HOW TO SEND DATA FROM CHILD TO PARENT https://vuejs.org/v2/guide/components.html under #Form Input Components using Custom Events
    export default {
      props: {
        label: {
          defualt: 'Field name',
          Type: String
        },
        value: {
          default: 'icontains',
          Type: String
        }
      },
      name: "select-default",
      methods: {
        updateLookUpType: function (value) {
          console.log(value);
          this.$emit('input', value)
        },
      }
    }
</script>

<style scoped>
  .select-input-styles {
    background-color: #ffffff;
  }
</style>
