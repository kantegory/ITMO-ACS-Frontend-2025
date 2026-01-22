<template>
    <div class="card h-100 shadow-sm">
        <div class="card-body">
            <div class="mb-2 text-muted">{{ getPrettyDate(post.createdAt) }}</div>
            <h3 class="card-title">{{ post.title }}</h3>
            <router-link :to="`/blog/${post.id}`" class="btn btn-link px-0" :aria-label="`Читать далее о ${post.title}`">Читать далее &rarr;</router-link>
        </div>
    </div>
</template>

<script>
import {getPrettyDate} from "../utils/date.js";

export default {
    name: "BlogPost",
    methods: {getPrettyDate},

    props: {
        post: {
            title: {
                type: String,
                required: true,
            },
            id: {
                type: Number,
                required: false,
            },
            createdAt: {
                type: Number,
                required: false,
            },
        }
    },
};
</script>