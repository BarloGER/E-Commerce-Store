import axios from "axios";

export const proxy = (target) => {
  return async (req, res) => {
    const { host, "cache-control": _, ...restOfHeaders } = req.headers;

    const axiosConfig = {
      method: req.method,
      url: `${target}${req.url}`,
      data: req.body,
      headers: { ...restOfHeaders, "Cache-Control": "no-cache" },
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
