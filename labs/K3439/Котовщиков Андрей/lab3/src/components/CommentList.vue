<script>
import { mapActions, mapState } from "pinia";
import CommentItem from "./CommentItem.vue";
import useCommentsStore from "@/stores/comments";

export default {
  name: "CommentList",

  components: { CommentItem },

  computed: {
    ...mapState(useCommentsStore, ["comments"]),
  },

  methods: {
    ...mapActions(useCommentsStore, ["addComment"]),

    async onSendComment() {
      if (this.text && this.$refs.checkbox.checked) {
        await this.addComment({ text: this.text });
        this.text = "";
      }
    },
  },

  data() {
    return {
      text: "",
    };
  },
};
</script>

<template>
  <div class="container mb-5">
    <div class="row justify-content-center">
      <div class="col-6">
        <div class="card-bg card">
          <div class="card-header text-center p-3">
            <h3 class="mb-0"><i class="bi bi-chat-square-text me-2"></i>Оставить отзыв</h3>
          </div>
          <div class="card-body p-4">
            <form class="review-form">
              <div class="mb-3">
                <textarea
                  v-model="text"
                  class="input-bg review-input form-control"
                  rows="5"
                  placeholder="Ваш отзыв..."
                  required
                ></textarea>
                <div class="form-text card-bg">Максимальная длина отзыва - 500 символов.</div>
              </div>

              <div class="mb-3 form-check">
                <input
                  ref="checkbox"
                  id="fz-checkbox"
                  type="checkbox"
                  class="form-check-input"
                  required
                />
                <label class="form-check-label" for="fz-checkbox">
                  Я согласен на обработку персональных данных
                </label>
              </div>

              <div class="d-flex justify-content-end">
                <button @click.prevent="onSendComment" class="review-btn btn btn-outline-secondary">
                  Отправить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container reviews">
    <h2 class="mb-4">Отзывы</h2>
    <div v-for="comment in comments">
      <comment-item :text="comment.text" :date="comment.date" />
    </div>
  </div>
</template>
