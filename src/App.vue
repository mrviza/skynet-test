<template>
  <div id="app">
    <div
      class="step"
      v-for="(types, typeId) of services"
      :class="{ hidden: currentStep !== typeId }"
      :key="typeId"
    >
      <h2 class="step__header" @click="setStep(typeId)">{{ types.title }}</h2>
      <div
        class="step__variants"
        v-for="(service, serviceId) of types.variants"
        :key="serviceId"
      >
        <service
          ref="service"
          :service="service"
          :isChosen="chosen[`${typeId}`] === serviceId"
          @chose="selectService($event, typeId, serviceId)"
          @price-update="updateSummary"
        />
      </div>
    </div>
    <div class="summary">
      <button class="summary__button">
        <span class="summary__text">Итого к оплате</span>
        <span class="summary__sum">{{ summary }} ₽</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import Service from "./components/Service.vue";
import { SericeData, ServiceComponent } from "./types";

export default Vue.extend({
  name: "App",
  components: {
    Service
  },
  data(): {
    services: SericeData[] | null;
    chosen: { [key: string]: string };
    currentStep: number;
  } {
    return {
      services: null,
      chosen: {},
      currentStep: 0
    };
  },
  computed: {
    ...mapState(["summary"])
  },
  async mounted() {
    const data = await fetch("/data.json");
    const json: SericeData[] = await data.json();

    this.services = json;

    for (const index in this.services) {
      this.$set(this.chosen, index, 0);
    }

    this.$nextTick(() => {
      this.updateSummary();
    });
  },
  methods: {
    ...mapActions(["saveSummary"]),
    selectService(event: MouseEvent, type: number, service: number) {
      this.$set(this.chosen, type.toString(), service);
      this.$nextTick(() => {
        this.updateSummary();
        this.nextStep();
      });
    },
    updateSummary() {
      const refs = this.$refs.service as
        | ServiceComponent
        | ServiceComponent[]
        | undefined;

      if (!refs) return;

      if (Array.isArray(refs)) {
        let sum = 0;

        for (const ref of refs) {
          if (ref.isChosen) {
            sum += ref.price;
          }
        }

        this.saveSummary(sum);
      } else {
        this.saveSummary(refs.price);
      }
    },
    nextStep() {
      if (!this.services) return;

      const maxStepCount = this.services.length - 1;

      if (this.currentStep < maxStepCount) {
        this.setStep(this.currentStep + 1);
      }
    },
    setStep(step: number) {
      this.currentStep = step;
    }
  }
});
</script>

<style lang="scss">
#app {
  .step {
    margin-top: 16px;
    border-top: #dddddd solid 2px;

    &__header {
    }

    &__variants {
      height: 100%;
      overflow: hidden;
    }

    &.hidden {
      .step__header {
        color: #dddddd;
        cursor: pointer;
      }

      .step__variants {
        height: 0;
      }
    }
  }

  .summary {
    button {
      width: 100%;
      background-color: #2fcb5a;
      color: #ffffff;
      height: 80px;
      font-size: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 5px;
      border: none;
    }

    span {
      margin: 0 12px;
    }
  }
}
</style>
