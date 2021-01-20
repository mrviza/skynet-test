import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    summary: 0
  },
  mutations: {
    setSummary(state, payload: number) {
      state.summary = payload;
    }
  },
  actions: {
    saveSummary({ commit }, payload: string) {
      commit("setSummary", payload);
    }
  }
});
