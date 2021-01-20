<template>
  <div :style="{ 'border-color': service.color }" class="service">
    <div class="service__header">
      <h3>{{ service.title }}</h3>
      <span>{{ price }} ₽</span>
    </div>
    <div class="service__body">
      <div class="service__desc">
        <p v-for="(p, index) of descriptionParagraphs" :key="index">
          {{ p }}
        </p>
      </div>
      <div class="service__additionals">
        <template v-if="service.select.length">
          <div
            class="service__select"
            v-for="(select, id) of service.select"
            :key="id"
          >
            <p>{{ select.title }}</p>
            <select v-model="selected[`${id}`]" @change="priceUpdate">
              <option
                v-for="(option, id) of select.items"
                :value="option.price"
                :key="id"
                >{{ option.title }}</option
              >
            </select>
          </div>
        </template>
        <div
          class="service__options"
          v-for="(option, id) of service.options"
          :key="id"
          @click="toggleOption(id)"
        >
          <input
            type="checkbox"
            v-model="options[`${id}`]"
            @change="priceUpdate"
          />
          <p>{{ option.title }}</p>
        </div>
        <button
          class="service__btn"
          :class="{ '--chosen': isChosen }"
          @click="chosen"
        >
          {{ isChosen ? "Выбрано" : "Выбрать" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { ServiceVariant } from "../types";

export default Vue.extend({
  name: "Service",
  props: {
    service: Object as PropType<ServiceVariant>,
    isChosen: {
      type: Boolean,
      default: false
    }
  },
  data(): {
    selected: { [key: string]: number };
    options: { [key: string]: number };
  } {
    return {
      selected: {},
      options: {}
    };
  },
  computed: {
    price(): number {
      let sum = this.service.price_default;

      for (const key in this.selected) {
        const item = this.selected[key];

        if (item) {
          sum += item;
        }
      }

      for (const key in this.options) {
        const item = this.options[key];
        const index = parseInt(key);

        if (item) {
          sum += this.service.options[index].price;
        }
      }

      return sum;
    },
    descriptionParagraphs(): string[] {
      const paragraphs = this.service.description.split("\n");
      return paragraphs;
    }
  },
  mounted() {
    for (const key in this.service.select) {
      const item = this.service.select[key];

      this.$set(this.selected, key, item.items[0].price);
    }
  },
  methods: {
    priceUpdate() {
      if (!this.isChosen) return;

      this.$emit("price-update");
    },
    chosen() {
      this.$emit("chose");
    },
    toggleOption(id: number) {
      const index = id.toString();
      const value = !this.options[id];

      this.$set(this.options, id, value);
      this.priceUpdate();
    }
  }
});
</script>

<style lang="scss">
.service {
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 8px solid black;
  padding: 12px 16px;

  &__header {
    display: flex;
    line-height: 24px;
    vertical-align: center;
    justify-content: space-between;

    h3 {
      margin: 0;
      font-size: 24px;
    }

    span {
      font-size: 24px;
      font-weight: 500;
    }
  }

  &__body {
    margin-top: 16px;
    display: flex;
  }

  &__desc {
    min-width: 70%;
    width: 70%;
    border-right: #dddddd solid 1px;
  }

  &__additionals {
    width: 100%;
    padding: 16px;
  }

  &__select {
    width: 100%;
    margin-bottom: 16px;

    p {
      margin-top: 0;
      font-size: 14px;
    }

    select {
      width: 100%;
      height: 40px;
    }
  }

  &__options {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    border: #dddddd solid 1px;
    margin-bottom: 16px;
    cursor: pointer;

    p {
      width: 100%;
      text-align: center;
      color: #adadad;
    }

    input {
      margin-left: 8px;
    }
  }

  &__btn {
    width: 100%;
    background-color: #98abba;
    border: none;
    outline: none;
    color: #ffffff;
    height: 40px;
    border-radius: 5px;

    &.--chosen {
      background-color: #2fcb5a;
    }
  }
}
</style>
