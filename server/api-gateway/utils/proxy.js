import axios from "axios";

export const proxy = (target) => {
  return async (req, res) => {
    const url = `${target}${req.url}`;
    console.log(`Weiterleitung an: ${url}`);

    const axiosConfig = {
      method: req.method,
      url: url,
      data: req.body,
      headers: { ...req.headers, "Cache-Control": "no-cache" },
    };

    try {
      const response = await axios(axiosConfig);
      res.send(response.data);
    } catch (error) {
      console.error(error);
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send("Server Error");
      }
    }
  };
};
