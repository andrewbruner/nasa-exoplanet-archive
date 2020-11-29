const vm = new window.Vue({
    el: '#app',
    data: {
        exoplanets: [],
        loading: true,
    },
});

fetch('/api')
  .then(response => response.json())
  .then(data => { vm.exoplanets = data; vm.loading = false; });