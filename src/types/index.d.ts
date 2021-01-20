import Vue from "vue";

export interface ServiceComponent extends Vue {
  isChosen: boolean;
  price: number;
}

export interface SericeData {
  title: string;
  variants: ServiceVariant[];
}

export interface ServiceVariant {
  title: string;
  description: string;
  color: string;
  price_default: number;
  options: ServiceOption[];
  select: Select[];
}

export interface Select {
  title: string;
  items: ServiceOption[];
}

export interface ServiceOption {
  title: string;
  price: number;
}
