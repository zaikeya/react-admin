import axios from "axios";
import qs from "qs";

const authProvider = {
  login: ({ username, password }) => {
    const options = {
      url:
        process.env.NODE_ENV === "production"
          ? "https://api.test.com/v1/clients/web/login"
          : "/v1/clients/web/login",
      method: "POST",
      data: qs.stringify({ mobile: username, password }),
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
    };
    return axios(options)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          const { data } = response;
          throw new Error(data.message);
        } else {
          const { data } = response;
          localStorage.setItem("auth", JSON.stringify(data));
        }
      })
      .catch((error) => {
        //这里是测试
        //this is a test
        return localStorage.setItem("auth", JSON.stringify("TEST"));
        // const { response } = error;
        // console.log(error);
        // if (response.status === 422) {
        //   const { data } = response;
        //   throw new Error(data.message);
        // } else {
        //   const { data } = response;
        //   throw new Error(data.message);
        // }
      });
  },
  checkError: (error) => {
    if (error?.message.includes("401")) {
      localStorage.removeItem("auth");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData) {
      return Promise.resolve();
    }
    return Promise.reject();
  },
  logout: () => {
    localStorage.removeItem("auth");
    return Promise.resolve();
  },
  getIdentity: () => {
    try {
      const { accountId, fullName } = JSON.parse(localStorage.getItem("auth"));
      return Promise.resolve({ id: accountId, fullName });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getPermissions: () => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    let role = "pending";
    if (authData?.accountId) {
      role = "admin";
    }
    return Promise.resolve(role);
  },
};

export default authProvider;
