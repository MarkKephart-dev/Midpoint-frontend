import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class MidpointApi {

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const token = MidpointApi.token || localStorage.getItem("token");

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);

      let message;
      if (err.response && err.response.data) {
        message = err.response.data.error || "An unexpected error occurred";
      } else {
        message = "An unexpected error occurred";
      }
      throw Array.isArray(message) ? message : [message];
    }
  }
  // Individual API routes

  /** Get details on a Location */

  static async getLocations() {
    let res = await this.request(`locations/`);
    return res;
  }

  // Saves a Location

  static async saveLocation(data) {
    return await this.request("locations", data, "post");
  }

  // Edits a Location

  static async editLocationName(locationId, newName) {
    return await this.request(`locations/${locationId}`, { name: newName }, "PATCH");
  }

  // Delete a Location
  
  static async removeLocation(locationId) {
    return await this.request(`locations/${locationId}`, {}, "DELETE");
  }

  // Login a User 

  static async login(data) {
    let res = await this.request(`auth/login`, data, "post");
    const { token, user } = res;
    MidpointApi.token = token // store the token on the class
    localStorage.setItem("token", token);
    return {user, token};
  }

  // Signup a User
  
  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    const { token, user } = res;
    MidpointApi.token = token // store the token on the class
    localStorage.setItem("token", token);
    return {user, token};
  }

  // Edit a User

  static async updateProfile(username, data) {
    const updatedUser = await this.request(`users/${username}`, data, "PUT");
    return updatedUser;
  }

}

export default MidpointApi;