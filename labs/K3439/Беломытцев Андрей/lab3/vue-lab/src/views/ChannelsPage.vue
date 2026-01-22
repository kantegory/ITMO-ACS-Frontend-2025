<template>
  <base-layout>
    <div class="mb-4">
      <div
        class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center gap-3"
      >
        <h1 class="mb-0">Educational YouTube Channels</h1>
        <div class="d-flex flex-wrap gap-2">
          <a href="/youtube/channels.json" download="youtube-channels.json" class="btn btn-warning">
            📥 Download JSON
          </a>
          <button
            class="btn btn-success"
            @click="showAddChannelForm = !showAddChannelForm"
            v-if="!showAddChannelForm"
          >
            ➕ Add New Channel
          </button>
          <button
            class="btn btn-secondary"
            @click="showAddChannelForm = !showAddChannelForm"
            v-else
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>

    <section id="addChannelCard" class="card mb-3 bg-body-tertiary" v-if="showAddChannelForm">
      <div class="card-body">
        <h5 class="card-title">Add New Channel</h5>
        <form id="addChannelForm" @submit.prevent="addChannel">
          <div class="row">
            <div class="col-md-6 mb-2">
              <label for="channel" class="form-label">Channel URL or ID:</label>
              <input
                type="text"
                id="channel"
                name="channel"
                class="form-control"
                placeholder="https://www.youtube.com/channel/..."
                required
                v-model="form.channel"
              />
            </div>
            <div class="col-md-3 mb-2">
              <label for="lang" class="form-label">Language:</label>
              <select id="lang" name="lang" class="form-select" required v-model="form.lang">
                <option value="ru">🇷🇺 Russian</option>
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="de">🇩🇪 German</option>
                <option value="fr">🇫🇷 French</option>
                <option value="pt">🇧🇷 Portuguese</option>
              </select>
            </div>
            <div class="col-md-3 mb-2">
              <label for="tags" class="form-label">Tags (comma-separated):</label>
              <input
                type="text"
                id="tags"
                name="tags"
                class="form-control"
                placeholder="Python,Math"
                v-model="form.tags"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12 mb-2">
              <label class="form-label">Click to add tags:</label>
              <div id="addTagBadges" class="d-flex flex-wrap gap-2">
                <button
                  v-for="tag in Object.keys(allTags)"
                  :key="tag"
                  class="badge"
                  type="button"
                  :style="{
                    'background-color': isTagAdded(tag) ? colors[tag] : 'transparent',
                    border: '1px solid' + (colors[tag] || '#6c757d'),
                    color: isTagAdded(tag) ? '#ffffff' : colors[tag] || '#6c757d',
                    'font-weight': isTagAdded(tag) ? 600 : 500,
                    transition: 'all 0.2s ease',
                    transform: isTagAdded(tag) ? 'scale(1.05)' : 'scale(1)',
                  }"
                  @click="toggleAddTag(tag)"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Add Channel</button>
        </form>
      </div>
    </section>

    <div class="card mb-3 bg-body-tertiary">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 mb-2">
            <label for="filterLang" class="form-label">Filter by Language:</label>
            <select id="filterLang" class="form-select" v-model="filterLang">
              <option value="">All Languages</option>
              <option value="ru">🇷🇺 Russian</option>
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Spanish</option>
              <option value="de">🇩🇪 German</option>
              <option value="fr">🇫🇷 French</option>
              <option value="pt">🇧🇷 Portuguese</option>
            </select>
          </div>
          <div class="col-md-6 mb-2">
            <label for="sortBy" class="form-label">Sort by:</label>
            <select id="sortBy" class="form-select" v-model="sortBy">
              <option value="subs">Subscribers (High to Low)</option>
              <option value="subs_asc">Subscribers (Low to High)</option>
              <option value="views">Views (High to Low)</option>
              <option value="views_asc">Views (Low to High)</option>
              <option value="videos">Videos (High to Low)</option>
              <option value="videos_asc">Videos (Low to High)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12">
            <label class="form-label">Filter by Tag:</label>
            <div id="tagBadges" class="d-flex flex-wrap gap-2">
              <button
                v-for="tag in Object.keys(allTags)"
                :key="tag"
                class="badge"
                :style="{
                  'background-color': filterTag === tag ? colors[tag] : 'transparent',
                  border: '1px solid' + (colors[tag] || '#6c757d'),
                  color: filterTag === tag ? '#ffffff' : colors[tag] || '#6c757d',
                  'font-weight': filterTag === tag ? 600 : 500,
                  transition: 'all 0.2s ease',
                  transform: filterTag === tag ? 'scale(1.05)' : 'scale(1)',
                }"
                @click="filterTag === tag ? (filterTag = '') : (filterTag = tag)"
              >
                {{ tag }} ({{ allTags[tag] }})
              </button>
            </div>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-12">
            <p id="statsText" class="mb-0"></p>
          </div>
        </div>
      </div>
    </div>

    <div id="channels-container" class="row">
      <div
        class="col-md-6 col-lg-4 mb-3"
        v-for="channel in channelsFilteredSorted"
        :key="channel.id"
      >
        <channel-card :channel="channel" />
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from "@/layouts/BaseLayout.vue";
import ChannelCard from "@/components/ChannelCard.vue";
import { mapActions, mapState } from "pinia";
import useServerStore from "@/stores/server";
import { colors } from "@/utils";

export default {
  name: "ChannelsPage",
  components: { BaseLayout, ChannelCard },
  data() {
    return {
      form: {
        channel: "",
        lang: "en",
        tags: "",
      },
      showAddChannelForm: false,
      filterLang: "",
      sortBy: "subs",
      filterTag: "",
      colors,
    };
  },
  computed: {
    ...mapState(useServerStore, ["channels"]),
    allTags() {
      const tagFrequency = {};
      this.channels.forEach((channel) => {
        channel.tags.forEach((tag) => {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        });
      });
      return tagFrequency;
    },
    channelsFilteredSorted() {
      let filtered = this.channels;
      if (this.filterLang) {
        filtered = filtered.filter((channel) => channel.lang === this.filterLang);
      }
      if (this.filterTag) {
        filtered = filtered.filter((channel) => channel.tags.includes(this.filterTag));
      }
      const sortKeyMap = {
        subs: (a, b) => b.subs - a.subs,
        subs_asc: (a, b) => a.subs - b.subs,
        views: (a, b) => b.views - a.views,
        views_asc: (a, b) => a.views - b.views,
        videos: (a, b) => b.video_count - a.video_count,
        videos_asc: (a, b) => a.video_count - b.video_count,
        title: (a, b) => a.title.localeCompare(b.title),
      };
      return filtered.sort(sortKeyMap[this.sortBy]);
    },
  },
  methods: {
    ...mapActions(useServerStore, ["loadChannels", "createChannel"]),
    toggleAddTag(tag) {
      let tags = this.form.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      if (tags.includes(tag)) {
        tags = tags.filter((t) => t !== tag);
      } else {
        tags.push(tag);
      }
      this.form.tags = tags.join(",");
    },
    isTagAdded(tag) {
      if (!this.form.tags) return false;
      return this.form.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t)
        .includes(tag);
    },
    async addChannel() {
      await this.createChannel(this.form);
      this.showAddChannelForm = false;
      this.form = { channel: "", lang: "en", tags: "" };
      await this.loadChannels();
    },
  },
  mounted() {
    this.loadChannels();
  },
};
</script>
