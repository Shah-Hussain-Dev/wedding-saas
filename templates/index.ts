import React from "react";
import NoorNikah, { defaultData as noorNikahData } from "./noor-e-nikah";
import RoyalLotus, { defaultData as royalLotusData } from "./royal-lotus";
import CrimsonRoyale, { defaultData as crimsonRoyaleData } from "./crimson-royale";
import EmeraldNoir, { defaultData as emeraldNoirData } from "./emerald-noir";
import RoyalElegance, { defaultData as royalEleganceData } from "./royal-elegance";
import ModernMinimal, { defaultData as modernMinimalData } from "./modern-minimal";
import EmeraldQasr, { defaultData as emeraldQasrData } from "./emerald-qasr";
import GulENoor, { defaultData as gulENoorData } from "./gul-e-noor";
import AzureNikah, { defaultData as azureNikahData } from "./azure-nikah";
import KitabENikah, { defaultData as kitabENikahData } from "./kitab-e-nikah";
import RoseGoldBlush, { defaultData as roseGoldBlushData } from "./rose-gold-blush";

export {
  NoorNikah,
  RoyalLotus,
  CrimsonRoyale,
  EmeraldNoir,
  RoyalElegance,
  ModernMinimal,
  EmeraldQasr,
  GulENoor,
  AzureNikah,
  KitabENikah,
  RoseGoldBlush,
  noorNikahData,
  royalLotusData,
  crimsonRoyaleData,
  emeraldNoirData,
  royalEleganceData,
  modernMinimalData,
  emeraldQasrData,
  gulENoorData,
  azureNikahData,
  kitabENikahData,
  roseGoldBlushData,
};

export const TEMPLATES_MAP: Record<string, React.ComponentType<{ data?: any }>> = {
  "noor-e-nikah": NoorNikah,
  "royal-lotus": RoyalLotus,
  "crimson-royale": CrimsonRoyale,
  "emerald-noir": EmeraldNoir,
  "royal-elegance": RoyalElegance,
  "modern-minimal": ModernMinimal,
  "emerald-qasr": EmeraldQasr,
  "gul-e-noor": GulENoor,
  "azure-nikah": AzureNikah,
  "kitab-e-nikah": KitabENikah,
  "rose-gold-blush": RoseGoldBlush,
};

export const TEMPLATE_DEFAULT_DATA: Record<string, any> = {
  "noor-e-nikah": noorNikahData,
  "royal-lotus": royalLotusData,
  "crimson-royale": crimsonRoyaleData,
  "emerald-noir": emeraldNoirData,
  "royal-elegance": royalEleganceData,
  "modern-minimal": modernMinimalData,
  "emerald-qasr": emeraldQasrData,
  "gul-e-noor": gulENoorData,
  "azure-nikah": azureNikahData,
  "kitab-e-nikah": kitabENikahData,
  "rose-gold-blush": roseGoldBlushData,
};

export function getTemplateComponent(templateId: string): React.ComponentType<{ data?: any }> {
  return TEMPLATES_MAP[templateId] || NoorNikah;
}

export function getTemplateDefaultData(templateId: string): any {
  return TEMPLATE_DEFAULT_DATA[templateId] || noorNikahData;
}

