<template>
  <button v-if="show" type="button" class="btn btn-success" v-on:click="saveList">
    Save
  </button>
</template>

<script>
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  props: {
    list: Object
  },
  methods: {
    saveList() {
      // Method to create or update a list
      // If list.id exists, update existing list
      if (this.list.id) {
        let payload = {
          query: this.$store.state.mutationUpdateList,
          variables: {
            id: this.list.id,
            sysListPatch: {
              name: this.list.name,
              description: this.list.description,
              userGroupId: this.list.userGroupId
            }
          }
        };
        let headers = {};
        if (this.$session.exists()) {
          headers = { Authorization: "Bearer " + this.$session.get("jwt") };
        }
        this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
          function(response) {
            if (response.data.errors) {
              this.displayError(response);
            } else {
              this.list.updatedDate = response.data.data.updateSysListById.sysList.updatedDate;
              this.list.sysUserByUpdatedById.email = response.data.data.updateSysListById.sysList.sysUserByUpdatedById.email;
              this.list.tableName = response.data.data.updateSysListById.sysList.tableName;
            }
          },
          // Error callback
          function(response) {
            this.displayError(response);
          }
        );
      }
      // If list.id does not exist, create a new list
      else {
        let payload = {
          query: this.$store.state.mutationCreateList,
          variables: {
            sysList: {
              name: this.list.name,
              description: this.list.description,
              userGroupId: this.list.userGroupId
            }
          }
        };
        let headers = {};
        if (this.$session.exists()) {
          headers = { Authorization: "Bearer " + this.$session.get("jwt") };
        }
        this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
          function(response) {
            if (response.data.errors) {
              this.displayError(response);
            } else {
              // Capture new list Id in case user wants to delete or update it
              this.list.id = response.data.data.createSysList.sysList.id;
              this.$router.push({
                name: "edit-list",
                params: {
                  listId: this.list.id
                }
              });
            }
          },
          // Error callback
          function(response) {
            this.displayError(response);
          }
        );
      }
    }
  },
  computed: {
    show() {
      let roles = ["admin", "advanced"];
      return roles.includes(this.$store.state.currentUser.role);
    }
  }
};
</script>
