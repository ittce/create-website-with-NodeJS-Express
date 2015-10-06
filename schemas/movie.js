var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
  doctor: String,
  title : String,
  language: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
  meta: {
    creatAt: {
      type: Date,
      default: Data.now()
    },
    updateAt: {
      type: Date,
      detfault: Data.now()
    }
  }
});

MovieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Data.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  next();
});

MovieSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateUp')
      .exec(cb);
  },
  findById: function (id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
};

module.exports = MovieSchema;