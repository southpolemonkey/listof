<template>
  <button type="button" class="btn btn-outline-secondary ml-1" v-on:click="close">
    Close
  </button>
</template>

<script>
export default {
  props: {
    listId: Number
  },
  methods: {
    close() {
      this.$router.push({
        name: "view-list-value",
        params: {
          listId: this.listId
        }
      });
    }
  }
};
</script>
