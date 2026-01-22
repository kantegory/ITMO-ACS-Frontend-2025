<template>
  <a
    :href="`https://www.youtube.com/channel/${channel.id}`"
    target="_blank"
    rel="noopener noreferrer"
    class="text-decoration-none"
  >
    <div
      class="card h-100 bg-body-tertiary"
      style="transition: transform 0.2s, box-shadow 0.2s"
      onmouseover="this.style.transform='scale(1.025)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)';"
      onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='';"
    >
      <div class="card-body">
        <div class="d-flex align-items-center">
          <img
            :src="channel.icon_medium"
            referrerpolicy="no-referrer"
            width="60"
            height="60"
            style="border-radius: 50%"
            class="me-3"
            alt="Channel icon"
          />
          <div class="flex-grow-1">
            <h5 class="card-title mb-1">{{ channel.title }} {{ lang[channel.lang] || lang }}</h5>
            <div>
              <small class="text-muted">
                <strong>{{ formatNumber(channel.subs) }}</strong> subs •
                <strong>{{ formatNumber(channel.views) }}</strong> views •
                <strong>{{ formatNumber(channel.video_count) }}</strong> videos
              </small>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <span
            v-for="tag in channel.tags"
            :key="tag"
            class="badge me-1"
            :style="{ backgroundColor: colors[tag] || 'grey' }"
            >{{ tag }}</span
          >
        </div>
      </div>
    </div>
  </a>
</template>

<script>
import { formatNumber, lang, colors } from "@/utils";

export default {
  name: "ChannelCard",
  data() {
    return {
      lang,
      colors,
    };
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatNumber,
  },
};
</script>
