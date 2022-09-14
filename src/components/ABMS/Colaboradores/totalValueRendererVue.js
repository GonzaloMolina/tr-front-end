export default {
  template: `
        <span>
              <span>{{ cellValue }}</span>
              
          </span>
    `,
  data: function () {
    return {
      cellValue: null,
    };
  },
  created() {
    // this.params contains the cell & row information and is made available to this component at creation time
    // see ICellRendererParams for more details
    this.cellValue = this.getValueToDisplay(this.params);
  },
  methods: {
    buttonClicked() {
      alert(`${this.cellValue} medals won!`);
    },

    getValueToDisplay(params) {
      return params.value;
    },
  },
};