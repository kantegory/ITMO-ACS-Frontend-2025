import { ref } from "vue";
import { http } from "@/api/instance";
import { useRouter } from "vue-router";

const isAuth = ref(!!localStorage.getItem("token"));

export function useAuth() {
  const router = useRouter();

  async function login(email, password) {
    const { data } = await http.get(
      `/users?email=${email}&password=${password}`
    );

    if (data.length === 1) {
      localStorage.setItem("token", data[0].token);
      localStorage.setItem("userId", data[0].id);

      isAuth.value = true;
      router.push("/profile");
    } else {
      alert("Неверный email или пароль");
    }
  }

  async function register(user) {
    await http.post("/users", {
      ...user,
      token: Date.now().toString()
    });
    router.push("/login");
  }

  function logout() {
    localStorage.clear();
    isAuth.value = false;
    router.push("/login");
  }

  return {
    login,
    register,
    logout,
    isAuth
  };
}
