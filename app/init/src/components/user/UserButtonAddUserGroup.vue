<template>
  <button v-if="show" type="button" class="btn btn-success" v-on:click="addUserGroup">
    Add User to Groups
  </button>
</template>

<script>
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  props: {
    user: Object,
    userGroups: Array
  },
  methods: {
    addUserGroup() {
      // Method to create a relationship between a user and a user group
      // Get list of current user groups
      let currentUserGroups = [];
      this.user.sysUserGroupMembershipsByUserId.nodes.forEach(
        function(userGroupMembership) {
          currentUserGroups.push(userGroupMembership["userGroupId"]);
        }.bind(this)
      );

      // For selected list of user groups
      // If current user group does not contain the new group, add user to it
      this.userGroups.forEach(
        function(userGroup) {
          if (currentUserGroups.includes(userGroup) == false) {
            // Method to insert a relationship between a user and a user group
            let payload = {
              query: this.$store.state.mutationCreateUserGroupMembership,
              variables: {
                sysUserGroupMembership: {
                  userId: this.user.id,
                  userGroupId: userGroup
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
                  let userGroupMembership = response.data.data.createSysUserGroupMembership.sysUserGroupMembership;
                  this.$emit("addUserGroupMembership", userGroupMembership);
                }
              },
              // Error callback
              function(response) {
                this.displayError(response);
              }
            );
          }
        }.bind(this)
      );

      // Refresh current user groups
      this.refreshCurrentUserGroups();
    },
    refreshCurrentUserGroups() {
      // Method to refresh current user's user groups
      let payload = {
        query: this.$store.state.queryGetCurrentUser,
        variables: { email: this.$session.get("email") }
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
            // Prepare list of current user groups
            let memberships = response.data.data.sysUserByEmail.sysUserGroupMembershipsByUserId.nodes;
            let currentUserGroups = [];
            for (let i = 0; i < memberships.length; i++) {
              currentUserGroups.push(memberships[i]["sysUserGroupByUserGroupId"]);
            }

            // Reset current user groups
            this.$session.set("userGroups", currentUserGroups);
            this.$store.state.currentUser.userGroups = currentUserGroups;
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    }
  },
  computed: {
    show() {
      let roles = ["admin"];
      return roles.includes(this.$store.state.currentUser.role);
    }
  }
};
</script>
