export default class BlogApi {
    constructor($host, $authHost) {
        this.$host = $host;
        this.$authHost = $authHost;
    }

    async getPosts() {
        try {
            const response = await this.$host.get('/blog-post/get-all');
            return response.data.posts;
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    }

    async getPost(id) {
        try {
            const response = await this.$host.get(`/blog-post/get-one/${id}`);
            return response.data.post;
        } catch (error) {
            console.error('Error fetching post:', error);
            return null;
        }
    }

    async createPost(title, content) {
        try {
            const response = await this.$authHost.post(`/blog-post`, {title, content});
            const data = response.data;
            if (data.error) {
                return { success: false, message: data.error?.message || 'Failed' };
            }
            return { success: true, post: data.post };
        } catch (error) {
            console.error('Error creating post:', error);
            return null;
        }
    }
}
