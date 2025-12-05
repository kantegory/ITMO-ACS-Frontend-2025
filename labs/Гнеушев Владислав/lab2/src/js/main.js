import { initForgotPasswordFlow, initAuthForms } from './auth.js';
import { initBlogPage, initBlogPostPage } from './blog.js';
import { initProfilePage } from './profile.js';
import { initWorkoutDetailPage, initWorkoutsPage } from './workouts.js';

document.addEventListener('DOMContentLoaded', () => {
    initWorkoutsPage();
    initWorkoutDetailPage();
    initBlogPage();
    initBlogPostPage();
    initAuthForms();
    initProfilePage();
    initForgotPasswordFlow();
});
