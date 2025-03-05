const whiteList = [
  `http://localhost:${process.env.PORT || 3000}`,
  "http://localhost:4200",
]; //frontend to be added
export const corsOptions = {
  origin: (originWeb, callback) => {
    if (!originWeb || whiteList.includes(originWeb)) {
      callback(null, true);
    } else {
      callback(new Error("not allowed"));
    }
  },
  optionsSuccessStatus: 200,
};
