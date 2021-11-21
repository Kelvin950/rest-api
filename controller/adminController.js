const Car = require("../Model/Car");

exports.createData = async (req, res, next) => {
  try {
    if (!req.files["image"][0] || !req.files["gallery"]) {
      const error = new Error(" no file submitted");
      error.statusCode = 422;
      throw error;
    }

    console.log(req.body, req.files);

    const {
      model,
      make,
      year,
      engineCapacity,
      seating,
      horsepower,
      fueltype,
      transmission,
      enginetype,
      price,
    } = req.body;

    const headPic = req.files["image"][0].path.replace(/\\/g, "/").slice(7);
    const otherImages = req.files["gallery"].map((g) => {
      return g.path.replace(/\\/g, "/").slice(7);
    });

    const carDetails = {
      model: model,
      make: make,
      price: +price,
      year: year,
      headPic: headPic,
      otherImages: otherImages,
      specification: {
        engineCapacity: engineCapacity,
        transmission: transmission,
        seating: +seating,
        horsepower: horsepower,
        fueltype: fueltype,
        enginetype: enginetype,
      },
    };
    const saveCarDetails = await new Car(carDetails).save();

    res.status(200);
    res.json({
      message: "done",
      saveCarDetails: saveCarDetails,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
