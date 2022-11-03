module.exports = {
  get now() {
    return new Date();
  },
  get today() {
    return this.getDayStart();
  },
  getDayStart: function (days = 0) {
    return new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate() + days
    );
  },
  getDayEnd: function (days = 0) {
    return new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate() + days,
      23,
      59,
      59,
      999
    );
  },
};
