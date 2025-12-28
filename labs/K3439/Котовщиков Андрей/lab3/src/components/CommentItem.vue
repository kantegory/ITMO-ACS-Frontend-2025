<script>
export default {
  name: "CommentItem",

  props: {
    text: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <div class="d-flex justify-content-between p-3">
    <div class="d-flex">
      <img
        src="https://avatars.mds.yandex.net/i?id=18ce000868abd0be3ba1dbb160f69940_l-11953023-images-thumbs&n=13"
        alt="Anonym"
        class="avatar"
      />
      <div class="row">
        <div class="mb-2">Anonym</div>
        <p>{{ text }}</p>
      </div>
    </div>
    <div>{{ date }}</div>
  </div>
</template>
