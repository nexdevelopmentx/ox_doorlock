export type StringField = string | null | undefined;
export type NumberField = number | null | undefined;

export interface ItemField {
  name: StringField;
  metadata?: StringField;
  remove: boolean | null;
}

export interface GroupField {
  name: StringField;
  grade: NumberField;
}

export type LockpickField = string | { areaSize: number; speedMultiplier: number };

export interface FormState {
  id?: number;
  name: StringField;
  passcode: StringField;
  autolock: NumberField;
  items: ItemField[];
  characters: StringField[];
  groups: GroupField[];
  maxDistance: NumberField;
  doorRate: NumberField;
  lockSound: StringField;
  unlockSound: StringField;
  lockpickDifficulty: LockpickField[];
  auto: boolean | null;
  state: boolean | null;
  lockpick: boolean | null;
  hideUi: boolean | null;
  doors: boolean | null;
  holdOpen: boolean | null;
}

export interface DoorColumn extends Omit<FormState, 'groups'> {
  id: number;
  name: string;
  zone: string;
  groups: { [k: string]: number };
}
