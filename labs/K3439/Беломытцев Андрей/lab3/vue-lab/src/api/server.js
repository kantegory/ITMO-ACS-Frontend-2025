class ServerApi {
  constructor(instance) {
    this.API = instance;
  }

  createChannel = async (data) => {
    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("channel", data.channel);
    formData.append("lang", data.lang);
    formData.append("tags", data.tags);
    return this.API({
      method: "POST",
      url: "/youtube/add",
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  getAllChannels = async () => {
    return this.API({
      url: "/youtube/channels.json",
    });
  };

  getProfile = async () => {
    const token = localStorage.getItem("access_token");
    return this.API({
      url: "/profile-data",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  };

  login = async (username, password) => {
    const urlData = new URLSearchParams();
    urlData.append("username", username);
    urlData.append("password", password);
    return this.API({
      method: "POST",
      url: "/auth/token",
      data: urlData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  };

  deleteAccount = async () => {
    const token = localStorage.getItem("access_token");
    return this.API({
      method: "DELETE",
      url: "/profile-data",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  };
}

export default ServerApi;
