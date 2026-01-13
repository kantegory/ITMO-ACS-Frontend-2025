import {$host, $authHost} from "@/api/instance";
import AuthApi from "@/api/auth";
import WorkoutApi from "@/api/workout";
import BlogApi from "@/api/blog";

const authApi = new AuthApi($host, $authHost);
const workoutApi = new WorkoutApi($host, $authHost);
const blogApi = new BlogApi($host, $authHost);

export { authApi, workoutApi, blogApi };
