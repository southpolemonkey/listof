// Application home page
Vue.component('edit-value', {
    template: `
        <div class="col-8">

            <h1 class="mt-5">
                {{ list.name }}
            </h1>

            <p class="lead">
                {{ list.description }}
            </p>
        </div>
    `,
    data: function () {
        return {
            'list': {},
            'queryGetList': `query getList($id: Int!) {
                sysListById(id: $id) {
                    id
                    name
                    description
                }
            }`
        }
    },
    mounted: function () {
        // Get list Id from URL parameters
        var urlParams = new URLSearchParams(window.location.search);
        var listId = parseInt(urlParams.get('listId'));
        this.getList(listId);
      },
    methods: {
        getList(listId) {
            // Method to get a list
            payload = {
                'query': this.queryGetList,
                'variables': { 'id': listId }
            };
            this.$http.post(Vue.prototype.$graphqlUrl, payload).then (
                function(response){
                    if(response.status == "200"){
                        this.list = response.data.data.sysListById;
                    }
                }
            );
        }
    }
});